package handlers

import (
	// "encoding/json"
	// "fmt"
	"jira/common/helpers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var PermissionRoleHandlers = PermissionRoleHandler{}

type PermissionRoleHandler struct{

}

//get all permission's role
func (pr *PermissionRoleHandler) GetAllPermissionRole() gin.HandlerFunc{
	return func(c *gin.Context) {
		id := c.Query("id")
		permission,err := models.PermissionRoleModels.GetAll(id)
		if err == nil{
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: permission})
		}else{
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error", Data: err})

		}
	}
}