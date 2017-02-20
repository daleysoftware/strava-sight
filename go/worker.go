package main

import (
	"log"
)
import (
	"github.com/jinzhu/gorm"
	"github.com/strava/go.strava"
	"sync"
)

func WorkerInit(db *gorm.DB, users chan User) {
	for {
		// TODO we should log jobs in the database for easy resume on restart.
		// TODO job state should also be added to the database.
		select {
		case user := <-users:
			fetchUserActivities(db, user)
		}
	}
}

func fetchUserActivities(db *gorm.DB, user User) {
	client := strava.NewClient(user.Token)
	service := strava.NewCurrentAthleteService(client)

	page := 1
	for {
		activities, err := service.ListActivities().Page(page).PerPage(100).Do()
		page++

		if err != nil {
			log.Println(err.Error())
			return
		}

		if len(activities) == 0 {
			return
		}

		log.Printf("Saving %d activities for %d\n", len(activities), user.Id)

		// Parallelize database operations for saving each activity.
		var wg sync.WaitGroup
		for _, activity := range activities {
			wg.Add(1)

			go func(activity *strava.ActivitySummary) {
				log.Printf("Saving activity %d\n", activity.Id)

				defer wg.Done()
				db.Save(&Activity{
					Id:                activity.Id,
					UserId:            user.Id,
					Type:              activity.Type.String(),
					MovingTimeSeconds: activity.MovingTime,
					DistanceMeters:    activity.Distance,
				})
			}(activity)
		}
		wg.Wait()
	}
}
