package routes

import (
	"jira/common/middleware/auth"
	"jira/handlers"

	"github.com/gin-gonic/gin"
)

var FieldRouter = FieldRoute{GroupName: "/api/fields"}

type FieldRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (f *FieldRoute) Init(router *gin.Engine) {
	f.RouterGroup = router.Group(f.GroupName)
	{
		f.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
		f.RouterGroup.PUT("/", f.Create())
		f.RouterGroup.POST("/:id", f.Update())
		f.RouterGroup.GET("/", f.Get())
		f.RouterGroup.GET("/:id", f.GetById())

	}
}

func (f *FieldRoute) Create() gin.HandlerFunc {
	//f.RouterGroup.Use(auth.CheckUserLoged)
	//f.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return handlers.FieldHandlers.Create()
}

func (f *FieldRoute) Update() gin.HandlerFunc {
	//f.RouterGroup.Use(auth.CheckUserLoged)
	//f.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return handlers.FieldHandlers.Update()
}

func (f *FieldRoute) Get() gin.HandlerFunc {
	//f.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return handlers.FieldHandlers.Get()
}
func (f *FieldRoute) GetById() gin.HandlerFunc {
	//f.RouterGroup.Use(auth.CheckUserLoged)
	//f.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return handlers.FieldHandlers.GetById()
}
