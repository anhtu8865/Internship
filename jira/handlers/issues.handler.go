package handlers

import (
	. "jira/common/helpers"
	"jira/loggers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var IssuesHandlers = IssuesHandler{}

type IssuesHandler struct {
}

func (u *IssuesHandler) Get() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		issues, err := models.IssuesModels.Get()
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
				Msg:  "Successful",
				Data: issues,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssuesHandler) CreateInit() gin.HandlerFunc {
	//Do everything here, call model etc...

	return func(c *gin.Context) {
		// loggers.Logger.Println("get a get request")
		projectIssueTypeScreens, err := models.IssuesModels.CreateInit()
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
				Msg:  "Successful",
				Data: projectIssueTypeScreens,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssuesHandler) GetById() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		issues, err := models.IssuesModels.GetById(id)
		if err != nil {
			loggers.Logger.Errorln(err.Error())
			response := MessageResponse{
				Msg:  err.Error(),
				Data: issues,
			}
			c.JSON(http.StatusNotFound,
				response,
			)
		} else {
			response := MessageResponse{
				Msg:  "Successful",
				Data: issues,
			}
			c.JSON(http.StatusOK,
				response,
			)
		}

	}
}

func (u *IssuesHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		body := c.Request.Body
		issues, err := models.IssuesModels.Create(body)

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
				Msg:  "Successful",
				Data: issues[0],
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
		// json.NewDecoder(c.Request.Body).Decode(&book)
		// fmt.Println(c.Request.Body)
	}
}

func (u *IssuesHandler) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		body := c.Request.Body
		issues, err := models.IssuesModels.Update(body, id)

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
				Msg:  "Successful",
				Data: issues[0],
			}
			c.JSON(http.StatusCreated,
				response,
			)
		}
	}
}

func (u *IssuesHandler) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		issues, err := models.IssuesModels.Delete(id)
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
				Data: issues[0],
			}
			c.JSON(http.StatusOK,
				response,
			)
		}
	}
}
