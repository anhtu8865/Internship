package models

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	. "jira/common/db"
	"strconv"

	// . "jira/common/helpers"

	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var IssuesModels = IssuesModel{}

// var IssueModels = Issue{}

type Issue struct {
	Key             string
	Name            string
	Project         string
	Issue_Type      int
	Id              int
	Icon            string
	Fields          []Field
	Project_Name    string
	Issue_Type_Name string
	Project_Avatar  string
	Status          string
}

type CustomField2 struct {
	Custom_Field int
	Name         string
	Field_Type   string
	Description  string
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

func (pm *IssuesModel) GetAllCustomFieldsOfScreen(id string) ([]CustomField2, error) {
	query := fmt.Sprintf("select custom_field, name, field_type, description from new_jira_screen_custom_field A, new_jira_custom_field B where A.custom_field = B.id and A.screen = '%v'", id)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		var ListCustomFields []CustomField2
		for rows.Next() {
			customField := CustomField2{}
			rows.Scan(&customField.Custom_Field, &customField.Name, &customField.Field_Type, &customField.Description)
			ListCustomFields = append(ListCustomFields, customField)
		}
		return ListCustomFields, nil
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

func (pm *IssuesModel) Get() ([]Issue, error) {
	query := fmt.Sprintf("select * from NEW_JIRA_ISSUE")
	rows, err := DbOracle.Db.Query(query)
	var ListIssues []Issue
	if err == nil {
		for rows.Next() {
			issue := Issue{}
			rows.Scan(&issue.Key, &issue.Name, &issue.Project, &issue.Issue_Type, &issue.Id, &issue.Icon, &issue.Status)
			issue.Fields, err = FieldsModels.GetAllFieldsByIssueKey(issue.Key)
			if err != nil {

				return nil, err
			}
			query = fmt.Sprintf("select project_name, project_avatar from new_jira_project where project_key = '%v'", issue.Project)
			rows, err := DbOracle.Db.Query(query)
			if err == nil {
				for rows.Next() {
					rows.Scan(&issue.Project_Name, &issue.Project_Avatar)
				}
			} else {
				return nil, err
			}
			query = fmt.Sprintf("select name from new_jira_issue_type where ID = '%v'", issue.Issue_Type)
			rows, err = DbOracle.Db.Query(query)
			if err == nil {
				for rows.Next() {
					rows.Scan(&issue.Issue_Type_Name)
				}
			} else {
				return nil, err
			}
			ListIssues = append(ListIssues, issue)
		}
	} else {
		return nil, err
	}
	return ListIssues, nil
}

func (pm *IssuesModel) GetById(id string) ([]Issue, error) {
	query := fmt.Sprintf("select * from NEW_JIRA_ISSUE where ID = '%v'", id)
	rows, err := DbOracle.Db.Query(query)
	issue := Issue{}
	var ListIssues []Issue
	if err == nil {
		for rows.Next() {
			rows.Scan(&issue.Key, &issue.Name, &issue.Project, &issue.Issue_Type, &issue.Id, &issue.Icon, &issue.Status)
			issue.Fields, err = FieldsModels.GetAllFieldsByIssueKey(issue.Key)
			if err != nil {

				return nil, err
			}
			query = fmt.Sprintf("select project_name, project_avatar from new_jira_project where project_key = '%v'", issue.Project)
			rows, err := DbOracle.Db.Query(query)
			if err == nil {
				for rows.Next() {
					rows.Scan(&issue.Project_Name, &issue.Project_Avatar)
				}
			} else {
				return nil, err
			}
			query = fmt.Sprintf("select name from new_jira_issue_type where ID = '%v'", issue.Issue_Type)
			rows, err = DbOracle.Db.Query(query)
			if err == nil {
				for rows.Next() {
					rows.Scan(&issue.Issue_Type_Name)
				}
			} else {
				return nil, err
			}
			ListIssues = append(ListIssues, issue)
		}
	} else {
		return nil, err
	}
	return ListIssues, nil
}

func (pm *IssuesModel) Create(r io.ReadCloser, userId int64) ([]Issue, error) {
	var issue Issue
	json.NewDecoder(r).Decode(&issue)
	query := fmt.Sprintf("select C.permission_id from new_jira_user_project_role A, new_jira_role_permission B, new_jira_permission C where A.user_id = '%v' and A.project_key = '%v' and A.role_id = B.role_id and B.permission_id = C.permission_id", userId, issue.Project)
	rows, err := DbOracle.Db.Query(query)
	if err != nil {
		return nil, err
	}
	var listPermission_id []int
	for rows.Next() {
		var permission_id int
		rows.Scan(&permission_id)
		listPermission_id = append(listPermission_id, permission_id)
	}
	if len(listPermission_id) == 0 {
		return nil, nil
	}
	for i, v := range listPermission_id {
		if v == 5 {
			break
		}
		if i == len(listPermission_id)-1 {
			return nil, nil
		}
	}
	query = fmt.Sprintf(
		`INSERT INTO NEW_JIRA_ISSUE (KEY,NAME,PROJECT,ISSUE_TYPE,ID,ICON)
		VALUES ('%v', '%v', '%v', '%v', SEQ_NEW_JIRA_ISSUE.nextval, '%v')`,
		issue.Key, issue.Name, issue.Project, issue.Issue_Type, issue.Icon)
	_, err = DbOracle.Db.Exec(query)
	if err == nil {
		_, err := FieldsModels.Create(issue.Fields)
		if err != nil {
			return nil, err
		}
		rowsLastRecord, errLastRecord :=
			DbOracle.Db.Query("SELECT * FROM (SELECT * FROM NEW_JIRA_ISSUE ORDER BY ID DESC) WHERE ROWNUM = 1")
		if errLastRecord == nil {
			var ListIssues []Issue
			for rowsLastRecord.Next() {
				issue := Issue{}
				rowsLastRecord.Scan(&issue.Key, &issue.Name, &issue.Project, &issue.Issue_Type, &issue.Id, &issue.Icon, &issue.Status)
				ListIssues = append(ListIssues, issue)
			}
			issues, err := IssuesModels.GetById(strconv.Itoa(ListIssues[0].Id))
			if err != nil {
				return nil, err
			}
			return issues, nil
		} else {
			return nil, err
		}
	} else {
		return nil, err
	}
}

func (pm *IssuesModel) Update(r io.ReadCloser, id string, userId int64) ([]Issue, error) {
	var issue Issue
	json.NewDecoder(r).Decode(&issue)
	query := fmt.Sprintf("select C.permission_id from new_jira_user_project_role A, new_jira_role_permission B, new_jira_permission C where A.user_id = '%v' and A.project_key = '%v' and A.role_id = B.role_id and B.permission_id = C.permission_id", userId, issue.Project)
	rows, err := DbOracle.Db.Query(query)
	if err != nil {
		return nil, err
	}
	var listPermission_id []int
	for rows.Next() {
		var permission_id int
		rows.Scan(&permission_id)
		listPermission_id = append(listPermission_id, permission_id)
	}
	if len(listPermission_id) == 0 {
		return nil, nil
	}
	for i, v := range listPermission_id {
		if v == 7 {
			break
		}
		if i == len(listPermission_id)-1 {
			return nil, nil
		}
	}
	query = fmt.Sprintf(`UPDATE new_jira_issue SET name = '%v' WHERE id = '%v'`, issue.Name, id)
	_, err = DbOracle.Db.Exec(query)
	if err == nil {
		query := fmt.Sprintf("delete from new_jira_field where issue = '%v'", issue.Key)
		_, err = DbOracle.Db.Exec(query)
		if err != nil {
			return nil, err
		}
		_, err := FieldsModels.Create(issue.Fields)
		if err != nil {
			return nil, err
		}
		issues, err := IssuesModels.GetById(id)
		if err != nil {
			return nil, err
		}
		return issues, nil
	} else {
		return nil, err
	}
}

func (pm *IssuesModel) Delete(id string, userId int64) ([]Issue, error) {
	issues, err := IssuesModels.GetById(id)
	if err != nil {
		return nil, err
	}
	query := fmt.Sprintf("select C.permission_id from new_jira_user_project_role A, new_jira_role_permission B, new_jira_permission C where A.user_id = '%v' and A.project_key = '%v' and A.role_id = B.role_id and B.permission_id = C.permission_id", userId, issues[0].Project)
	rows, err := DbOracle.Db.Query(query)
	if err != nil {
		return nil, err
	}
	var listPermission_id []int
	for rows.Next() {
		var permission_id int
		rows.Scan(&permission_id)
		listPermission_id = append(listPermission_id, permission_id)
	}
	if len(listPermission_id) == 0 {
		return nil, nil
	}
	for i, v := range listPermission_id {
		if v == 6 {
			break
		}
		if i == len(listPermission_id)-1 {
			return nil, nil
		}
	}
	query = fmt.Sprintf("delete from new_jira_field where issue = '%v'", issues[0].Key)
	_, err = DbOracle.Db.Exec(query)
	if err != nil {
		return nil, err
	}
	query = fmt.Sprintf("DELETE FROM NEW_JIRA_ISSUE WHERE KEY = '%v'", issues[0].Key)
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
