# webapp

## Prerequisites 
- Node.js
- MySQL
- DB and Port Details 

## Instructions to run the application
- Clone the repository from webapp repository
- Write the `.env` file
- Direct into src folder 
- Run `npm install` to install node dependencies
- Run `node index.js` to start the application

## Stopping and Starting Database Server
- To stop the server - `sudo //usr/local/mysql-9.2.0-macos15-arm64/support-files/mysql.server stop`
- To start the server - `sudo //usr/local/mysql-9.2.0-macos15-arm64/support-files/mysql.server start`

## API
- Endpoint : 
    - Method : `GET`
    - URL : `localhost:8080/healthz`
- Using `curl` :
    - Command : `curl -vvvv http://localhost:8080/healthz`