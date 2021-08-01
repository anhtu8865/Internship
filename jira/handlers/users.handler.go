package handlers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"log"
	"strconv"

	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/godror/godror"

	jwt "github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte("my_secret_key")

var TokenValidTime time.Duration = 1000

type Claims struct {
	Username string `json:"user_name"`
	IsAdmin  int    `json:"is_admin"`
	jwt.StandardClaims
}

var UserHandlers = UserHandler{}

type UserHandler struct{}

func (u *UserHandler) Index() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		users, err := models.UserModels.Get()
		if err == nil {
			//fmt.Println(users)
			//c.JSON(http.StatusOK, users)
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: users})
		} else {
			fmt.Println(err)
		}
	}
}

func (u *UserHandler) Signin() gin.HandlerFunc {
	return func(c *gin.Context) {
		var user, password string
		//var user string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)

		user = fmt.Sprintf("%v", myMap["user"])
		password = fmt.Sprintf("%v", myMap["password"])

		if user == "" || password == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			Exist_user, err := models.UserModels.Check_user(user, user)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

			}

			if len(Exist_user) == 0 {
				c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "User not exists, please choose another user"})

			}

			if len(Exist_user) == 1 {
				if Exist_user[0].IsAdmin == 1 {

					originalStringBytes, err := base64.StdEncoding.DecodeString(Exist_user[0].UserPassword)

					if err != nil {
						c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "Password invalid, can't decode"})
						log.Fatalf("Some error occured during base64 decode. Error %s", err.Error())
					}

					if password == string(originalStringBytes) {

						expirationTime := time.Now().Add(TokenValidTime * time.Hour)

						// Create the JWT claims, which includes the username and expiry time

						claims := &Claims{
							Username: user,
							IsAdmin:  1,
							StandardClaims: jwt.StandardClaims{
								// In JWT, the expiry time is expressed as unix milliseconds
								ExpiresAt: expirationTime.Unix(),
							},
						}

						// Declare the token with the algorithm used for signing, and the claims
						token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

						// Create the JWT string
						tokenString, err := token.SignedString(jwtKey)
						if err != nil {
							// If there is an error in creating the JWT return an internal server error

							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "have error with encode token"})

						}

						scr := models.User{UserToken: tokenString, Username: user, UserEmail: user}
						sm := models.UserModel{}

						if _, err := sm.UpdateToken(scr); err != nil {

							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

						}

						// Finally, we set the client cookie for "token" as the JWT we just generated
						// we also set an expiry time which is the same as the token itself
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: struct{ Token string }{tokenString}})
					} else {

						c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Wrong password, please try again!"})
					}
				}

				if Exist_user[0].IsAdmin == 0 {

					originalStringBytes, err := base64.StdEncoding.DecodeString(Exist_user[0].UserPassword)

					if err != nil {
						c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "Password invalid, can't decode"})
						log.Fatalf("Some error occured during base64 decode. Error %s", err.Error())
					}

					if password == string(originalStringBytes) {
						expirationTime := time.Now().Add(TokenValidTime * time.Hour)
						// Create the JWT claims, which includes the username and expiry time

						claims := &Claims{
							Username: user,
							IsAdmin:  0,
							StandardClaims: jwt.StandardClaims{
								// In JWT, the expiry time is expressed as unix milliseconds
								ExpiresAt: expirationTime.Unix(),
							},
						}

						// Declare the token with the algorithm used for signing, and the claims
						token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

						// Create the JWT string
						tokenString, err := token.SignedString(jwtKey)
						if err != nil {
							// If there is an error in creating the JWT return an internal server error

							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "have error with encode token"})
						}

						scr := models.User{UserToken: tokenString, Username: user, UserEmail: user}
						sm := models.UserModel{}

						if _, err := sm.UpdateToken(scr); err != nil {

							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
						}

						// Finally, we set the client cookie for "token" as the JWT we just generated
						// we also set an expiry time which is the same as the token itself
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: struct{ Token string }{tokenString}})
					} else {

						c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Wrong password, please try again!"})
					}
				}

			}
		}
	}
}

func (u *UserHandler) Signup() gin.HandlerFunc {
	return func(c *gin.Context) {
		var user, full_name, email, password string
		var IA int

		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		user = fmt.Sprintf("%v", myMap["user"])
		full_name = fmt.Sprintf("%v", myMap["fullname"])
		email = fmt.Sprintf("%v", myMap["email"])
		password = fmt.Sprintf("%v", myMap["password"])
		if user == "" || full_name == "" || email == "" || password == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			Exist_user, err := models.UserModels.Check_user(user, email)
			IA = 1
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

			}

			if len(Exist_user) > 0 {
				if Exist_user[0].Username == user && Exist_user[0].UserEmail != email {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "User already exists, please choose another user"})
				}
			}
			if len(Exist_user) > 0 {
				if Exist_user[0].Username != user && Exist_user[0].UserEmail == email {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Email already exists, please choose another email"})
				}
			}
			if len(Exist_user) > 0 {
				if Exist_user[0].Username == user && Exist_user[0].UserEmail == email {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "User and email already exists, please choose another user and email"})
				}
			}

			if len(Exist_user) == 0 {
				sample := password
				encodedString := base64.StdEncoding.EncodeToString([]byte(sample))
				fmt.Println(encodedString)
				expirationTime := time.Now().Add(TokenValidTime * time.Hour)
				// Create the JWT claims, which includes the username and expiry time
				claims := &Claims{
					Username: user,
					IsAdmin:  1,
					StandardClaims: jwt.StandardClaims{
						// In JWT, the expiry time is expressed as unix milliseconds
						ExpiresAt: expirationTime.Unix(),
					},
				}

				// Declare the token with the algorithm used for signing, and the claims
				token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

				// Create the JWT string
				tokenString, err := token.SignedString(jwtKey)
				if err != nil {
					// If there is an error in creating the JWT return an internal server error
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error server"})

				}

				scr := models.User{Username: user, UserFullName: full_name, UserEmail: email, UserPassword: encodedString, IsAdmin: IA, UserToken: tokenString}
				sm := models.UserModel{}
				if _, err := sm.InsertUser(scr); err != nil {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

				}
				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Sign Up Success", Data: struct{ Token string }{tokenString}})

			}

		}
	}
}

func (u *UserHandler) UpdateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var user, full_name, email, password, isAdmin string
		id := c.Param("id")
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		user = fmt.Sprintf("%v", myMap["Username"])
		full_name = fmt.Sprintf("%v", myMap["User_Full_Name"])
		fmt.Println(full_name)
		email = fmt.Sprintf("%v", myMap["User_Email"])
		password = fmt.Sprintf("%v", myMap["User_Password"])
		isAdmin = fmt.Sprintf("%v", myMap["Is_Admin"])
		user_id, _ := strconv.Atoi(id)
		encodedString := base64.StdEncoding.EncodeToString([]byte(password))
		if _, err := models.UserModels.UpdateUser(user_id, user, full_name, email, encodedString, isAdmin); err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

		} else {
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Update user success"})
		}

	}
}

func (u *UserHandler) DeleteUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			Exist_user_exist, err := models.UserModels.Check_user_exist(id)

			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

			} else {

				if len(Exist_user_exist) == 0 {

					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "User Id does not exist"})
				}
				fmt.Println(len(Exist_user_exist))
				if len(Exist_user_exist) > 0 {
					if _, err := models.UserModels.DeleteUser(id); err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
						loggers.Logger.Error("Xoa user bi loi")

					} else {
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete user success"})
						loggers.Logger.Println("Delete user success")
					}
				}
			}

		}
	}
}

/*func (u *UserHandler) DeleteUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		//user_id, _ := strconv.Atoi(id)

		if id == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			row, _ := models.UserModels.DeleteUser(id)
			//if row.RowsAffected()
			fmt.Println(row.RowsAffected())

		}
	}
}*/
