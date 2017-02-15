package main

import (
	"fmt"
	"github.com/strava/go.strava"
	"os"
	"strconv"
	"strings"
)

func main() {
	db, err := DatabaseInit()
	defer db.Close()

	if err != nil {
		panic(err.Error())
	}

	clientId, err := strconv.Atoi(strings.TrimSpace(os.Getenv("STRAVA_CLIENT_ID")))
	clientSecret := strings.TrimSpace(os.Getenv("STRAVA_CLIENT_SECRET"))

	if err != nil || len(clientSecret) == 0 {
		fmt.Println("Must export STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET")
		os.Exit(1)
	}

	strava.ClientId = clientId
	strava.ClientSecret = clientSecret

	users := make(chan User)

	go WorkerInit(db, users)
	ApiInit(db, users)
}
