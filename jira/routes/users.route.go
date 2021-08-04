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
		// u.RouterGroup.POST("/", u.Signin())
		u.RouterGroup.POST("/sign-up", u.Signup())
		u.RouterGroup.GET("/",auth.CheckUserLoged, u.Index())
		u.RouterGroup.DELETE("/delete-user", u.DeleteUser())
		u.RouterGroup.PUT("/admin/update-user",u.UpdateUserByAdmin())
		u.RouterGroup.POST("/",u.Singin())
		// u.RouterGroup.PUT("/:id", auth.CheckUserLoged, auth.CheckAdmin, u.UpdateUser())
		// u.RouterGroup.DELETE("/:id", auth.CheckUserLoged, auth.CheckAdmin, u.DeleteUser())
	}
}


//Register User by admin
func (u *UserRoute) Signup() gin.HandlerFunc {
	return UserHandlers.CreateUser()
}
//View All User 
func (u *UserRoute) Index() gin.HandlerFunc {
	return UserHandlers.Index()
}
//Delete User
func (u *UserRoute) DeleteUser() gin.HandlerFunc{
   return UserHandlers.DeleteUser()
}
//Update User by Admin
func (u *UserRoute) UpdateUserByAdmin() gin.HandlerFunc{
	return UserHandlers.UpdateUser()
}
//Login User 
func (u *UserRoute) Singin() gin.HandlerFunc{
	return UserHandlers.Singin()
}
// func (u *UserRoute) UpdateUser() gin.HandlerFunc {
// 	//u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
// 	return UserHandlers.UpdateUser()
// }
// func (u *UserRoute) DeleteUser() gin.HandlerFunc {
// 	//u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
// 	return UserHandlers.DeleteUser()
// }
