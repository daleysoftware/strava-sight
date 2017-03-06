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
	dbUrl := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if len(dbUrl) == 0 {
		fmt.Println("Must export DATABASE_URL")
		os.Exit(2)
	}

	// Port config.
	port, err := strconv.Atoi(strings.TrimSpace(os.Getenv("PORT")))
	if err != nil {
		fmt.Println("Must export PORT")
		os.Exit(3)
	}

	// Database connection.
	db, err := DatabaseInit(dbUrl)
	defer db.Close()
	if err != nil {
		panic(err.Error())
	}

	// Worker.
	users := make(chan User)
	go WorkerInit(db, users)

	// API.
	ApiInit(db, users, port)
}
