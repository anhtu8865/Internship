package models

import (
	"fmt"
	"database/sql"
	. "jira/common/db"
	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var UserModels = UserModel{}

type User struct {
	UserId       int    `json:"User_Id"`
	UserName     string `json:"Username"`
	UserFullName string `json:"User_Full_Name"`
	UserEmail    string `json:"User_Email"`
	UserPassword string `json:"User_Password"`
	IsAdmin      int    `json:"Is_Admin"`
	// UserToken    string `json:"User_Token"`
}
type UserModel struct {
	Users []User
}

//Get All User from db
func (sm *UserModel) GetAllUser() ([]User, error) {
	var temp_user []User
	//query select user
	smt := `SELECT * FROM NEW_JIRA_USER`
	rows, err := DbOracle.Db.Query(smt)
	if err == nil {
		//for load full user
		for rows.Next() {
			user := User{}
			rows.Scan(&user.UserId, &user.UserName, &user.UserFullName, &user.UserEmail, &user.UserPassword, &user.IsAdmin)
			temp_user = append(temp_user, user)
		}
		return temp_user, nil
	} else {
		return nil, err
	}
}

//Add User to db
func (sm *UserModel) AddUser(user User) (sql.Result, error) {
	//add db user from client to db
	smt := `INSERT INTO "NEW_JIRA_USER"("USER_NAME", "USER_FULL_NAME", "USER_EMAIL", "USER_PASSWORD", "USER_GLOBAL_ROLE") VALUES (:1, :2, :3, :4, :5)`
	return DbOracle.Db.Exec(smt, user.UserName, user.UserFullName, user.UserEmail, user.UserPassword, user.IsAdmin)
}

//Check User Exist by username or email
func (sm *UserModel) Check_User_Exist(ad string, am string) ([]User, error) {
	var temp_user []User
	//query user by username or email
	query := fmt.Sprintf("SELECT * FROM \"NEW_JIRA_USER\" WHERE \"USER_NAME\" = '%v' OR \"USER_EMAIL\" = '%v'", ad, am)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		//for list user
		for rows.Next() {
			user := User{}
			rows.Scan(&user.UserId, &user.UserName, &user.UserFullName, &user.UserEmail, &user.UserPassword, &user.IsAdmin)
			temp_user = append(temp_user, user)
		}
		//return arr user have email or user
		return temp_user, nil

	} else {
		return nil, err
	}
}

//delete user by id user
func (sm *UserModel) DeleteUser(id string) (sql.Result, error) {
	//query delete user by id
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_USER WHERE USER_ID = '%v'", id)
	return DbOracle.Db.Exec(query)
}

//check user exists by id user
//Check xem user có tồn tại ko
func (ue *UserModel) Check_User_Exist_By_Id(id string) ([]User, error) {
	var temp_exist []User
	query := fmt.Sprintf("SELECT * FROM NEW_JIRA_USER WHERE USER_ID = '%v'", id)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		for rows.Next() {
			user := User{}
			rows.Scan(
				&user.UserId,
				&user.UserName,
				&user.UserFullName,
				&user.UserEmail,
				&user.UserPassword, 
				&user.IsAdmin,
			)

			temp_exist = append(temp_exist,user)
		}
		return temp_exist, nil
	} else {
		return nil, err
	}
}
//Update thông tin User
func (sm *UserModel) UpdateUser(id int, strFullName string, strPassword string, isAdmin string) (sql.Result, error) {
	var UserQuery, PasswordQuery, AdminQuery string
	if strFullName != "" {
		UserQuery = fmt.Sprintf("USER_FULL_NAME = '%v',", strFullName)
	} else {
		UserQuery = "USER_FULL_NAME=USER_FULL_NAME,"
	}
	if strPassword != "" {
		PasswordQuery = fmt.Sprintf("USER_PASSWORD = '%v',", strPassword)
	} else {
		PasswordQuery = "USER_PASSWORD=USER_PASSWORD,"
	}
	if isAdmin == "" {
		AdminQuery = "USER_GLOBAL_ROLE=USER_GLOBAL_ROLE"
	} else {
		AdminQuery = fmt.Sprintf("USER_GLOBAL_ROLE = %v", isAdmin)
	}
	smt := fmt.Sprintf(`UPDATE "NEW_JIRA_USER" SET  %v %v  %v WHERE "USER_ID"=:1`, UserQuery, PasswordQuery, AdminQuery)
	return DbOracle.Db.Exec(smt, id)
}

// func (sm *UserModel) UpdateToken(user User) (sql.Result, error) {
// 	smt := `UPDATE "JIRA_USER" SET "USER_TOKEN"=:1 WHERE "USERNAME"=:2 OR "USER_EMAIL"=:3`

// 	return DbOracle.Db.Exec(smt, user.UserToken, user.Username, user.UserEmail)
// }

// func (sm *UserModel) InsertUser(user User) (sql.Result, error) {
// 	smt := `INSERT INTO "JIRA_USER"("USERNAME", "USER_FULL_NAME", "USER_EMAIL", "USER_PASSWORD", "IS_ADMIN", "USER_TOKEN") VALUES (:1, :2, :3, :4, :5, :6)`

// 	return DbOracle.Db.Exec(smt, user.Username, user.UserFullName, user.UserEmail, user.UserPassword, user.IsAdmin, user.UserToken)
// }

// func (um *UserModel) Check_user(ad string, am string) ([]User, error) {
// 	var temp_admin []User
// 	query := fmt.Sprintf("SELECT * FROM \"JIRA_USER\" WHERE \"USERNAME\" = '%v' OR \"USER_EMAIL\" = '%v'", ad, am)

// 	rows, err := DbOracle.Db.Query(query)

// 	if err == nil {
// 		for rows.Next() {
// 			user := User{}

// 			rows.Scan(&user.UserId, &user.Username, &user.UserFullName, &user.UserEmail, &user.UserPassword, &user.IsAdmin, &user.UserToken)

// 			temp_admin = append(temp_admin, user)
// 		}
// 		return temp_admin, nil
// 	} else {
// 		return nil, err
// 	}
// }
// func (sm *UserModel) UpdateUser2(id int, Struser string, Strfull_name string, Stremail string, Strpassword string, isAdmin string) (sql.Result, error) {
// 	var UserQuery, PasswordQuery, AdminQuery string
// 	if Strfull_name != "" {
// 		UserQuery = fmt.Sprintf("USER_FULL_NAME = '%v',", Strfull_name)
// 	} else {
// 		UserQuery = "USER_FULL_NAME=USER_FULL_NAME,"
// 	}
// 	if Strpassword != "" {
// 		PasswordQuery = fmt.Sprintf("USER_PASSWORD = '%v',", Strpassword)
// 	} else {
// 		PasswordQuery = "USER_PASSWORD=USER_PASSWORD,"
// 	}
// 	if isAdmin == "" {
// 		AdminQuery = "USER_GLOBAL_ROLE=USER_GLOBAL_ROLE"
// 	} else {
// 		AdminQuery = fmt.Sprintf("USER_GLOBAL_ROLE = %v", isAdmin)
// 	}
// 	smt := fmt.Sprintf(`UPDATE "NEW_JIRA_USER" SET  %v %v  %v WHERE "USER_ID"=:1`, UserQuery, PasswordQuery, AdminQuery)
// 	fmt.Println(smt)
// 	return DbOracle.Db.Exec(smt, id)
// }

// func (sm *UserModel) DeleteUser(id string) (sql.Result, error) {
// 	query := fmt.Sprintf("DELETE FROM JIRA_USER WHERE USER_ID = '%v'", id)
// 	return DbOracle.Db.Exec(query)
// }
// func (ue *UserModel) Check_user_exist(id string) ([]User, error) {
// 	var temp_exist []User
// 	query := fmt.Sprintf("SELECT * FROM JIRA_USER WHERE USER_ID = '%v'", id)

// 	rows, err := DbOracle.Db.Query(query)

// 	if err == nil {
// 		for rows.Next() {
// 			user_ := User{}

// 			rows.Scan(&user_.UserId, &user_.Username, &user_.UserFullName, &user_.UserEmail, &user_.UserPassword, &user_.IsAdmin, &user_.UserToken)

// 			temp_exist = append(temp_exist, user_)
// 		}
// 		return temp_exist, nil
// 	} else {
// 		return nil, err
// 	}
// }
