packer {
  required_plugins {
    amazon = {
      version = ">= 1.1.4"
      source  = "github.com/hashicorp/amazon"
    }
    googlecompute = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

source "amazon-ebs" "ubuntu" {
  ami_name      = "aws-packer-1"
  instance_type = "t2.micro"
  region        = var.region
  profile       = var.profile
  source_ami_filter {
    filters = {
      name                = "ubuntu/images/*ubuntu-jammy-22.04-amd64-server-*"
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
}

source "googlecompute" "ubuntu" {
  project_id   = var.gcp_project_id
  source_image = "ubuntu-2204-jammy-v20231030"
  zone         = var.gcp_zone
  machine_type = "e2-micro"
  ssh_username = var.username
  image_name   = "gcp-packer-image-{{timestamp}}"
  image_family = "webapp"
  disk_size    = 25
  disk_type    = "pd-standard"
  credentials_file = var.account_file
}

build {
  name = "learn-packer"
  sources = [
    "source.amazon-ebs.ubuntu",
    "source.googlecompute.ubuntu"
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

  provisioner "file"{
    source = "webapp.service"
    destination = "/tmp/webapp.service"
  }  

  provisioner "file" {
    source      = "scripts/.env" 
    destination = "/tmp/.env" 
  }

  provisioner "shell" {
    script = "scripts/setup.sh"
  }
}
