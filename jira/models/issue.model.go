package models

import (
	"database/sql"
	"fmt"
	. "jira/common/db"

	// . "jira/common/helpers"

	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var IssueModels = IssueModel{}

// var ProjectModels = Project{}

type Issue struct {
	IssueId          int    `json:"Issue_Id"`
	ProjectId        int    `json:"Project_Id"`
	IssueType        string `json:"Issue_Type"`
	IssueSummary     string `json:"Issue_Summary"`
	IssueDescription string `json:"Issue_Description"`
	IssueAssignee    int    `json:"Issue_Assignee"`
	IssueReporter    int    `json:"Issue_Reporter"`
	IssueCreator     int    `json:"Issue_Creator"`
	Status           string `json:"Status"`
	KeyStatus        int    `json:"Key_Status"`
	Priority         string `json:"Priority"`
	KeyPriority      int    `json:"Key_Priority"`
	Estimate         int    `json:"Estimate"`
	WorkFlow         string `json:"Work_Flow`
}

/*ISSUE_ID
PROJECT_ID
ISSUE_TYPE
ISSUE_SUMMARY
ISSUE_DESCRIPTION
ISSUE_ASSIGNEE
ISSUE_REPORTER
ISSUE_CREATOR
STATUS
KEY_PRIORYTY
PRIORITY
KEY_ESTIMATE
ESTIMATE
KEY_STATUS
WORK_FLOW*/
type IssueModel struct {
	Issue []Issue
}

//type IssueModel struct{}

func (is *IssueModel) Get() ([]Issue, error) {
	var temp_issue []Issue
	rows, err := DbOracle.Db.Query("select * from JIRA_ISSUE")

	if err != nil {
		return nil, err
	} else {
		for rows.Next() {
			issue := Issue{}
			rows.Scan(&issue.IssueId, &issue.ProjectId, &issue.IssueType, &issue.IssueSummary, &issue.IssueDescription, &issue.IssueAssignee, &issue.IssueReporter, &issue.IssueCreator, &issue.Status, &issue.KeyStatus, &issue.Priority, &issue.KeyPriority, &issue.Estimate, &issue.WorkFlow)
			temp_issue = append(temp_issue, issue)
		}
		return temp_issue, nil
	}
}

func (is *IssueModel) GetById(id string) ([]Issue, error) {
	var temp_issue_ []Issue
	rows, err := DbOracle.Db.Query("select * from JIRA_USER WHWRE ISSUE_ID='%v'", id)

	if err != nil {
		return nil, err
	} else {
		for rows.Next() {
			issue := Issue{}
			rows.Scan(&issue.IssueId, &issue.ProjectId, &issue.IssueType, &issue.IssueSummary, &issue.IssueDescription, &issue.IssueAssignee, &issue.IssueReporter, &issue.IssueCreator, &issue.Status, &issue.KeyStatus, &issue.Priority, &issue.KeyPriority, &issue.Estimate, &issue.WorkFlow)
			temp_issue_ = append(temp_issue_, issue)
		}
		return temp_issue_, nil
	}
}
func (is *IssueModel) InsertIssue(issue Issue) (sql.Result, error) {
	smt := `INSERT INTO "JIRA_ISSUE"(PROJECT_ID, ISSUE_TYPE, ISSUE_SUMMARY, ISSUE_DESCRIPTION, ISSUE_ASSIGNEE, ISSUE_REPORTER, ISSUE_CREATOR, KEY_STATUS, STATUS, KEY_PRIORITY, PRIORITY, ESTIMATE, WORK_FLOW) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13)`

	return DbOracle.Db.Exec(smt, issue.ProjectId, issue.IssueType, issue.IssueSummary, issue.IssueDescription, issue.IssueAssignee, issue.IssueReporter, issue.IssueCreator, issue.KeyStatus, issue.Status, issue.KeyPriority, issue.Priority, issue.Estimate, issue.WorkFlow)
}

func (is *IssueModel) UpdateIssue(issue Issue) (sql.Result, error) {
	smt := `UPDATE JIRA_ISSUE SET ISSUE_TYPE=:1, ISSUE_SUMMARY=:2, ISSUE_DESCRIPTION=:3, ISSUE_ASSIGNEE=:4, ISSUE_REPORTER=:5, ISSUE_CREATOR=:6, KEY_STATUS=:7, STATUS=:8, KEY_PRIORITY=:9, PRIORITY=:10, ESTIMATE=:11, WORK_FLOW=:12 WHERE ISSUE_ID=:13`

	return DbOracle.Db.Exec(smt, issue.IssueType, issue.IssueSummary, issue.IssueDescription, issue.IssueAssignee, issue.IssueReporter, issue.IssueCreator, issue.KeyStatus, issue.Status, issue.KeyPriority, issue.Priority, issue.Estimate, issue.WorkFlow, issue.IssueId)
}

func (is *IssueModel) DeleteIssue(id string) (sql.Result, error) {

	query := fmt.Sprintf("DELETE FROM JIRA_ISSUE WHERE ISSUE_ID = '%v'", id)

	return DbOracle.Db.Exec(query)
}
