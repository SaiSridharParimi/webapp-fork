variable "username" {
  type    = string
  default = "ubuntu"
}

variable "profile" {
  type    = string
  default = "github"
}

variable "region" {
    type = string
    default = "us-west-2"
}

variable "gcp_project_id" {
  type    = string
  default = "webapp-dev-451904"
}

variable "gcp_zone" {
  type    = string
  default = "us-central1-a"
}

variable "account_file"{
  type = string
  default = ".gcp-key.json"
}