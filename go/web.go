package main

import (
	"fmt"
	"github.com/strava/go.strava"
	"os"
	"strconv"
	"strings"
)

func main() {
	// Strava config.
	clientId, err := strconv.Atoi(strings.TrimSpace(os.Getenv("STRAVA_CLIENT_ID")))
	clientSecret := strings.TrimSpace(os.Getenv("STRAVA_CLIENT_SECRET"))

	if err != nil || len(clientSecret) == 0 {
		fmt.Println("Must export STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET")
		os.Exit(1)
	}

	strava.ClientId = clientId
	strava.ClientSecret = clientSecret

	// MySQL config.
	mysqlUser := strings.TrimSpace(os.Getenv("MYSQL_USER"))
	mysqlPassword := strings.TrimSpace(os.Getenv("MYSQL_PASSWORD"))
	mysqlHost := strings.TrimSpace(os.Getenv("MYSQL_HOST"))
	mysqlDbName := strings.TrimSpace(os.Getenv("MYSQL_DB_NAME"))

	db, err := DatabaseInit(mysqlUser, mysqlPassword, mysqlHost, mysqlDbName)
	defer db.Close()
	if err != nil {
		panic(err.Error())
	}

	// Worker.
	users := make(chan User)
	go WorkerInit(db, users)

	// API.
	ApiInit(db, users)
}
