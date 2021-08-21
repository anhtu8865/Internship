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
		// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
		u.RouterGroup.GET("/",auth.CheckUserLoged, u.Get())
		u.RouterGroup.GET("/:key",auth.CheckUserLoged, u.GetByKey())
		u.RouterGroup.POST("/",auth.CheckUserLoged, auth.CheckTrusted, u.CreateProject())
		u.RouterGroup.PUT("/:key",auth.CheckUserLoged, auth.CheckTrusted, u.UpdateProject())
		u.RouterGroup.DELETE("/:key",auth.CheckUserLoged, auth.CheckTrusted, u.DeleteProject())
	}

}

func (u *ProjectsRoute) Get() gin.HandlerFunc {

	return ProjectsHandlers.Get()
}

func (u *ProjectsRoute) GetByKey() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return ProjectsHandlers.GetByKey()
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
