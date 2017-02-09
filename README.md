# TriStrava

Data visualizations and insights for triathletes using Strava.

## Design

See <a href="./DESIGN.md">DESIGN.md</a>

## Running the application

### Frontend

    cd js && npm install && npm start

### Backend

### Create and configure your MySQL database

    create database tristrava;
    create user 'tristrava'@'%';
    grant all privileges on tristrava.* to 'tristrava'@'%' with grant option;


#### Run Go code

    cd go && make install && make start
