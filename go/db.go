package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func DatabaseInit() (*gorm.DB, error) {
	db, err := gorm.Open("mysql", "stravasight@/stravasight?charset=utf8&parseTime=True&loc=Local")

	if err != nil {
		return nil, err
	}

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Session{})
	db.AutoMigrate(&Activity{})
	db.AutoMigrate(&FetchTask{})

	return db, nil
}
