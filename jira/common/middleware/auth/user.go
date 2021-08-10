package auth

import (
	"jira/models"
	"jira/common/helpers"
	"net/http"
	"strings"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)
type Claims struct {
		Username string `json:"user_name"`
		IsAdmin  int    `json:"is_admin"`
		jwt.StandardClaims
	}


  func CheckUserLoged(c *gin.Context) {
	var tknStr string
	var tknStr1 string
	var jwtKey = []byte("jdnfksdmfksd")
	var rule bool
	auth := c.Request.Header["Authorization"]
	if len(auth) > 0 {
		tknStr = strings.Trim(auth[0], "Bearer")
		tknStr1 = strings.Trim(tknStr, " ")

		claims := &Claims{}

		tkn, err := jwt.ParseWithClaims(tknStr1, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "Invalid signature"})
				c.Abort()
			}

			rule = false
		} else {
			rule = true
		}

		if rule && tkn != nil {	
			c.Next()
		}
		if !rule && tkn != nil {
			c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "Token expired, please login again"})
			c.Abort()
		}

		if tkn == nil {

			c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "Token invalid"})
			c.Abort()
		}


	} else {
		c.Abort()
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "Token not found"})
	}
	c.Abort()
}

func CheckAdmin(c *gin.Context) {
	var tknStr string
	var tknStr1 string
	var jwtKey = []byte("jdnfksdmfksd")
	//var rule bool
	auth := c.Request.Header["Authorization"]

	tknStr = strings.Trim(auth[0], "Bearer")
	tknStr1 = strings.Trim(tknStr, " ")

	claims := &Claims{}

	tkn, _ := jwt.ParseWithClaims(tknStr1, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if tkn != nil {
		if claims.IsAdmin == 0 {
			usr := models.User{UserName: claims.Username, IsAdmin: claims.IsAdmin}
			c.Set("user_info", usr)

			c.Next()

		}
		if claims.IsAdmin == 1 {
			usr := models.User{UserName: claims.Username, IsAdmin: claims.IsAdmin}
			c.Set("user_info", usr)
			c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})

			c.Abort()

		}
	}

	c.Abort()
}

