package handlers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	"os"

	// "jira/loggers"
	"github.com/twinj/uuid"
	"jira/models"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-redis/redis/v7"

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

//redis
var client *redis.Client

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

type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUuid   string
	RefreshUuid  string
	AtExpires    int64
	RtExpires    int64
}

//create token
func CreateToken(username string, globalrole int64) (*TokenDetails, error) {
	td := &TokenDetails{}
	td.AtExpires = time.Now().Add(time.Minute * 60).Unix()
	td.AccessUuid = uuid.NewV4().String()

	td.RtExpires = time.Now().Add(time.Hour * 24 * 7).Unix()
	td.RefreshUuid = td.AccessUuid + "++" + username

	var err error
	//Creating Access Token
	os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_uuid"] = td.AccessUuid
	atClaims["username"] = username
	atClaims["role"] = globalrole
	atClaims["exp"] = td.AtExpires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return nil, err
	}
	//Creating Refresh Token
	os.Setenv("REFRESH_SECRET", "mcmvmkmsdnfsdmfdsjf") //this should be in an env file
	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = td.RefreshUuid
	rtClaims["username"] = username
	atClaims["role"] = globalrole
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = rt.SignedString([]byte(os.Getenv("REFRESH_SECRET")))
	if err != nil {
		return nil, err
	}
	return td, nil
}
func CreateAuth(username string, td *TokenDetails) error {
	at := time.Unix(td.AtExpires, 0) //converting Unix to UTC(to Time object)
	rt := time.Unix(td.RtExpires, 0)
	now := time.Now()

	errAccess := client.Set(td.AccessUuid, username, at.Sub(now)).Err()
	if errAccess != nil {
		return errAccess
	}
	errRefresh := client.Set(td.RefreshUuid, username, rt.Sub(now)).Err()
	if errRefresh != nil {
		return errRefresh
	}
	return nil
}

///login
func (u *UserHandler) Singin() gin.HandlerFunc {
	return func(c *gin.Context) {
		var username, password string

		// 		//var user string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)

		username = fmt.Sprintf("%v", myMap["username"])
		password = fmt.Sprintf("%v", myMap["password"])

		//check null
		if username == "" || password == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			Exists_user, err := models.UserModels.Check_User_Exist(username, username)
			fmt.Println(Exists_user)
			if err != nil {

				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			}
			//No have user
			if len(Exists_user) == 0 {
				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "User not exists, please choose another user"})
			}
			if len(Exists_user) == 1 {
				//User admin
				if Exists_user[0].IsAdmin == 0 {
					originalStringBytes, err := base64.StdEncoding.DecodeString(Exists_user[0].UserPassword)

					if err != nil {
						c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "Password invalid, can't decode"})
						log.Fatalf("Some error occured during base64 decode. Error %s", err.Error())
					}
					//compare password
					if password == string(originalStringBytes) {
						ts, err := CreateToken(Exists_user[0].UserName,int64(Exists_user[0].IsAdmin))
						if err != nil {
							c.JSON(http.StatusUnprocessableEntity, err.Error())
							return
						}
						saveErr := CreateAuth(Exists_user[0].UserName, ts)
						if saveErr != nil {
							c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
						}
						tokens := map[string]string{
							"access_token":  ts.AccessToken,
							"refresh_token": ts.RefreshToken,						
						}
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: tokens})
					
					} else {

						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Wrong password, please try again!"})
					}
				}
				//trusted user
				if Exists_user[0].IsAdmin == 1 {

					originalStringBytes, err := base64.StdEncoding.DecodeString(Exists_user[0].UserPassword)

					if err != nil {
						c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "Password invalid, can't decode"})
						log.Fatalf("Some error occured during base64 decode. Error %s", err.Error())
					}

					if password == string(originalStringBytes) {
						ts, err := CreateToken(Exists_user[0].UserName,int64(Exists_user[0].IsAdmin))
						if err != nil {
							c.JSON(http.StatusUnprocessableEntity, err.Error())
							return
						}
						saveErr := CreateAuth(Exists_user[0].UserName, ts)
						if saveErr != nil {
							c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
						}
					
						tokens := map[string]string{
							"access_token":  ts.AccessToken,
							
						}
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: tokens})

					} else {

						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Wrong password, please try again!"})
					}
				}

				//member
				if Exists_user[0].IsAdmin == 2 {

					originalStringBytes, err := base64.StdEncoding.DecodeString(Exists_user[0].UserPassword)

					if err != nil {
						c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "Password invalid, can't decode"})
						log.Fatalf("Some error occured during base64 decode. Error %s", err.Error())
					}

					if password == string(originalStringBytes) {
						ts, err := CreateToken(Exists_user[0].UserName,int64(Exists_user[0].IsAdmin))
						if err != nil {
							c.JSON(http.StatusUnprocessableEntity, err.Error())
							return
						}
						saveErr := CreateAuth(Exists_user[0].UserName, ts)
						if saveErr != nil {
							c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
						}
						tokens := map[string]string{
							"access_token":  ts.AccessToken,
							
						}
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: tokens})

					} else {

						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Wrong password, please try again!"})
					}
				}

			}
		}
	}
}
//func get All user
func (u *UserHandler) Index() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		//call model
		users, err := models.UserModels.GetAllUser()
		if err == nil {
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: users})
		} else {
			fmt.Println(err)
		}
	}
}

//Create User
func (u *UserHandler) CreateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		//req body
		var username, fullname, email, password, global_role string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		//user_name
		username = fmt.Sprintf("%v", myMap["username"])
		//full_name
		fullname = fmt.Sprintf("%v", myMap["fullname"])
		//email
		email = fmt.Sprintf("%v", myMap["email"])
		//password
		password = fmt.Sprintf("%v", myMap["password"])
		//global_role
		global_role = fmt.Sprintf("%v", myMap["globalrole"])
		if username == "" || fullname == "" || email == "" || password == "" || global_role == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			//check user exist from db
			//call model
			exist_user, err := models.UserModels.Check_User_Exist(username, email)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			}
			//if user exists
			if len(exist_user) > 0 {
				if exist_user[0].UserName == username && exist_user[0].UserEmail != email {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "UserName already exists, please choose another user"})
				}
				if exist_user[0].UserName != username && exist_user[0].UserEmail == email {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Email already exists, please choose another email"})
				}
				if exist_user[0].UserName == username && exist_user[0].UserEmail == email {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "UserName and Email already exists, please choose another email"})
				}
			}
			if len(exist_user) == 0 {
				//convert string to int wwith global role
				global_role_int, _ := strconv.Atoi(global_role)

				//hash Password
				temp := password
				hashPassword := base64.StdEncoding.EncodeToString([]byte(temp))
				//
				src := models.User{
					UserName:     username,
					UserFullName: fullname,
					UserEmail:    email,
					UserPassword: hashPassword,
					IsAdmin:      global_role_int,
				}
				sm := models.UserModel{}
				//Add user
				if _, err := sm.AddUser(src); err != nil {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
				} else {
					c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Sign Up Success"})
				}
			}

		}
	}
}

///func delete user by id user
func (u *UserHandler) DeleteUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		//query id from client
		id := c.Query("id")
		//if id null
		if id == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			//call model func check user exist by user's id
			Check_user_exists, err := models.UserModels.Check_User_Exist_By_Id(id)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				//no have user in db
				if len(Check_user_exists) == 0 {
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "User Id does not exist"})
					//have user in db
				} else if len(Check_user_exists) > 0 {
					//delete user
					if _, err := models.UserModels.DeleteUser(id); err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
					} else {
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete user success"})
					}
				}
			}
		}
	}
}

//func update info user by admin
func (u *UserHandler) UpdateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var fullname, password, isAdmin string
		id := c.Query("id")

		var myMap map[string]string
		//req body from client
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		//username
		fullname = fmt.Sprintf("%v", myMap["fullname"])

		//password
		password = fmt.Sprintf("%v", myMap["password"])

		//permission role
		isAdmin = fmt.Sprintf("%v", myMap["globalrole"])

		//convert id string -> id int
		user_id, _ := strconv.Atoi(id)
		//hash password
		hashPassword := base64.StdEncoding.EncodeToString([]byte(password))
		if _, err := models.UserModels.UpdateUser(user_id, fullname, hashPassword, isAdmin); err != nil {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

		} else {
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Update user success"})
		}
	}
}



// func (u *UserHandler) Signin() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		var user, password string
// 		//var user string
// 		var myMap map[string]string
// 		json.NewDecoder(c.Request.Body).Decode(&myMap)

// 		user = fmt.Sprintf("%v", myMap["user"])
// 		password = fmt.Sprintf("%v", myMap["password"])

// 		if user == "" || password == "" {
// 			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
// 		} else {
// 			Exist_user, err := models.UserModels.Check_user(user, user)
// 			if err != nil {
// 				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

// 			}

// 			if len(Exist_user) == 0 {
// 				c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "User not exists, please choose another user"})

// 			}

// 			if len(Exist_user) == 1 {
// 				if Exist_user[0].IsAdmin == 1 {

// 					originalStringBytes, err := base64.StdEncoding.DecodeString(Exist_user[0].UserPassword)

// 					if err != nil {
// 						c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "Password invalid, can't decode"})
// 						log.Fatalf("Some error occured during base64 decode. Error %s", err.Error())
// 					}

// 					if password == string(originalStringBytes) {

// 						expirationTime := time.Now().Add(TokenValidTime * time.Hour)

// 						// Create the JWT claims, which includes the username and expiry time

// 						claims := &Claims{
// 							Username: user,
// 							IsAdmin:  1,
// 							StandardClaims: jwt.StandardClaims{
// 								// In JWT, the expiry time is expressed as unix milliseconds
// 								ExpiresAt: expirationTime.Unix(),
// 							},
// 						}

// 						// Declare the token with the algorithm used for signing, and the claims
// 						token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

// 						// Create the JWT string
// 						tokenString, err := token.SignedString(jwtKey)
// 						if err != nil {
// 							// If there is an error in creating the JWT return an internal server error

// 							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "have error with encode token"})

// 						}

// 						scr := models.User{UserToken: tokenString, Username: user, UserEmail: user}
// 						sm := models.UserModel{}

// 						if _, err := sm.UpdateToken(scr); err != nil {

// 							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

// 						}

// 						// Finally, we set the client cookie for "token" as the JWT we just generated
// 						// we also set an expiry time which is the same as the token itself
// 						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: struct{ Token string }{tokenString}})
// 					} else {

// 						c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Wrong password, please try again!"})
// 					}
// 				}

// 				if Exist_user[0].IsAdmin == 0 {

// 					originalStringBytes, err := base64.StdEncoding.DecodeString(Exist_user[0].UserPassword)

// 					if err != nil {
// 						c.JSON(http.StatusNotAcceptable, helpers.MessageResponse{Msg: "Password invalid, can't decode"})
// 						log.Fatalf("Some error occured during base64 decode. Error %s", err.Error())
// 					}

// 					if password == string(originalStringBytes) {
// 						expirationTime := time.Now().Add(TokenValidTime * time.Hour)
// 						// Create the JWT claims, which includes the username and expiry time

// 						claims := &Claims{
// 							Username: user,
// 							IsAdmin:  0,
// 							StandardClaims: jwt.StandardClaims{
// 								// In JWT, the expiry time is expressed as unix milliseconds
// 								ExpiresAt: expirationTime.Unix(),
// 							},
// 						}

// 						// Declare the token with the algorithm used for signing, and the claims
// 						token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

// 						// Create the JWT string
// 						tokenString, err := token.SignedString(jwtKey)
// 						if err != nil {
// 							// If there is an error in creating the JWT return an internal server error

// 							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "have error with encode token"})
// 						}

// 						scr := models.User{UserToken: tokenString, Username: user, UserEmail: user}
// 						sm := models.UserModel{}

// 						if _, err := sm.UpdateToken(scr); err != nil {

// 							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
// 						}

// 						// Finally, we set the client cookie for "token" as the JWT we just generated
// 						// we also set an expiry time which is the same as the token itself
// 						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Login Success", Data: struct{ Token string }{tokenString}})
// 					} else {

// 						c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Wrong password, please try again!"})
// 					}
// 				}

// 			}
// 		}
// 	}
// }

// func (u *UserHandler) Signup() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		var user, full_name, email, password string
// 		var IA int

// 		var myMap map[string]string
// 		json.NewDecoder(c.Request.Body).Decode(&myMap)
// 		user = fmt.Sprintf("%v", myMap["user"])
// 		full_name = fmt.Sprintf("%v", myMap["fullname"])
// 		email = fmt.Sprintf("%v", myMap["email"])
// 		password = fmt.Sprintf("%v", myMap["password"])
// 		if user == "" || full_name == "" || email == "" || password == "" {
// 			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
// 		} else {
// 			Exist_user, err := models.UserModels.Check_user(user, email)
// 			IA = 1
// 			if err != nil {
// 				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

// 			}

// 			if len(Exist_user) > 0 {
// 				if Exist_user[0].Username == user && Exist_user[0].UserEmail != email {
// 					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "User already exists, please choose another user"})
// 				}
// 			}
// 			if len(Exist_user) > 0 {
// 				if Exist_user[0].Username != user && Exist_user[0].UserEmail == email {
// 					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Email already exists, please choose another email"})
// 				}
// 			}
// 			if len(Exist_user) > 0 {
// 				if Exist_user[0].Username == user && Exist_user[0].UserEmail == email {
// 					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "User and email already exists, please choose another user and email"})
// 				}
// 			}

// 			if len(Exist_user) == 0 {
// 				sample := password
// 				encodedString := base64.StdEncoding.EncodeToString([]byte(sample))
// 				fmt.Println(encodedString)
// 				expirationTime := time.Now().Add(TokenValidTime * time.Hour)
// 				// Create the JWT claims, which includes the username and expiry time
// 				claims := &Claims{
// 					Username: user,
// 					IsAdmin:  1,
// 					StandardClaims: jwt.StandardClaims{
// 						// In JWT, the expiry time is expressed as unix milliseconds
// 						ExpiresAt: expirationTime.Unix(),
// 					},
// 				}

// 				// Declare the token with the algorithm used for signing, and the claims
// 				token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

// 				// Create the JWT string
// 				tokenString, err := token.SignedString(jwtKey)
// 				if err != nil {
// 					// If there is an error in creating the JWT return an internal server error
// 					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error server"})

// 				}

// 				scr := models.User{Username: user, UserFullName: full_name, UserEmail: email, UserPassword: encodedString, IsAdmin: IA, UserToken: tokenString}
// 				sm := models.UserModel{}
// 				if _, err := sm.InsertUser(scr); err != nil {
// 					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

// 				}
// 				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Sign Up Success", Data: struct{ Token string }{tokenString}})

// 			}

// 		}
// 	}
// }

// func (u *UserHandler) UpdateUser2() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		var user, full_name, email, password, isAdmin string
// 		id := c.Query("id")
// 		var myMap map[string]string
// 		json.NewDecoder(c.Request.Body).Decode(&myMap)
// 		user = fmt.Sprintf("%v", myMap["Username"])
// 		full_name = fmt.Sprintf("%v", myMap["User_Full_Name"])
// 		email = fmt.Sprintf("%v", myMap["User_Email"])
// 		password = fmt.Sprintf("%v", myMap["User_Password"])
// 		isAdmin = fmt.Sprintf("%v", myMap["Is_Admin"])
// 		user_id, _ := strconv.Atoi(id)
// 		encodedString := base64.StdEncoding.EncodeToString([]byte(password))
// 		if _, err := models.UserModels.UpdateUser2(user_id, user, full_name, email, encodedString, isAdmin); err != nil {
// 			fmt.Println(err)
// 			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

// 		} else {
// 			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Update user success"})
// 		}

// 	}
// }

// func (u *UserHandler) DeleteUser() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		id := c.Param("id")
// 		if id == "" {
// 			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
// 		} else {
// 			Exist_user_exist, err := models.UserModels.Check_user_exist(id)

// 			if err != nil {
// 				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

// 			} else {

// 				if len(Exist_user_exist) == 0 {

// 					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "User Id does not exist"})
// 				}
// 				fmt.Println(len(Exist_user_exist))
// 				if len(Exist_user_exist) > 0 {
// 					if _, err := models.UserModels.DeleteUser(id); err != nil {
// 						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
// 						loggers.Logger.Error("Xoa user bi loi")

// 					} else {
// 						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete user success"})
// 						loggers.Logger.Println("Delete user success")
// 					}
// 				}
// 			}

// 		}
// 	}
// }

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
