package handlers

import (
	"encoding/json"
	"fmt"
	"jira/models"

	//_ "github.com/alexbrainman/odbc"
	"jira/common/helpers"
	"net/http"
	"github.com/gin-gonic/gin"
	_ "github.com/godror/godror"
)

var ProjectUserRoleHandlers = ProjectUserRoleHandler{}

type ProjectUserRoleHandler struct {
}

func (pr *ProjectUserRoleHandler) GetUserRoleInProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Query("key")
		fmt.Println(id)
		if id == " " {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "id are not enough"})

		} else {
			userroles, err := models.ProjectUserRoleModels.GetAllUser(id)
			if err == nil {
				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: userroles})
			} else {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error", Data: err})

			}
		}
	}
}

//update
func (pr *ProjectUserRoleHandler) UpdateRoleForUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var project_key, user_id, role_id_new string
		//req body
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		//id_project
		project_key = fmt.Sprintf("%v", myMap["projectKey"])
		fmt.Println(project_key)
		//id_user
		user_id = fmt.Sprintf("%v", myMap["userId"])
		// id role new
		role_id_new = fmt.Sprintf("%v", myMap["roleIdNew"])
		//Check role_id_new
		if project_key == " " || user_id == " " || role_id_new == " " {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "ids are not enough"})
		} else {
			//Check project_user_role in data
			existsProjectUser, err := models.ProjectUserRoleModels.ExistsProjecUser(project_key, user_id)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				if len(existsProjectUser) == 0 {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "The User have not in project"})
				}
				if len(existsProjectUser) >= 0 {
					//check role id new
					exists_role, err := models.RoleModels.Check_Role_Exist_By_Id(role_id_new)
					//error
					if err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
						//no error
					} else {
						//have not role id in db Role
						if len(exists_role) == 0 {
							c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "The role have not already"})
						}
						//Have Role
						if len(exists_role) >= 0 {
							if _, err := models.ProjectUserRoleModels.UpdateRoleForUser(project_key, user_id, role_id_new); err != nil {
								c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

							} else {
								c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Update User's Role success"})
							}

						}
					}

				}
			}

		}

	}
}

//add user and role to project
func (pr *ProjectUserRoleHandler) AddUserRoleToProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		var project_key, new_user_id, new_role_id string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		//project_key
		project_key = fmt.Sprintf("%v", myMap["projectKey"])
		//id_user
		new_user_id = fmt.Sprintf("%v", myMap["userId"])
		//id role
		new_role_id = fmt.Sprintf("%v", myMap["roleId"])
		if project_key == " " || new_user_id == " " || new_role_id == " " {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "ids are not enough"})
		} else {
			existsProjectUser, err := models.ProjectUserRoleModels.ExistsProjecUser(project_key, new_user_id)
		    fmt.Println(existsProjectUser)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				if len(existsProjectUser) > 0 {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "User already exists, please choose another user"})
				}
				if len(existsProjectUser) == 0 {
					sm := models.ProjectUserRoleModel{}
					if _, err := sm.AddUserRoleToProject(project_key, new_user_id, new_role_id); err != nil {
						c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
					} else {
						c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Add User Success"})
					}
				}
			}
		}

	}
}

//delete user
func (pr *ProjectUserRoleHandler) DeleteUserForProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		// var myMap map[string]string
		// json.NewDecoder(c.Request.Body).Decode(&myMap)
		project_key :=c.Query("ProjectKey")
		fmt.Println(project_key)
		//id_user
		user_id :=c.Query("UserId")
		fmt.Println(user_id)
		// user_id = fmt.Sprintf("%v", myMap["UserId"])
	   
		if project_key == "" || user_id == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "ids are not enough"})
		} else {
			existsProjectUser, err := models.ProjectUserRoleModels.ExistsProjecUser(project_key, user_id)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
			} else {
				if len(existsProjectUser) == 0 {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "The User have not in project"})
				} else {
					if len(existsProjectUser) > 0 {
						if _, err := models.ProjectUserRoleModels.DeleteUserForProject(project_key, user_id); err != nil {
							c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})
						} else {
							c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete user success"})
						}
					}
				}
			}
		}

	}
}
