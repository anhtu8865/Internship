package routes

import (
	"jira/common/middleware/auth"
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
	pr.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	pr.RouterGroup.GET("/",auth.CheckUserLoged, auth.CheckAdmin,pr.GetAllRouter())
	pr.RouterGroup.POST("update",pr.UpdatePermission())
	pr.RouterGroup.DELETE("delete-role",pr.DeleteRoleInPermission())
	pr.RouterGroup.POST("",pr.AddRoleToPermission())
	
	}
}

//get all permission
func (pr *PermissionRoute) GetAllRouter() gin.HandlerFunc{
  
   return PermissionHandlers.GetAllPermission()
}
func (pr *PermissionRoute) UpdatePermission() gin.HandlerFunc{
	 return PermissionHandlers.UpdatePermission()
}
func (pr *PermissionRoute) DeleteRoleInPermission() gin.HandlerFunc{
	return PermissionHandlers.DeletePermissionRole()
}

func (pr *PermissionRoute) AddRoleToPermission() gin.HandlerFunc{
	return PermissionHandlers.AddRoleToPermission()
}