#!/bin/bash

set -a
source /tmp/.env
set +a

echo "DATABASE: $DATABASE_NAME"
echo "DATABASE: $DATABASE_USERNAME"

sudo DEBIAN_FRONTEND=noninteractive apt-get update --fix-missing
sudo DEBIAN_FRONTEND=noninteractive apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-client-8.0 mysql-server-core-8.0
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y npm nodejs
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y unzip

sudo mkdir -p /home/csye6225
if [ $(getent group csye6225) ]; then
        log "Group already exists.. skipping group creation"
else
        sudo groupadd csye6225
fi 

if id "sridhar" &>/dev/null; then
        log "User already exists.. skipping user creation"
else
        sudo useradd -m -g csye6225 sridhar
fi

sudo mysql -e "CREATE DATABASE ${DATABASE_NAME};"
sudo mysql -e "ALTER USER '${DATABASE_USERNAME}'@'localhost' IDENTIFIED BY '${DATABASE_PASSWORD}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ${DATABASE_NAME}.* TO '${DATABASE_USERNAME}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

sudo mkdir -p /opt/csye6225
sudo unzip /opt/csye6225/webapp.zip -d /opt/csye6225
sudo mv /opt/csye6225/.env /opt/csye6225/webapp/.env