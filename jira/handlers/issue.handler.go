package handlers

import (
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	"jira/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

var IssueHandlers = IssueHandler{}

type IssueHandler struct {
}

func (ih *IssueHandler) Index() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		c.String(http.StatusOK, "Issue routes - do something here")
	}
}
func (ih *IssueHandler) Get() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		issues, err := models.IssueModels.Get()
		if err == nil {

			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: issues})
		} else {
			fmt.Println(err)

		}
	}
}

func (ih *IssueHandler) GetById() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		issue, err := models.IssueModels.GetById(id)

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": err.Error(),
			})
		} else {
			//c.JSON(http.StatusOK, field)
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data by ID Success", Data: issue})
			//c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Sign Up Success", Data: struct{ field []models.Field }{field}})
		}

	}
}

func (u *IssueHandler) InsertIssue() gin.HandlerFunc {
	return func(c *gin.Context) {
		var IssueType, IssueSummary, IssueDescription, WorkFlow, ProjectId, KeyStatus, KeyPriority, Estimate, IssueReporter, IssueCreator, IssueAssignee, StrStatus, StrPriority string
		//var ProjectId, KeyStatus, KeyPriority, Estimate, IssueReporter, IssueCreator, IssueAssignee int
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		ProjectId = fmt.Sprintf("%v", myMap["Project_Id"])
		IssueType = fmt.Sprintf("%v", myMap["Issue_Type"])
		IssueSummary = fmt.Sprintf("%v", myMap["Issue_Summary"])
		IssueDescription = fmt.Sprintf("%v", myMap["Issue_Description"])
		IssueAssignee = fmt.Sprintf("%v", myMap["Issue_Assignee"])
		IssueReporter = fmt.Sprintf("%v", myMap["Issue_Reporter"])
		IssueCreator = fmt.Sprintf("%v", myMap["Issue_Creator"])
		KeyStatus = fmt.Sprintf("%v", myMap["Key_Status"])
		KeyPriority = fmt.Sprintf("%v", myMap["Key_Priority"])
		Estimate = fmt.Sprintf("%v", myMap["Estimate"])
		WorkFlow = fmt.Sprintf("%v", myMap["Work_Flow"])

		if ProjectId == "" || IssueType == "" || IssueSummary == "" ||
			IssueDescription == "" || IssueAssignee == "" || IssueReporter == "" ||
			IssueCreator == "" || KeyStatus == "" || KeyPriority == "" || Estimate == "" || WorkFlow == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			pro_id, _ := strconv.Atoi(ProjectId)
			is_ag, _ := strconv.Atoi(IssueAssignee)
			is_re, _ := strconv.Atoi(IssueReporter)
			is_cre, _ := strconv.Atoi(IssueCreator)
			key_sta, _ := strconv.Atoi(KeyStatus)
			key_pri, _ := strconv.Atoi(KeyPriority)
			es_, _ := strconv.Atoi(Estimate)
			if key_sta == 1 {
				StrStatus = "To do"
			} else if key_sta == 2 {
				StrStatus = "In progress"
			} else if key_sta == 3 {
				StrStatus = "Done"
			}
			if key_pri == 1 {
				StrPriority = "Low"
			} else if key_pri == 2 {
				StrPriority = "Medium"
			} else if key_pri == 3 {
				StrPriority = "High"
			}

			if _, err := models.IssueModels.InsertIssue(models.Issue{ProjectId: pro_id, IssueType: IssueType, IssueSummary: IssueSummary, IssueDescription: IssueDescription, IssueAssignee: is_ag, IssueReporter: is_re, IssueCreator: is_cre, KeyStatus: key_sta, Status: StrStatus, KeyPriority: key_pri, Priority: StrPriority, Estimate: es_, WorkFlow: WorkFlow}); err != nil {
				fmt.Println(err)
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

			} else {
				fmt.Println(err)
				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Create issue success"})
			}
		}
	}
}

func (u *IssueHandler) UpdateIssue() gin.HandlerFunc {
	return func(c *gin.Context) {
		var IssueId, IssueType, IssueSummary, IssueDescription, WorkFlow, KeyStatus, KeyPriority, Estimate, IssueReporter, IssueCreator, IssueAssignee, StrStatus, StrPriority string
		//var ProjectId, KeyStatus, KeyPriority, Estimate, IssueReporter, IssueCreator, IssueAssignee int
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		IssueId = fmt.Sprintf("%v", myMap["Issue_Id"])
		IssueType = fmt.Sprintf("%v", myMap["Issue_Type"])
		IssueSummary = fmt.Sprintf("%v", myMap["Issue_Summary"])
		IssueDescription = fmt.Sprintf("%v", myMap["Issue_Description"])
		IssueAssignee = fmt.Sprintf("%v", myMap["Issue_Assignee"])
		IssueReporter = fmt.Sprintf("%v", myMap["Issue_Reporter"])
		IssueCreator = fmt.Sprintf("%v", myMap["Issue_Creator"])
		KeyStatus = fmt.Sprintf("%v", myMap["Key_Status"])
		KeyPriority = fmt.Sprintf("%v", myMap["Key_Priority"])
		Estimate = fmt.Sprintf("%v", myMap["Estimate"])
		WorkFlow = fmt.Sprintf("%v", myMap["Work_Flow"])

		if IssueId == "" || IssueType == "" || IssueSummary == "" ||
			IssueDescription == "" || IssueAssignee == "" || IssueReporter == "" ||
			IssueCreator == "" || KeyStatus == "" || KeyPriority == "" || Estimate == "" || WorkFlow == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			is_id, _ := strconv.Atoi(IssueId)
			is_ag, _ := strconv.Atoi(IssueAssignee)
			is_re, _ := strconv.Atoi(IssueReporter)
			is_cre, _ := strconv.Atoi(IssueCreator)
			key_sta, _ := strconv.Atoi(KeyStatus)
			key_pri, _ := strconv.Atoi(KeyPriority)
			es_, _ := strconv.Atoi(Estimate)
			if key_sta == 1 {
				StrStatus = "To do"
			} else if key_sta == 2 {
				StrStatus = "In progress"
			} else if key_sta == 3 {
				StrStatus = "Done"
			}
			if key_pri == 1 {
				StrPriority = "Low"
			} else if key_pri == 2 {
				StrPriority = "Medium"
			} else if key_pri == 3 {
				StrPriority = "High"
			}

			if _, err := models.IssueModels.UpdateIssue(models.Issue{IssueId: is_id, IssueType: IssueType, IssueSummary: IssueSummary, IssueDescription: IssueDescription, IssueAssignee: is_ag, IssueReporter: is_re, IssueCreator: is_cre, KeyStatus: key_sta, Status: StrStatus, KeyPriority: key_pri, Priority: StrPriority, Estimate: es_, WorkFlow: WorkFlow}); err != nil {
				fmt.Println(err)
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

			} else {
				fmt.Println(err)
				c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Update issue success"})
			}
		}
	}
}
func (u *IssueHandler) DeleteIssue() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "The parameters are not enough"})
		} else {
			rows, err := models.IssueModels.DeleteIssue(id)

			if err != nil {
				c.JSON(http.StatusBadRequest, helpers.MessageResponse{Msg: "Error running query"})

			} else {
				var roweffect int64
				roweffect, _ = rows.RowsAffected()
				if roweffect == 0 {

					c.JSON(http.StatusConflict, helpers.MessageResponse{Msg: "Issue Id does not exist"})
				} else {
					c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Delete issue success"})

				}

			}

		}
	}
}
