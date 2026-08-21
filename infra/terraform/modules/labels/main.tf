variable "project" { type = string }
variable "env" { type = string }
variable "cloud" { type = string }

locals {
  name = "${var.project}-${var.env}"
  tags = {
    project     = var.project
    environment = var.env
    cloud       = var.cloud
    app         = "kkdesigners"
  }
}

output "name" { value = local.name }
output "tags" { value = local.tags }
