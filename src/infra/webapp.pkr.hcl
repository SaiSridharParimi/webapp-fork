packer {
  required_plugins {
    amazon = {
      version = ">= 1.1.4"
      source  = "github.com/hashicorp/amazon"
    }
    # googlecompute = {
    #   version = ">= 1.0.0"
    #   source  = "github.com/hashicorp/googlecompute"
    # }
  }
}

source "amazon-ebs" "ubuntu" {
  ami_name      = "aws-packer-${clean_resource_name(timestamp())}"
  instance_type = "t2.micro"
  region        = var.region
  profile       = var.profile
  source_ami_filter {
    filters = {
      name                = "ubuntu/images/*ubuntu-noble-24.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]
  }
  ssh_username = var.username
  launch_block_device_mappings {
    device_name           = "/dev/sda1"
    volume_size           = 25
    volume_type           = "gp2"
    delete_on_termination = true
  }
  ami_users = [var.ami_users]
}

# source "googlecompute" "ubuntu" {
#   project_id       = var.gcp_project_id
#   source_image     = "ubuntu-2204-jammy-v20231030"
#   zone             = var.gcp_zone
#   machine_type     = "e2-micro"
#   ssh_username     = var.username
#   image_name       = var.image_name
#   image_family     = var.image_family
#   disk_size        = 25
#   disk_type        = "pd-ssd"
#   credentials_file = var.account_file
# }

build {
  name = "learn-packer"
  sources = [
    "source.amazon-ebs.ubuntu",
    # "source.googlecompute.ubuntu"
  ]

  provisioner "shell" {
    inline = [
      "sudo mkdir -p /opt/csye6225",
      "sudo chown -R ubuntu:ubuntu /opt/csye6225",
      "sudo chmod 775 /opt/csye6225"
    ]
  }

  provisioner "file" {
    source      = "/home/runner/work/webapp/webapp/webapp.zip"
    destination = "/opt/csye6225/webapp.zip"
  }

  provisioner "file" {
    source      = "webapp.service"
    destination = "/tmp/webapp.service"
  }

  # provisioner "file" {
  #   source      = "scripts/.env"
  #   destination = "/tmp/.env"
  #   only        = ["googlecompute.ubuntu"]
  # }

  provisioner "file" {
    source      = "cw-config.json"
    destination = "/tmp/cw-config.json"
  }

  provisioner "shell" {
    script = "scripts/setup.sh"
    # environment_vars = [
    #   "CLOUD_PROVIDER={{if eq .Source \"source.googlecompute.ubuntu\"}}gcp{{else}}aws{{end}}"
    # ]
  }

  # provisioner "shell" {
  #   inline = [
  #     "gcloud compute images add-iam-policy-binding family/${var.image_family} --project=${var.gcp_project_id} --member='serviceAccount:${var.demo_project_id}@developer.gserviceaccount.com' --role='roles/compute.imageUser'"
  #   ]
  #   only = ["googlecompute.ubuntu"]
  # }

}
