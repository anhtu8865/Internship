package handlers

import (
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
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

func (u *ProjectsHandler) GetById() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		projects, err := models.ProjectsModels.GetById(id)
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
		body := c.Request.Body
		projects, err := models.ProjectsModels.CreateProject(body)

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
			c.JSON(http.StatusCreated,
				response,
			)
		}

		// json.NewDecoder(c.Request.Body).Decode(&book)
		// fmt.Println(c.Request.Body)
	}
}

func (u *ProjectsHandler) UpdateProject() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		body := c.Request.Body
		// fmt.Println(params[0])
		message, err := models.ProjectsModels.UpdateProject(body, id)
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
		id := c.Param("id")
		_, err := models.ProjectsModels.DeleteProject(id)
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
