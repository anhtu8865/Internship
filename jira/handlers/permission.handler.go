package handlers

import (
	// "encoding/json"
	// "fmt"
	"jira/common/helpers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var PermissionHandlers = PermissionHandler{}

type PermissionHandler struct{

}
func (pr *PermissionHandler) GetAllPermission() gin.HandlerFunc{
	return func(c *gin.Context) {
		permission,err := models.PermissionModels.GetAllPermission()
		if err == nil{
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: permission})
		}else{
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error", Data: err})

		}
	}
}