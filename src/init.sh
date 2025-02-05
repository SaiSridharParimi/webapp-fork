#!/bin/bash

set -e

VERBOSE=true

log(){
    if [ "$VERBOSE" = true ]; then
        echo "[INFO] $1"
    fi
}

ENV_FILE="/opt/csye6225/.env"

log  "Loading .env file..."
if [ -f $ENV_FILE ]; then
    log ".env file was found"
    export $(grep -v "^#" "$ENV_FILE" | xargs)
    log ".env file loaded"
else
    log "No .env file found"
fi

if [ "$DATABASE_PASSWORD" ]; then
        log "Password is present in .env"
else
        echo "Password is not set in .env"
fi

log "Updating the package lists..."
sudo apt update -y

log "Upgrading packages..."
sudo apt upgrade -y

log "Installing required packages..."
SWAPFILE="/swapfile"
if [ ! -f "$SWAPFILE" ]; then
    log "Creating and enabling swap space..."
    sudo fallocate -l 1G "$SWAPFILE"
    sudo chmod 600 "$SWAPFILE"
    sudo mkswap "$SWAPFILE"
    sudo swapon "$SWAPFILE"
    echo "$SWAPFILE none swap sw 0 0" | sudo tee -a /etc/fstab
else
    log "Swap file already exists, skipping creation."
fi

log "Installing MySQL server..."
sudo apt install -y mysql-server

log "Installing unzip..."
sudo apt install -y unzip

log "Installing npm..."
sudo apt install -y npm

log "Restarting MySQL..."
sudo systemctl restart mysql

log "Enabling MySQL..."
sudo systemctl enable mysql

log "Configuring Database..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$DATABASE_PASSWORD';"
sudo mysql -e "FLUSH PRIVILEGES;"

log "Creating Database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DATABASE_NAME;"

log "Creating Group..."
if [ $(getent group csye6225) ]; then
        log "Group already exists.. skipping group creation"
else
        sudo groupadd csye6225
fi

log "Creating User..."
if id "sridhar" &>/dev/null; then
        log "User already exists... skipping user creation"
else
        sudo useradd -m -g csye6225 sridhar
fi

log "Creating target directory..."
sudo mkdir /opt/csye6225 || true

log "Unzipping folder to target directory..."
sudo unzip "/opt/csye6225/webapp.zip" -d "/opt/csye6225"

log "Permissions to folders..."
sudo chmod -R 764 "/opt/csye6225"
                                                                                                                                                                                                                     
