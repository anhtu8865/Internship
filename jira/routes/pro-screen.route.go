package routes

import (
	"jira/common/middleware/auth"
	"jira/handlers"

	"github.com/gin-gonic/gin"
)

var ProScreenRouter = ProScreenRoute{GroupName: "/api/project-screen"}

type ProScreenRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (ps *ProScreenRoute) Init(router *gin.Engine) {
	ps.RouterGroup = router.Group(ps.GroupName)
	{
		ps.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
		ps.RouterGroup.PUT("/", ps.Create())
	}
}

func (ps *ProScreenRoute) Create() gin.HandlerFunc {
	//ps.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return handlers.ProScreenHandlers.Create()
}
