# TriStrava

Data visualizations and insights for triathletes using Strava.

## Design

See <a href="./DESIGN.md">DESIGN.md</a>

## Running the application

### Frontend

    cd js && npm install && npm start

### Backend

### Create and configure your MySQL database

Install MySQL and run the following commands in the root console.

    create database tristrava;
    create user 'tristrava'@'%';
    grant all privileges on tristrava.* to 'tristrava'@'%' with grant option;

### Export Strava variables in your environment

    export STRAVA_CLIENT_ID=<redacted>
    export STRAVA_CLIENT_SECRET=<redacted>

#### Run Go code

    cd go && make install && make start
