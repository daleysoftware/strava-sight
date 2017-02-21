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

func ApiInit(db *gorm.DB, users chan User) {
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

	authenticator := strava.OAuthAuthenticator{
		CallbackURL:            RestEndpoint + "/auth/response",
		RequestClientGenerator: nil,
	}

	v1 := router.Group("api").Group("v1")
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
					oAuthSuccess(db, c, auth, users)
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
	if dbResult := db.Save(&Session{Id: randomString}); dbResult.Error != nil {
		log.Println(dbResult.Error.Error())
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, gin.H{"sessionId": randomString})
}

func GetSessionAuthVerify(db *gorm.DB, c *gin.Context) {
	sessionId := c.Param("session")
	var session Session
	db.Model(&Session{}).Where("id = ?", sessionId).Find(&session)
	if session.UserId == 0 {
		c.Status(http.StatusUnauthorized)
		return
	}
	c.Status(http.StatusOK)
}

func DeleteSession(db *gorm.DB, c *gin.Context) {
	sessionId := c.Param("session")
	log.Println(sessionId)
	// TODO finish delete session.
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

func oAuthSuccess(db *gorm.DB, c *gin.Context, auth *strava.AuthorizationResponse, users chan User) {
	if dbResult := db.Save(&Session{Id: auth.State, UserId: auth.Athlete.Id}); dbResult.Error != nil {
		log.Println(dbResult.Error.Error())
		c.Status(http.StatusInternalServerError)
	}
	user := User{Id: auth.Athlete.Id, Token: auth.AccessToken}
	if dbResult := db.Save(&user); dbResult.Error != nil {
		log.Println(dbResult.Error.Error())
		c.Status(http.StatusInternalServerError)
	}

	// Trigger download of user activities by worker.
	users <- user

	c.Redirect(http.StatusTemporaryRedirect, WebEndpoint)
}

func oAuthFailure(c *gin.Context, err error) {
	log.Println(err.Error())
	c.Status(http.StatusUnauthorized)
}
