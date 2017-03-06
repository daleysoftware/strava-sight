package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/itsjamie/gin-cors"
	"github.com/jinzhu/gorm"
	"github.com/strava/go.strava"
	"log"
	"net/http"
	"strconv"
	"time"
)

func ApiInit(db *gorm.DB, users chan User, port int) {
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

	authenticator := strava.OAuthAuthenticator{}

	router.GET("/", func(c *gin.Context) {
		http.ServeFile(c.Writer, c.Request, "./assets/index.html")
	})
	router.Static("/assets", "assets")

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

		// Activity data
		v1.GET("/activities", func(c *gin.Context) {
			GetActivities(db, c)
		})
	}

	router.Run(fmt.Sprintf(":%d", port))
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
	db.Delete(&Session{}, "id = ?", sessionId)
	c.Status(http.StatusOK)
}

func GetSessionAuthInit(c *gin.Context) {
	sessionId := c.Param("session")
	callback := c.Query("callback")

	c.Redirect(http.StatusTemporaryRedirect,
		"https://www.strava.com/api/v3/oauth/authorize?"+
			"client_id="+strconv.Itoa(strava.ClientId)+
			"&redirect_uri="+callback+"/api/v1/auth/response"+
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
	db.Save(&FetchTask{UserId: user.Id, Fetching: true})
	users <- user

	c.Redirect(http.StatusTemporaryRedirect, "/")
}

func oAuthFailure(c *gin.Context, err error) {
	log.Println(err.Error())
	c.Status(http.StatusUnauthorized)
}

func GetActivities(db *gorm.DB, c *gin.Context) {
	var session Session
	db.Model(&Session{}).Where("id = ?", c.Request.Header.Get("Authorization")).Find(&session)
	if session.UserId == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{})
		return
	}

	var fetchTask FetchTask
	db.Model(&FetchTask{}).Where("user_id = ?", session.UserId).Find(&fetchTask)
	if fetchTask.Fetching {
		c.JSON(http.StatusAccepted, gin.H{})
		return
	}

	var runningActivities []Activity
	var cyclingActivities []Activity
	var swimmingActivities []Activity
	db.Model(&Activity{}).Where("user_id = ? and type = 'Run'", session.UserId).Find(&runningActivities)
	db.Model(&Activity{}).Where("user_id = ? and type = 'Ride'", session.UserId).Find(&cyclingActivities)
	db.Model(&Activity{}).Where("user_id = ? and type = 'Swim'", session.UserId).Find(&swimmingActivities)

	result := make(map[string]interface{})
	result["running"] = runningActivities
	result["cycling"] = cyclingActivities
	result["swimming"] = swimmingActivities

	b, _ := json.Marshal(result)
	c.JSON(http.StatusOK, string(b))
}
