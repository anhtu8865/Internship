package handlers

import (
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
