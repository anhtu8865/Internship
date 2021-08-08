package handlers

import (
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	//"github.com/godror/godror/odpi/src"
	_ "github.com/godror/godror"
)

var ProjectsHandlers = ProjectsHandler{}

type ProjectsHandler struct {
}

func (u *ProjectsHandler) Get() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		projects, err := models.ProjectsModels.Get()
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: projects,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: projects,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *ProjectsHandler) GetByKey() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		key := c.Param("key")
		projects, err := models.ProjectsModels.GetByKey(key)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: projects,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: projects,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *ProjectsHandler) CreateProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		var project_key, project_name, project_description, project_lead, workflow_id string

		var myMapNew map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMapNew)
		project_key = fmt.Sprintf("%v", myMapNew["ProjectKey"])
		project_name = fmt.Sprintf("%v", myMapNew["ProjectName"])
		project_description = fmt.Sprintf("%v", myMapNew["ProjectDescription"])
		//project_url = fmt.Sprintf("%v",myMapNew["ProjectUrl"])
		//project_avatar = fmt.Sprintf("%v",myMapNew["ProjectAvatar"])
		project_lead = fmt.Sprintf("%v", myMapNew["ProjectLead"])
		workflow_id = fmt.Sprintf("%v", myMapNew["WorkflowId"])
		// Parameters are null
		if project_key == "" || project_name == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			Exist_project, err := models.ProjectsModels.Check_project(project_name, project_key)
			wf_id, _ := strconv.Atoi(workflow_id)
			lead_id, _ := strconv.Atoi(project_lead)
			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running 1 query"})

			}
			if len(Exist_project) > 0 {
				if Exist_project[0].ProjectKey == project_key && Exist_project[0].ProjectName != project_name {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Key already exists, please choose another Key"})
				}
			}
			if len(Exist_project) > 0 {
				if Exist_project[0].ProjectKey != project_key && Exist_project[0].ProjectName == project_name {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Name already exists, please choose another Name"})
				}
			}
			if len(Exist_project) > 0 {
				if Exist_project[0].ProjectKey == project_key && Exist_project[0].ProjectName == project_name {
					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Key and Name already exists, please choose another Key and Name"})
				}
			}

			if len(Exist_project) == 0 {
				/*
					body := c.Request.Body
					projects, err := models.ProjectsModels.CreateProject(body)

					if err != nil e{
						loggers.Logger.Errorln(err.Error())
						response := MessageResponse{
							Msg:  err.Error(),
							Data: projcts,
						}
						c.JSON(http.StatusNotFound,
							response,
						)
					} else {
						response := MessageResponse{
							Msg:  "Successful",
							Data: projects,
						}
						c.JSON(http.StatusCreated,
							response,
						)
					}
				*/

				scr := models.Project{ProjectKey: project_key, ProjectName: project_name, ProjectDescription: project_description, ProjectLead: lead_id, WorkflowId: wf_id}

				if _, err := models.ProjectsModels.InsertProject(scr); err != nil {
					fmt.Println(err)
					c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

				} else {
					fmt.Println(err)
					c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Create Project Success", Data: scr})
				}
				/*
					err != nil {
						loggers.Logger.Errorln(err.Error())
						response := MessageResponse{
							Msg:  err.Error(),
							Data: nil,
						}
						c.JSON(http.StatusNotFound,
							response,
						)
					} else {
						response := MessageResponse{
							Msg:  "Successfull",
							Data: nil,
						}
						c.JSON(http.StatusConflict,
							response,
						)
					}*/
			}
		}

		// json.NewDecoder(c.Request.Body).Decode(&book)
		// fmt.Println(c.Request.Body)
	}
}

func (u *ProjectsHandler) UpdateProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.Param("key")
		body := c.Request.Body
		// fmt.Println(params[0])
		message, err := models.ProjectsModels.UpdateProject(body, key)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: nil,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  message,
				Data: nil,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

		// json.NewDecoder(c.Request.Body).Decode(&book)

	}
}

func (u *ProjectsHandler) DeleteProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.Param("key")
		_, err := models.ProjectsModels.DeleteProject(key)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: nil,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Delete Successfully!",
				Data: nil,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}
	}
}
