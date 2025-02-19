# webapp

## Prerequisites 
- Node.js
- MySQL
- DB and Port Details 
- DigitalOcean

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


## Connecting to Ubuntu Server
- `ssh -i PathToPrivateKey Username@publicIPv4`

## Copying zip file to Ubuntu Server from local
- `scp -i ~/.ssh/do sourceDirectory/zipFile Username@publicIPv4:PathToSaveZipFile`

## Steps to run the shell script
- Create a droplet in Digital Ocean
- Connect to Ubuntu server and create `/opt/csye6225` folder
- Disconnect from Ubuntu server
- Copy the zip file from local machine to the Ubuntu server (`/opt/csye6225`)
- Connect to remote server again
- Write `.env` file
- Write shell script file
- Give executable permissions for the shell script
- Run the shell script using `./init.sh` or `bash init.sh`

## Writing tests for /healthz API (Using `supertest`)
- Install supertest using `npm install supertest --save-dev`
- Create a new folder `tests` in the source folder
- Create a file called `healthz.test.js`
- Write the test cases in the tests file
- Run the test cases using `npx jest`

## CI CD Checks 
- The GitHub Actions workflow will be triggered when a pull request is raised to the **main** branch:
1. **Checkout Code:**
   - Retrieves the latest code using `actions/checkout@v3`.

2. **Set Up Environment Variables:**
   - A `.env` file is created inside the `src` directory with values from GitHub Secrets.
   - The environment variables include:
     - `DATABASE_HOST`
     - `DATABASE_NAME`
     - `DATABASE_PASSWORD`
     - `DATABASE_PORT`
     - `DATABASE_USERNAME`
     - `DIALECT`
     - `PORT`

3. **Service Setup:**
   - A MySQL container is started using the official MySQL 8.0 image with appropriate health checks.

4. **Install Node.js and Dependencies:**
   - The workflow sets up Node.js (v18) and installs Node dependencies using `npm install`.

5. **Run Tests:**
   - The test suite is executed using `npx jest`.