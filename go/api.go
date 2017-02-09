package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/itsjamie/gin-cors"
	"github.com/jinzhu/gorm"
	"github.com/strava/go.strava"
	"net/http"
	"strconv"
	"time"
)

func ApiInit(db *gorm.DB, clientId int, clientSecret string) {
	// Initialize a new Gin router
	router := gin.Default()

	// Apply the middleware to the router (works with groups too)
	router.Use(cors.Middleware(cors.Config{
		Origins:         "*",
		Methods:         "GET, PUT, POST, DELETE",
		RequestHeaders:  "Origin, Authorization, Content-Type",
		ExposedHeaders:  "",
		MaxAge:          50 * time.Second,
		Credentials:     true,
		ValidateHeaders: false,
	}))

	strava.ClientId = clientId
	strava.ClientSecret = clientSecret

	authenticator := strava.OAuthAuthenticator{
		CallbackURL:            "http://localhost:4000/v1/auth/response", // TODO update for prod
		RequestClientGenerator: nil,
	}

	v1 := router.Group("v1")
	{
		v1.GET("/session", func(c *gin.Context) {
			GetSession(db, c)
		})
		v1.GET("/session/verify", GetSessionVerify)
		v1.GET("/auth/init", GetAuthInit)

		v1.GET("/auth/response", func(c *gin.Context) {
			authenticator.HandlerFunc(oAuthSuccess, oAuthFailure)(c.Writer, c.Request)
		})
	}

	router.Run(":4000")
}

func GetSession(db *gorm.DB, c *gin.Context) {
	size := 32
	randomBytes := make([]byte, size)
	rand.Read(randomBytes)
	randomString := base64.StdEncoding.EncodeToString(randomBytes)

	db.Create(&Session{SessionId: randomString})
	c.JSON(200, gin.H{"sessionId": randomString})

}

func GetSessionVerify(c *gin.Context) {
	// TODO
}

func GetAuthInit(c *gin.Context) {
	c.Redirect(http.StatusTemporaryRedirect,
		"https://www.strava.com/api/v3/oauth/authorize?"+
			"client_id="+strconv.Itoa(strava.ClientId)+
			"state="+c.Request.Header.Get("Authorization")+ // TODO verify this grabs the session
			"&response_type=code&redirect_uri="+
			"http://localhost:4000/v1/auth/response"+ // TODO update for prod
			"&scope=public&approval_prompt=force")
}

func oAuthSuccess(auth *strava.AuthorizationResponse, w http.ResponseWriter, r *http.Request) {
	fmt.Println(auth.AccessToken)
	fmt.Println(auth.Athlete.Id)
	// TODO
}

func oAuthFailure(err error, w http.ResponseWriter, r *http.Request) {
	fmt.Println(err)
	// TODO
}
