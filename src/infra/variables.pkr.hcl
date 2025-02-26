variable "username" {
  type    = string
  default = "ubuntu"
}

variable "profile" {
  type    = string
  default = "github"
}

variable "region" {
  type    = string
  default = "us-west-2"
}

variable "gcp_project_id" {
  type    = string
  default = env("DEV_PROJECT_ID")
}

variable "gcp_zone" {
  type    = string
  default = "us-central1-a"
}

variable "account_file" {
  type    = string
  default = ".gcp-key.json"
}

variable "ami_users" {
  type    = string
  default = env("AMI_USER")
}

variable "demo_project_id" {
  type    = string
  default = env("DEMO_PROJECT_ID")
}