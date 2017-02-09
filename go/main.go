package main

import (
//"github.com/strava/go.strava"
)

func main() {
	db, err := DatabaseInit()
	defer db.Close()

	if err != nil {
		panic(err.Error())
	}

	ApiInit()
}
