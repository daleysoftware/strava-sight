package main

import "time"

type Session struct {
	Id     string `gorm:"primary_key"`
	UserId int64
}

type User struct {
	Id    int64 `gorm:"primary_key"`
	Token string
}

type Activity struct {
	Id                int64     `gorm:"primary_key" json:"id"`
	UserId            int64     `gorm:"index" json:"-"`
	Type              string    `gorm:"index" json:"-"`
	MovingTimeSeconds int       `json:"movingTimeSeconds"`
	DistanceMeters    float64   `json:"distanceMeters"`
	StartDate         time.Time `json:"startDate"`
}

type FetchTask struct {
	UserId   int64 `gorm:"primary_key"`
	Fetching bool
}
