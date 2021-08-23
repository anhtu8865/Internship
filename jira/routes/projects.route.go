package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var ProjectsRouter = ProjectsRoute{GroupName: "/api/projects"}

type ProjectsRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *ProjectsRoute) Init(router *gin.Engine) {
	u.RouterGroup = router.Group(u.GroupName)
	{
		u.RouterGroup.GET("/projectkey", u.GetProjectKey())
		u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
		u.RouterGroup.GET("/", u.Get())

		u.RouterGroup.GET("/:key", u.GetByIdWorkflow())
		u.RouterGroup.POST("/", u.CreateProject())
		u.RouterGroup.PUT("/:key", u.UpdateProject())
		u.RouterGroup.DELETE("/:key", u.DeleteProject())
	}

}

func (u *ProjectsRoute) Get() gin.HandlerFunc {

	return ProjectsHandlers.Get()
}

func (u *ProjectsRoute) GetProjectKey() gin.HandlerFunc {

	return ProjectsHandlers.GetAllProjectKey()
}

func (u *ProjectsRoute) GetByIdWorkflow() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return ProjectsHandlers.GetByIdWorkflow()
}

func (u *ProjectsRoute) CreateProject() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return ProjectsHandlers.CreateProject()
}

func (u *ProjectsRoute) UpdateProject() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return ProjectsHandlers.UpdateProject()
}

func (u *ProjectsRoute) DeleteProject() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return ProjectsHandlers.DeleteProject()
}

// func (u *ProjectsRoute) Login(cxt *gin.Context) {

// }
