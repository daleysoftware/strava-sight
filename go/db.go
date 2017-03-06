package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func DatabaseInit(dbUrl string) (*gorm.DB, error) {
	db, err := gorm.Open("mysql",
		fmt.Sprintf("%s?charset=utf8&parseTime=True&loc=Local", dbUrl))

	if err != nil {
		return nil, err
	}

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Session{})
	db.AutoMigrate(&Activity{})
	db.AutoMigrate(&FetchTask{})

	return db, nil
}
