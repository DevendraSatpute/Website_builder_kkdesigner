# Sample: same container images on GCP (Cloud Run).
# Same contract as ../aws: image_api, image_web, env, scale.

terraform {
  required_version = ">= 1.6.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

module "labels" {
  source  = "../modules/labels"
  project = var.project
  env     = var.env
  cloud   = "gcp"
}

variable "project" { default = "kkdesigners" }
variable "project_id" { type = string }
variable "env" { default = "prod" }
variable "region" { default = "asia-south1" }
variable "image_api" { type = string }
variable "image_web" { type = string }
variable "min_instances" { default = 0 }
variable "max_instances" { default = 8 }
variable "admin_dash_key" {
  type      = string
  sensitive = true
}

resource "google_cloud_run_v2_service" "api" {
  name     = "${module.labels.name}-api"
  location = var.region
  template {
    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }
    containers {
      image = var.image_api
      ports { container_port = 8000 }
      env {
        name  = "ADMIN_DASH_KEY"
        value = var.admin_dash_key
      }
    }
  }
}

resource "google_cloud_run_v2_service" "web" {
  name     = "${module.labels.name}-web"
  location = var.region
  template {
    scaling {
      min_instance_count = 0
      max_instance_count = var.max_instances
    }
    containers {
      image = var.image_web
      ports { container_port = 80 }
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "api_public" {
  name     = google_cloud_run_v2_service.api.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "web_public" {
  name     = google_cloud_run_v2_service.web.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "api_url" { value = google_cloud_run_v2_service.api.uri }
output "web_url" { value = google_cloud_run_v2_service.web.uri }
