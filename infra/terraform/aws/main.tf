# Sample: same container images on AWS (ECS Fargate + ALB).
# This is the AWS half of the cross-cloud contract:
#   image_api, image_web, env map, desired_count
#
# Apply from this directory after `terraform init`.
# Replace account/region/images before use.

terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

module "labels" {
  source  = "../modules/labels"
  project = var.project
  env     = var.env
  cloud   = "aws"
}

variable "project" { default = "kkdesigners" }
variable "env" { default = "prod" }
variable "region" { default = "ap-south-1" }
variable "image_api" { type = string }
variable "image_web" { type = string }
variable "desired_count" { default = 2 }
variable "vpc_id" { type = string }
variable "subnet_ids" { type = list(string) }
variable "admin_dash_key" {
  type      = string
  sensitive = true
}

resource "aws_ecs_cluster" "this" {
  name = module.labels.name
  tags = module.labels.tags
}

resource "aws_iam_role" "exec" {
  name = "${module.labels.name}-exec"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "exec" {
  role       = aws_iam_role.exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_lb" "this" {
  name               = module.labels.name
  internal           = false
  load_balancer_type = "application"
  subnets            = var.subnet_ids
  tags               = module.labels.tags
}

resource "aws_lb_target_group" "web" {
  name     = "${module.labels.name}-web"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  health_check { path = "/" }
}

resource "aws_lb_target_group" "api" {
  name     = "${module.labels.name}-api"
  port     = 8000
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  health_check { path = "/api/" }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

# Public API surface on the same hostname (API Gateway alternative: attach
# aws_apigatewayv2_api HTTP API to the api target group via VPC Link).
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
  condition {
    path_pattern { values = ["/api", "/api/*"] }
  }
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${module.labels.name}-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.exec.arn
  container_definitions = jsonencode([{
    name  = "api"
    image = var.image_api
    portMappings = [{ containerPort = 8000 }]
    environment = [
      { name = "ADMIN_DASH_KEY", value = var.admin_dash_key },
      { name = "CORS_ORIGINS", value = "https://${aws_lb.this.dns_name}" }
    ]
  }])
}

resource "aws_ecs_service" "api" {
  name            = "api"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = var.subnet_ids
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 8000
  }
}

output "public_url" { value = "http://${aws_lb.this.dns_name}" }
