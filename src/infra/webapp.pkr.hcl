packer {
  required_plugins {
    amazon = {
      version = ">= 1.1.4"
      source  = "github.com/hashicorp/amazon"
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

build {
  name = "learn-packer"
  sources = [
    "source.amazon-ebs.ubuntu"
  ]

  provisioner "file" {
      source      = "webapp.zip"
      destination = "/opt/csye6225/webapp.zip"
    }

  provisioner "file" {
    source      = "scripts/.env"
    destination = "/tmp/.env"
  }

  provisioner "file" {
    source      = "scripts/.env" 
    destination = "/tmp/.env" 
  }

  provisioner "shell" {
    script = "scripts/setup.sh"
  }
}
