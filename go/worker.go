package main

import (
	"log"
)
import (
	"github.com/jinzhu/gorm"
	"github.com/strava/go.strava"
)

func WorkerInit(db *gorm.DB, users chan User) {
	for {
		// TODO we should log jobs in the database for easy resume on restart.
		// TODO job state should also be added to the database.
		select {
		case user := <-users:
			fetchUserActivities(user)
		}
	}
}

func fetchUserActivities(user User) {
	client := strava.NewClient(user.Token)
	service := strava.NewCurrentAthleteService(client)

	page := 1
	for {
		activitySummary, err := service.ListActivities().Page(page).PerPage(10).Do()
		page++

		if err != nil {
			log.Println(err.Error())
			return
		}

		if len(activitySummary) == 0 {
			return
		}

		// TODO persist in database.

		log.Println(activitySummary)
		log.Println(activitySummary[0].Type)
		log.Println(activitySummary[0].AverageSpeed)
		log.Println(activitySummary[0].MovingTime)
		log.Println(activitySummary[0].Distance)
		log.Println(activitySummary[0].Id)

	}
}
