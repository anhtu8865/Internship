package auth

import (
	"fmt"
	"jira/common/helpers"

	// "jira/models"
	. "jira/handlers"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v7"
)

// type Claims struct {
// 	    username string `json:"user_name"`
// 		role  int    `json:"is_admin"`
// 		jwt.StandardClaims
// }

// type AccessDetails struct {
//     AccessUuid string
//     UserName   string
// }
// var client *redis.Client
// func FetchAuth(authD *AccessDetails) (string, error) {
// 		username, err := client.Get(authD.UserName).Result()
// 		fmt.Println(username)
// 		if err != nil {
// 		   return "nil", err
// 		}
// 		return username, nil
// }
var client *redis.Client

type AccessDetails struct {
	AccessUuid string
	UserName   string
}

func init() {
	//Initializing redis
	dsn := os.Getenv("REDIS_DSN")
	if len(dsn) == 0 {
		dsn = "localhost:6379"
	}
	client = redis.NewClient(&redis.Options{
		Addr: dsn, //redis port
	})
	_, err := client.Ping().Result()
	if err != nil {
		panic(err)
	}
}

func CheckUserLoged(c *gin.Context) {
	var tknStr string
	var tknStr1 string
	// var jwtKey = []byte("jdnfksdmfksd")
	var rule bool
	auth := c.Request.Header["Authorization"]
	if len(auth) > 0 {
		tknStr = strings.Trim(auth[0], "Bearer")
		tknStr1 = strings.Trim(tknStr, " ")
		// claims := &Claims{}
		// tkn, err := jwt.ParseWithClaims(tknStr1, claims, func(token *jwt.Token) (interface{}, error) {
		// 	return jwtKey, nil
		// })
		tkn, err := jwt.Parse(tknStr1, func(token *jwt.Token) (interface{}, error) {
			//Make sure that the token method conform to "SigningMethodHMAC"
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("ACCESS_SECRET")), nil
		})
		claims, _ := tkn.Claims.(jwt.MapClaims)
		accessUuid, _ := claims["access_uuid"].(string)
		// // userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
		// username, _ := claims["username"].(string)
		// fmt.Println(accessUuid)
		// fmt.Println(username)

		accessid, ok := client.Get(accessUuid).Result()
		if ok != nil{
				c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "Invalid signature Token"})
				c.Abort()
		}else{
			fmt.Println(accessid)
		}
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
	if role == 0 {
		c.Next()
	}
	if role == 1 {
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
		c.Abort()
	}
	if role == 2 {
		c.JSON(http.StatusUnauthorized, helpers.MessageResponse{Msg: "You are not admin, can't access"})
		c.Abort()
	}
	c.Abort()
}

func Logout(c *gin.Context) {
	var tknStr string
	var tknStr1 string
	auth := c.Request.Header["Authorization"]
	tknStr = strings.Trim(auth[0], "Bearer")
	tknStr1 = strings.Trim(tknStr, " ")
	// claims := &Claims{}
	// tkn, err := jwt.ParseWithClaims(tknStr1, claims, func(token *jwt.Token) (interface{}, error) {
	// 	return jwtKey, nil
	// })
	tkn, _ := jwt.Parse(tknStr1, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	claims, _ := tkn.Claims.(jwt.MapClaims)
	accessUuid, _ := claims["access_uuid"].(string)
	deleted, delErr := DeleteAuth(accessUuid)
	if delErr != nil || deleted == 0 { //if any goes wrong
		c.JSON(http.StatusUnauthorized, "unauthorized")
		c.Abort()
	} else {
		c.JSON(http.StatusOK, "Successfully logged out")
		c.Next()
	}
}
func DeleteAuth(givenUuid string) (int64, error) {
	deleted, err := client.Del(givenUuid).Result()
	if err != nil {
		return 0, err
	}
	return deleted, nil
}

//refresh token
func RefreshToken(c *gin.Context) {
	mapToken := map[string]string{}
	if err := c.ShouldBindJSON(&mapToken); err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	refreshToken := mapToken["refresh_token"]

	//verify the token
	os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("REFRESH_SECRET")), nil
	})
	//if there is an error, the token must have expired
	if err != nil {
		c.JSON(http.StatusUnauthorized, "Refresh token expired")
		return
	}
	//is token valid?
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	//Since token is valid, get the uuid:
	claims, ok := token.Claims.(jwt.MapClaims) //the token claims should conform to MapClaims
	if ok && token.Valid {
		refreshUuid, ok := claims["refresh_uuid"].(string) //convert the interface to string
		if !ok {
			c.JSON(http.StatusUnprocessableEntity, err)
			return
		}
		username, ok := claims["username"].(string)
		// userId, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
		if !ok {
			c.JSON(http.StatusUnprocessableEntity, "Error occurred")
			c.Abort()
		}
		role, _ := claims["role"].(int64)
		
		//Delete the previous Refresh Token
		deleted, delErr := DeleteAuth(refreshUuid)
		if delErr != nil || deleted == 0 { //if any goes wrong
			c.JSON(http.StatusUnauthorized, "unauthorized")
			return
		}
		//Create new pairs of refresh and access tokens
		ts, createErr := CreateToken(username, role)
		if createErr != nil {
			c.JSON(http.StatusForbidden, createErr.Error())
			return
		}
		//save the tokens metadata to redis
		saveErr := CreateAuth(username, ts)
		if saveErr != nil {
			c.JSON(http.StatusForbidden, saveErr.Error())
			return
		}
		tokens := map[string]string{
			"access_token":  ts.AccessToken,
			"refresh_token": ts.RefreshToken,
		}
		c.JSON(http.StatusCreated, tokens)
	} else {
		c.JSON(http.StatusUnauthorized, "refresh expired")
	}
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
