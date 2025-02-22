#!/bin/bash

set -a
source /tmp/.env
set +a

echo "DATABASE: $DATABASE"
echo "DATABASE: $DATABASE_USERNAME"

sudo DEBIAN_FRONTEND=noninteractive apt-get update --fix-missing
sudo DEBIAN_FRONTEND=noninteractive apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-client-8.0 mysql-server-core-8.0
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y npm nodejs

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

sudo chown -R sridhar:csye6225 /home/csye6225

sudo mysql -e "CREATE DATABASE ${DATABASE};"
sudo mysql -e "ALTER USER '${DATABASE_USERNAME}'@'localhost' IDENTIFIED BY '${DATABASE_PASSWORD}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ${DATABASE}.* TO '${DATABASE_USERNAME}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"