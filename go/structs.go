package main

import (
	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	StravaId string `gorm:"index"`
}
