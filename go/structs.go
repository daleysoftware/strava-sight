package main

type Session struct {
	SessionId    string `gorm:"primary_key"`
	StravaUserId int64
}

type User struct {
	StravaUserId int64 `gorm:"primary_key"`
	Token        string
}
