package auth

import (
	"fmt"
	"jira/common/helpers"
	// "jira/models"
	"net/http"
	"strings"
    "os"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"strconv"
)
type Claims struct {
	    username string `json:"user_name"`
		role  int    `json:"is_admin"`
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

func CheckAdmin(c *gin.Context)  {
	var tknStr string
	var tknStr1 string
	auth := c.Request.Header["Authorization"]
	tknStr = strings.Trim(auth[0], "Bearer")
	tknStr1 = strings.Trim(tknStr, " ")
	token, err := jwt.Parse(tknStr1, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		   return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	 })
	 if err != nil {
		fmt.Println(err)
	 }
	 claims := token.Claims.(jwt.MapClaims)
	//  accessUuid, ok := claims["username"].(string)
	 role, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["role"]), 10, 64)
	 if err != nil {
        c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
		c.Abort()
     }
     fmt.Println(role)
	 if role == 0 {
		c.Next()
	 }
	 if role == 1{
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
		c.Abort()
	 }
	 if role ==2 {
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
		c.Abort()
	 }
	 c.Abort()
}
// func VerifyToken(r *http.Request) (*jwt.Token, error){

// }
// func CheckAdmin(c *gin.Context) {
// 	var tknStr string
// 	var tknStr1 string
// 	var jwtKey = []byte("jdnfksdmfksd")
// 	//var rule bool
// 	auth := c.Request.Header["Authorization"]

// 	tknStr = strings.Trim(auth[0], "Bearer")
// 	tknStr1 = strings.Trim(tknStr, " ")

// 	claims := &Claims{}
// 	tkn, _ := jwt.ParseWithClaims(tknStr1, claims, func(token *jwt.Token) (interface{}, error) {
// 		return jwtKey, nil
// 	})
  
   
// 	if tkn != nil {
// 		if claims.role == 0 {
// 			usr := models.User{UserName: claims.username, IsAdmin: claims.role}
		
// 			c.Set("user_info", usr)
// 			c.Next()

// 		}
// 		if claims.role == 1 {
// 			usr := models.User{UserName: claims.username, IsAdmin: claims.role}
		
// 			c.Set("user_info", usr)
// 			c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
// 			c.Abort()
// 		}
// 		if claims.role == 2 {
// 			usr := models.User{UserName: claims.username, IsAdmin: claims.role}
			
// 			c.Set("user_info", usr)
// 			c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
// 			c.Abort()
// 		}
// 	}

// 	c.Abort()
// }

