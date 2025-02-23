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
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y unzip

sudo mkdir -p /home/csye6225
if [ $(getent group csye6225) ]; then
        log "Group already exists.. skipping group creation"
else
        sudo groupadd csye6225
fi 

if id "csye6225" &>/dev/null; then
        log "User already exists.. skipping user creation"
else
        sudo useradd -m -g csye6225 csye6225
fi

sudo mysql -e "CREATE DATABASE ${DATABASE_NAME};"

sudo mysql --user=root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';
ALTER USER 'root'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DATABASE_NAME}.* TO '${DATABASE_USERNAME}'@'127.0.0.1';
FLUSH PRIVILEGES;
EOF

sudo service mysql restart

sudo mkdir -p /opt/csye6225
sudo unzip /opt/csye6225/webapp.zip -d /opt/csye6225
sudo cp /tmp/.env /opt/csye6225/src/.env

sudo chown -R csye6225:csye6225 /opt/csye6225/

cd /opt/csye6225/src || exit 1
echo "Installing Node.js dependencies..."
sudo npm install
sudo chown -R csye6225:csye6225 node_modules