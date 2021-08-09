package routes

import (

	. "jira/handlers"
	"github.com/gin-gonic/gin"
)
var PermissionRouter = PermissionRoute{GroupName: "/api/permission"}

type PermissionRoute struct{
	GroupName string
	RouterGroup *gin.RouterGroup
}

func (pr *PermissionRoute) Init(router *gin.Engine){
	pr.RouterGroup = router.Group(pr.GroupName)
	{

	pr.RouterGroup.GET("",pr.GetAllRouter())
	
	}
}

//get all permission
func (pr *PermissionRoute) GetAllRouter() gin.HandlerFunc{
  
   return PermissionHandlers.GetAllPermission()
}