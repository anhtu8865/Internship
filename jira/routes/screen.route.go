package routes

import (
	"fmt"
	"jira/handlers"
	"jira/loggers"

	"github.com/gin-gonic/gin"
)

var ScreenRouter = ScreenRoute{GroupName: "/api/screens"}

type ScreenRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}
func (s *ScreenRoute) Init(router *gin.Engine) {
	s.RouterGroup = router.Group(s.GroupName)
	{
		//s.RouterGroup.Use(auth.CheckUserLoged)
		s.RouterGroup.GET("/", s.Index())
		s.RouterGroup.GET("/:id", s.Index())
		s.RouterGroup.PUT("/:id", s.UpdateScreen())
		s.RouterGroup.POST("/", s.CreateScreen())
		s.RouterGroup.DELETE("/:id", s.Del())
		s.RouterGroup.GET("/t", func(c *gin.Context) {
			loggers.Logger.Println("test ")
			loggers.Logger.Warning("war ")
			fmt.Println(c.Writer.Status())
			c.String(401, "test")
			fmt.Println(c.Writer.Status())
		})
	}
}

func (s *ScreenRoute) Index() gin.HandlerFunc {
	return handlers.ScreenHandlers.Index()
}

func (s *ScreenRoute) CreateScreen() gin.HandlerFunc {
	//s.RouterGroup.Use(middleware.OutputWithJSON)
	return handlers.ScreenHandlers.Create()
}

func (s *ScreenRoute) UpdateScreen() gin.HandlerFunc {
	return handlers.ScreenHandlers.Upadate()
}

func (s *ScreenRoute) Del() gin.HandlerFunc {
	return handlers.ScreenHandlers.Delete()
}
