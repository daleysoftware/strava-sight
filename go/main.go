package main

import (
	"fmt"
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

	ApiInit(db, clientId, clientSecret)
}
