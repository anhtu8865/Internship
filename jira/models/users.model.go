package models

import (
	"database/sql"
	"fmt"
	. "jira/common/db"

	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var UserModels = UserModel{}

type User struct {
	UserId       int    `json:"User_Id"`
	Username     string `json:"Username"`
	UserFullName string `json:"User_Full_Name"`
	UserEmail    string `json:"User_Email"`
	UserPassword string `json:"User_Password"`
	IsAdmin      int    `json:"Is_Admin"`
	UserToken    string `json:"User_Token"`
}
type UserModel struct {
	Users []User
}

func (um *UserModel) Get() ([]User, error) {
	var temp_user []User
	rows, err := DbOracle.Db.Query("select * from Jira_User")
	if err == nil {
		for rows.Next() {
			user := User{}
			rows.Scan(&user.UserId, &user.Username, &user.UserFullName, &user.UserEmail, &user.UserPassword, &user.IsAdmin, &user.UserToken)
			temp_user = append(temp_user, user)
		}
		return temp_user, nil
	} else {
		return nil, err
	}
}

func (sm *UserModel) UpdateToken(user User) (sql.Result, error) {
	smt := `UPDATE "JIRA_USER" SET "USER_TOKEN"=:1 WHERE "USERNAME"=:2 OR "USER_EMAIL"=:3`

	return DbOracle.Db.Exec(smt, user.UserToken, user.Username, user.UserEmail)
}

func (sm *UserModel) InsertUser(user User) (sql.Result, error) {
	smt := `INSERT INTO "JIRA_USER"("USERNAME", "USER_FULL_NAME", "USER_EMAIL", "USER_PASSWORD", "IS_ADMIN", "USER_TOKEN") VALUES (:1, :2, :3, :4, :5, :6)`

	return DbOracle.Db.Exec(smt, user.Username, user.UserFullName, user.UserEmail, user.UserPassword, user.IsAdmin, user.UserToken)
}

func (um *UserModel) Check_user(ad string, am string) ([]User, error) {
	var temp_admin []User
	query := fmt.Sprintf("SELECT * FROM \"JIRA_USER\" WHERE \"USERNAME\" = '%v' OR \"USER_EMAIL\" = '%v'", ad, am)

	rows, err := DbOracle.Db.Query(query)

	if err == nil {
		for rows.Next() {
			user := User{}

			rows.Scan(&user.UserId, &user.Username, &user.UserFullName, &user.UserEmail, &user.UserPassword, &user.IsAdmin, &user.UserToken)

			temp_admin = append(temp_admin, user)
		}
		return temp_admin, nil
	} else {
		return nil, err
	}
}
func (sm *UserModel) UpdateUser(id int, Struser string, Strfull_name string, Stremail string, Strpassword string, isAdmin string) (sql.Result, error) {
	var UserQuery, PasswordQuery, AdminQuery string
	if Struser != "" {
		UserQuery = fmt.Sprintf("USERNAME = '%v',", Struser)
	} else {
		UserQuery = "USERNAME=USERNAME,"
	}
	if Strpassword != "" {
		PasswordQuery = fmt.Sprintf("USER_PASSWORD = '%v',", Strpassword)
	} else {
		PasswordQuery = "USER_PASSWORD=USER_PASSWORD,"
	}
	if isAdmin == "" {
		AdminQuery = "IS_ADMIN=IS_ADMIN,"
	} else {
		AdminQuery = fmt.Sprintf("IS_ADMIN = %v,", isAdmin)
	}
	smt := fmt.Sprintf(`UPDATE "JIRA_USER" SET %v %v %v "USER_FULL_NAME"=:1, "USER_EMAIL"=:2 WHERE "USER_ID"=:3`, UserQuery, PasswordQuery, AdminQuery)
	return DbOracle.Db.Exec(smt, Strfull_name, Stremail, id)
}

func (sm *UserModel) DeleteUser(id string) (sql.Result, error) {
	query := fmt.Sprintf("DELETE FROM JIRA_USER WHERE USER_ID = '%v'", id)
	return DbOracle.Db.Exec(query)
}
func (ue *UserModel) Check_user_exist(id string) ([]User, error) {
	var temp_exist []User
	query := fmt.Sprintf("SELECT * FROM JIRA_USER WHERE USER_ID = '%v'", id)

	rows, err := DbOracle.Db.Query(query)

	if err == nil {
		for rows.Next() {
			user_ := User{}

			rows.Scan(&user_.UserId, &user_.Username, &user_.UserFullName, &user_.UserEmail, &user_.UserPassword, &user_.IsAdmin, &user_.UserToken)

			temp_exist = append(temp_exist, user_)
		}
		return temp_exist, nil
	} else {
		return nil, err
	}
}
