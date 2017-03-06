# Strava Sight

Visualize your Strava activities in a unique bubble chart. Example:

<img src="./example.png"/>

## Design

See <a href="./DESIGN.md">DESIGN.md</a>.

Technologies used:

* React.js and Chart.js
* MySQL
* Golang

## Running the application in development

### Create and configure your MySQL database

Install MySQL and run the following commands in the root console.

    create database stravasight;
    create user 'stravasight'@'%';
    grant all privileges on stravasight.* to 'stravasight'@'%' with grant option;

### Export Strava variables in your environment

    export STRAVA_CLIENT_ID=<redacted>
    export STRAVA_CLIENT_SECRET=<redacted>

### Run application (golang)

    make install && make start

The application will be available at
<a href="http://localhost:4000">http://localhost:4000</a>.

### Watch JavaScript code (optional)

If you are making changes to the JS frontend, you may optionally run the
following to automatically update the bundle artifact.

    cd js && make install && make start

## Running the application in production

This application is structured such that it can be easily deployed via Heroku.
