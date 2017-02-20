package main

type Session struct {
	Id     string `gorm:"primary_key"`
	UserId int64
}

type User struct {
	Id    int64 `gorm:"primary_key"`
	Token string
}

type Activity struct {
	Id                int64  `gorm:"primary_key"`
	UserId            int64  `gorm:"index"`
	Type              string `gorm:"index"`
	MovingTimeSeconds int
	DistanceMeters    float64
}
