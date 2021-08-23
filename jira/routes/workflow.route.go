package routes

import (
	. "jira/handlers"

	"github.com/gin-gonic/gin"
)

var WorkflowsRouter = WorkflowsRoute{GroupName: "/api/workflows"}

type WorkflowsRoute struct {
	GroupName   string
	RouterGroup *gin.RouterGroup
}

func (u *WorkflowsRoute) Init(router *gin.Engine) {
	u.RouterGroup = router.Group(u.GroupName)
	{

		u.RouterGroup.GET("/", u.GetAllWorkflow())
		// u.RouterGroup.POST("update", u.UpdateWorkflowProject())
		u.RouterGroup.DELETE("delete-project", u.DeleteWorkflowProject())
		u.RouterGroup.POST("", u.AddProjectToWorkflow())
	}

}

func (u *WorkflowsRoute) GetAllWorkflow() gin.HandlerFunc {

	return WorkflowsHandlers.GetAllWorkflow()
}

// func (u *WorkflowsRoute) UpdateWorkflowProject() gin.HandlerFunc {
// 	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
// 	return WorkflowsHandlers.UpdateWorkflowProject()
// }

func (u *WorkflowsRoute) DeleteWorkflowProject() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return WorkflowsHandlers.DeleteWorkflowProject()
}

func (u *WorkflowsRoute) AddProjectToWorkflow() gin.HandlerFunc {
	// u.RouterGroup.Use(auth.CheckUserLoged, auth.CheckAdmin)
	return WorkflowsHandlers.AddProjectToWorkflow()
}

// func (u *ProjectsRoute) Login(cxt *gin.Context) {

// }
