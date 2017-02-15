package main

import (
	"crypto/rand"
	"encoding/hex"
	"github.com/gin-gonic/gin"
	"github.com/itsjamie/gin-cors"
	"github.com/jinzhu/gorm"
	"github.com/strava/go.strava"
	"log"
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
		// Sessions
		v1.GET("/session", func(c *gin.Context) {
			GetSession(db, c)
		})
		v1.GET("/session/:session/auth/verify", func(c *gin.Context) {
			GetSessionAuthVerify(db, c)
		})
		v1.DELETE("/session/:session", func(c *gin.Context) {
			DeleteSession(db, c)
		})

		// Auth
		v1.GET("/session/:session/auth/init", GetSessionAuthInit)
		v1.GET("/auth/response", func(c *gin.Context) {
			authenticator.HandlerFunc(
				func(auth *strava.AuthorizationResponse, w http.ResponseWriter, r *http.Request) {
					oAuthSuccess(db, c, auth)
				},
				func(err error, w http.ResponseWriter, r *http.Request) {
					oAuthFailure(c, err)
				})(c.Writer, c.Request)
		})
	}

	router.Run(":4000")
}

func GetSession(db *gorm.DB, c *gin.Context) {
	randomBytes := make([]byte, 32)
	rand.Read(randomBytes)
	randomString := hex.EncodeToString(randomBytes)
	if dbResult := db.Save(&Session{SessionId: randomString}); dbResult.Error != nil {
		log.Println(dbResult.Error.Error())
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"sessionId": randomString})
}

func GetSessionAuthVerify(db *gorm.DB, c *gin.Context) {
	sessionId := c.Param("session")
	var session Session
	db.Model(&Session{}).Where("session_id = ?", sessionId).Find(&session)
	if session.StravaUserId == 0 {
		c.Status(http.StatusUnauthorized)
		return
	}
	c.Status(http.StatusOK)
}

func DeleteSession(db *gorm.DB, c *gin.Context) {
	sessionId := c.Param("session")
	log.Println(sessionId)
	// TODO
}

func GetSessionAuthInit(c *gin.Context) {
	sessionId := c.Param("session")
	c.Redirect(http.StatusTemporaryRedirect,
		"https://www.strava.com/api/v3/oauth/authorize?"+
			"client_id="+strconv.Itoa(strava.ClientId)+
			"&redirect_uri="+RestEndpoint+"/auth/response"+
			"&response_type=code"+
			"&state="+sessionId+
			"&scope=public"+
			"&approval_prompt=force")
}

func oAuthSuccess(db *gorm.DB, c *gin.Context, auth *strava.AuthorizationResponse) {
	if dbResult := db.Save(&Session{SessionId: auth.State, StravaUserId: auth.Athlete.Id}); dbResult.Error != nil {
		log.Println(dbResult.Error.Error())
		c.Status(http.StatusInternalServerError)
	}
	if dbResult := db.Save(&User{StravaUserId: auth.Athlete.Id, Token: auth.AccessToken}); dbResult.Error != nil {
		log.Println(dbResult.Error.Error())
		c.Status(http.StatusInternalServerError)
	}
	c.Redirect(http.StatusTemporaryRedirect, WebEndpoint)
}

func oAuthFailure(c *gin.Context, err error) {
	log.Println(err.Error())
	c.Status(http.StatusUnauthorized)
}
