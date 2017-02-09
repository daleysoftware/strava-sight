package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/strava/go.strava"
	"net/http"
	"strconv"
)

func ApiInit(clientId int, clientSecret string) {
	r := gin.Default()

	strava.ClientId = clientId
	strava.ClientSecret = clientSecret

	authenticator := strava.OAuthAuthenticator{
		CallbackURL:            "http://localhost:4000/v1/auth/response", // TODO update for prod
		RequestClientGenerator: nil,
	}

	v1 := r.Group("v1")
	{
		v1.GET("/auth/init", GetAuthInit)

		v1.Any("/auth/response", func(c *gin.Context) {
			authenticator.HandlerFunc(oAuthSuccess, oAuthFailure)(c.Writer, c.Request)
		})
	}

	r.Run(":4000")
}

func GetAuthInit(c *gin.Context) {
	c.Redirect(http.StatusTemporaryRedirect,
		"https://www.strava.com/api/v3/oauth/authorize?client_id="+
			strconv.Itoa(strava.ClientId)+
			"&response_type=code&redirect_uri="+
			"http://localhost:4000/v1/auth/response"+ // TODO update for prod
			"&scope=public&approval_prompt=force")
}

func oAuthSuccess(auth *strava.AuthorizationResponse, w http.ResponseWriter, r *http.Request) {
	fmt.Println(auth.AccessToken)
	// TODO
}

func oAuthFailure(err error, w http.ResponseWriter, r *http.Request) {
	fmt.Println(err)
	// TODO
}
