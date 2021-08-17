package routes

import (
	// "jira/common/middleware/auth"

	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var ProjectUserRoleRouter = ProjectUserRoleRoute{GroupName:"/api/project-user-role"}
type ProjectUserRoleRoute struct{
    GroupName string
    RouterGroup *gin.RouterGroup
}
func (pr *ProjectUserRoleRoute) Init(router *gin.Engine) {
	pr.RouterGroup = router.Group(pr.GroupName)
	{
	  pr.RouterGroup.GET("",pr.getAll())

	}
}
func (pr *ProjectUserRoleRoute) getAll() gin.HandlerFunc{
    return ProjectUserRoleHandlers.GetUserRoleInProject()
}