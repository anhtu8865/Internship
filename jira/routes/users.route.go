package routes

import (
	"jira/common/middleware/auth"
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var UserRouter = UserRoute{GroupName: "/api/users"}

type UserRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *UserRoute) Init(router *gin.Engine) {
	u.RouterGroup = router.Group(u.GroupName)
	{
		//u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
		u.RouterGroup.POST("/", u.Signin())
		u.RouterGroup.PUT("/", u.Signup())
		u.RouterGroup.GET("/", auth.CheckUserLoged, auth.CheckAdmin, u.Index())
		u.RouterGroup.PUT("/:id", auth.CheckUserLoged, auth.CheckAdmin, u.UpdateUser())
		u.RouterGroup.DELETE("/:id", auth.CheckUserLoged, auth.CheckAdmin, u.DeleteUser())
	}
}

func (u *UserRoute) Signin() gin.HandlerFunc {
	return UserHandlers.Signin()
}

func (u *UserRoute) Signup() gin.HandlerFunc {
	return UserHandlers.Signup()
}

func (u *UserRoute) Index() gin.HandlerFunc {
	//u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return UserHandlers.Index()
}
func (u *UserRoute) UpdateUser() gin.HandlerFunc {
	//u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return UserHandlers.UpdateUser()
}
func (u *UserRoute) DeleteUser() gin.HandlerFunc {
	//u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return UserHandlers.DeleteUser()
}
