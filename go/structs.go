package main

import (
	"github.com/jinzhu/gorm"
)

type Session struct {
	gorm.Model
	SessionId string
	UserId    int
}

type User struct {
	gorm.Model
	StravaId uint `gorm:"index"`
	Token    string
}
