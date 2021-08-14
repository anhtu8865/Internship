package models

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	. "jira/common/db"

	// . "jira/common/helpers"

	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var IssuesModels = IssuesModel{}

// var IssueModels = Issue{}

type Issue struct {
	Key        string
	Name       string
	Project    string
	Issue_Type int
	Id         int
	Icon       string
}

type Issue2 struct {
	Key             string
	Name            string
	Project         string
	Project_Name    string
	Issue_Type_Name string
	Id              int
	Icon            string
}

type ProjectIssueTypeScreen2 struct {
	Id              int
	Project         string
	Issue_Type      int
	Screen          int
	Project_Name    string
	Issue_Type_Name string
	Issue_Type_Icon string
}

type IssuesModel struct {
	Issues []Issue
}

func (pm *IssuesModel) Get() ([]Issue2, error) {
	rows, err := DbOracle.Db.Query(`select A.KEY, A.NAME, A.PROJECT, B.PROJECT_NAME, C.NAME AS ISSUE_TYPE_NAME, A.ID, A.ICON from NEW_JIRA_ISSUE A JOIN NEW_JIRA_PROJECT B ON A.PROJECT = B.PROJECT_KEY JOIN NEW_JIRA_ISSUE_TYPE C ON A.ISSUE_TYPE = C.ID`)
	if err == nil {
		var ListIssues []Issue2
		for rows.Next() {
			issue := Issue2{}
			rows.Scan(&issue.Key, &issue.Name, &issue.Project, &issue.Project_Name, &issue.Issue_Type_Name, &issue.Id, &issue.Icon)
			ListIssues = append(ListIssues, issue)
		}
		return ListIssues, nil
	} else {
		return nil, err
	}
}

func (pm *IssuesModel) CreateInit() ([]ProjectIssueTypeScreen2, error) {
	rows, err := DbOracle.Db.Query(`SELECT A.ID, A.PROJECT, A.ISSUE_TYPE, A.SCREEN, B.PROJECT_NAME, C.NAME AS ISSUE_TYPE_NAME, C.ICON AS ISSUE_TYPE_ICON FROM NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN A JOIN NEW_JIRA_PROJECT B ON A.PROJECT = B.PROJECT_KEY JOIN NEW_JIRA_ISSUE_TYPE C ON A.ISSUE_TYPE = C.ID`)
	if err == nil {
		var ListProjectIssueTypeScreens []ProjectIssueTypeScreen2
		for rows.Next() {
			projectIssueTypeScreen := ProjectIssueTypeScreen2{}
			rows.Scan(&projectIssueTypeScreen.Id, &projectIssueTypeScreen.Project, &projectIssueTypeScreen.Issue_Type, &projectIssueTypeScreen.Screen, &projectIssueTypeScreen.Project_Name, &projectIssueTypeScreen.Issue_Type_Name, &projectIssueTypeScreen.Issue_Type_Icon)
			ListProjectIssueTypeScreens = append(ListProjectIssueTypeScreens, projectIssueTypeScreen)
		}
		return ListProjectIssueTypeScreens, nil
	} else {
		return nil, err
	}
}

func (pm *IssuesModel) GetById(id string) ([]Issue, error) {
	query := fmt.Sprintf("select * from NEW_JIRA_ISSUE where ID = '%v'", id)
	fmt.Println(query)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		var ListIssues []Issue
		for rows.Next() {
			issue := Issue{}
			rows.Scan(&issue.Key, &issue.Name, &issue.Project, &issue.Issue_Type, &issue.Id, &issue.Icon)
			ListIssues = append(ListIssues, issue)
		}
		return ListIssues, nil
	} else {
		return nil, err
	}
}

func (pm *IssuesModel) Create(r io.ReadCloser) ([]Issue, error) {
	var issue Issue
	json.NewDecoder(r).Decode(&issue)
	query := fmt.Sprintf(
		`INSERT INTO NEW_JIRA_ISSUE (KEY,NAME,PROJECT,ISSUE_TYPE,ID,ICON) 
		VALUES ('%v', '%v', '%v', '%v', SEQ_NEW_JIRA_ISSUE.nextval, '%v')`,
		issue.Key, issue.Name, issue.Project, issue.Issue_Type, issue.Icon)
	_, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsLastRecord, errLastRecord :=
			DbOracle.Db.Query("SELECT * FROM (SELECT * FROM NEW_JIRA_ISSUE ORDER BY ID DESC) WHERE ROWNUM = 1")
		if errLastRecord == nil {
			var ListIssues []Issue
			for rowsLastRecord.Next() {
				issue := Issue{}
				rowsLastRecord.Scan(&issue.Key, &issue.Name, &issue.Project, &issue.Issue_Type, &issue.Id, &issue.Icon)
				ListIssues = append(ListIssues, issue)
			}
			return ListIssues, nil
		} else {
			return nil, err
		}
	} else {
		return nil, err
	}
}

func UpdateQueryIssue(issue map[string]interface{}, id string) string {

	var Key, Name, Project, Issue_Type, Icon string
	if issue["Key"] != nil {
		Key = fmt.Sprintf("'%v'", issue["Key"])
	} else {
		Key = ""
	}
	if issue["Name"] != nil {
		Name = fmt.Sprintf("'%v'", issue["Name"])
	} else {
		Name = ""
	}
	if issue["Project"] != nil {
		Project = fmt.Sprintf("'%v'", issue["Project"])
	} else {
		Project = ""
	}
	if issue["Issue_Type"] != nil {
		Issue_Type = fmt.Sprintf("'%v'", issue["Issue_Type"])
	} else {
		Issue_Type = ""
	}
	if issue["Icon"] != nil {
		Icon = fmt.Sprintf("'%v'", issue["Icon"])
	} else {
		Icon = ""
	}
	query := fmt.Sprintf("UPDATE NEW_JIRA_ISSUE SET KEY = %v, NAME = %v, PROJECT = %v, ISSUE_TYPE = %v, ICON = %v WHERE ID = %v",
		Key, Name, Project, Issue_Type, Icon, id)
	//fmt.Println(query)
	return query
}

func (pm *IssuesModel) Update(r io.ReadCloser, id string) ([]Issue, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	query := UpdateQueryIssue(myMap, id)
	row, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		query := fmt.Sprintf("select * from NEW_JIRA_ISSUE where ID = '%v'", id)
		rowsUpdatedtRecord, errUpdatedtRecord :=
			DbOracle.Db.Query(query)
		if errUpdatedtRecord == nil {
			var ListIssues []Issue
			for rowsUpdatedtRecord.Next() {
				issue := Issue{}
				rowsUpdatedtRecord.Scan(&issue.Key, &issue.Name, &issue.Project, &issue.Issue_Type, &issue.Id, &issue.Icon)
				ListIssues = append(ListIssues, issue)
			}
			return ListIssues, nil
		} else {
			return nil, err
		}

	} else {
		return nil, err
	}
}

func (pm *IssuesModel) Delete(id string) ([]Issue, error) {
	issues, err := IssuesModels.GetById(id)
	if err != nil {
		return nil, err
	}
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_ISSUE WHERE ID = %v", id)
	row, err := DbOracle.Db.Exec(query)
	if err == nil {
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		return issues, nil
	} else {
		return nil, err
	}
}
