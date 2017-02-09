package main

import (
	"github.com/gin-gonic/gin"
)

func ApiInit() {
	r := gin.Default()

	v1 := r.Group("v1")
	{
		//v1.POST("/users", PostUser)
		v1.GET("/users", GetUsers)
		//v1.GET("/users/:id", GetUser)
	}

	r.Run(":4000")
}

func GetUsers(c *gin.Context) {
	var users = []User{
		User{StravaId: "S1"},
		User{StravaId: "S2"},
	}
	c.JSON(200, users)
}
