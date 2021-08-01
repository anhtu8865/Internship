package routes

import (
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var IssueRouter = IssueRoute{GroupName: "/api/issues"}

type IssueRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (iss *IssueRoute) Init(router *gin.Engine) {
	iss.RouterGroup = router.Group(iss.GroupName)
	{
		iss.RouterGroup.GET("/", iss.Get())
		iss.RouterGroup.GET("/:id", iss.GetById())
		iss.RouterGroup.PUT("/", iss.InsertIssue())
		iss.RouterGroup.POST("/", iss.UpdateIssue())
		iss.RouterGroup.DELETE("/:id", iss.DeleteIssue())
	}
}

func (iss *IssueRoute) Get() gin.HandlerFunc {
	return IssueHandlers.Get()
}
func (iss *IssueRoute) GetById() gin.HandlerFunc {
	return IssueHandlers.GetById()
}
func (iss *IssueRoute) InsertIssue() gin.HandlerFunc {
	return IssueHandlers.InsertIssue()
}
func (iss *IssueRoute) UpdateIssue() gin.HandlerFunc {
	return IssueHandlers.UpdateIssue()
}
func (iss *IssueRoute) DeleteIssue() gin.HandlerFunc {
	return IssueHandlers.DeleteIssue()
}
