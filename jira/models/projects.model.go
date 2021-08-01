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

var ProjectsModels = ProjectsModel{}

// var ProjectModels = Project{}

type Project struct {
	ProjectId          int
	ProjectName        string
	ProjectLead        int
	ProjectUrl         string
	DefaultAssignee    int
	ProjectDescription string
	ProjectAvatar      string
	ProjectKey         string
}

type ProjectsModel struct {
	Projects []Project
}

func (pm *ProjectsModel) Get() ([]Project, error) {
	rows, err := DbOracle.Db.Query("select PROJECT_ID, PROJECT_NAME, PROJECT_LEAD, PROJECT_URL, DEFAULT_ASSIGNEE, PROJECT_DESCRIPTION, PROJECT_AVATAR, PROJECT_KEY from JIRA_PROJECT")
	// a := byte([]`{}`)

	if err == nil {
		var ListProjects []Project
		for rows.Next() {
			// fmt.Println(rows.Err().Error())
			project := Project{}
			rows.Scan(&project.ProjectId, &project.ProjectName, &project.ProjectLead, &project.ProjectUrl, &project.DefaultAssignee, &project.ProjectDescription, &project.ProjectAvatar, &project.ProjectKey)
			ListProjects = append(ListProjects, project)
		}
		return ListProjects, nil
	} else {
		return nil, err
	}
}

func (pm *ProjectsModel) GetById(id string) ([]Project, error) {
	query := fmt.Sprintf("select PROJECT_ID, PROJECT_NAME, PROJECT_LEAD, PROJECT_URL, DEFAULT_ASSIGNEE, PROJECT_DESCRIPTION, PROJECT_AVATAR, PROJECT_KEY from JIRA_PROJECT where PROJECT_ID = '%v'", id)
	// fmt.Println(query)
	rows, err := DbOracle.Db.Query(query)
	// a := byte([]`{}`)

	if err == nil {
		var ListProjects []Project
		// fmt.Println(rows.Next())
		for rows.Next() {
			// fmt.Println(err.Error())
			project := Project{}
			rows.Scan(&project.ProjectId, &project.ProjectName, &project.ProjectLead, &project.ProjectUrl, &project.DefaultAssignee, &project.ProjectDescription, &project.ProjectAvatar, &project.ProjectKey)
			// fmt.Println(project)
			ListProjects = append(ListProjects, project)
		}
		return ListProjects, nil
	} else {
		return nil, err
	}
}

func (pm *ProjectsModel) CreateProject(r io.ReadCloser) ([]Project, error) {
	var project Project
	json.NewDecoder(r).Decode(&project)
	// fmt.Println(project)
	query := fmt.Sprintf("INSERT INTO JIRA_PROJECT (PROJECT_NAME, PROJECT_LEAD, PROJECT_URL, DEFAULT_ASSIGNEE, PROJECT_DESCRIPTION, PROJECT_AVATAR, PROJECT_KEY) VALUES('%v', %v, '%v', %v, '%v', '%v', '%v')", project.ProjectName, project.ProjectLead, project.ProjectUrl, project.DefaultAssignee, project.ProjectDescription, project.ProjectAvatar, project.ProjectKey)
	// query := "INSERT INTO JIRA_PROJECT (PROJECT_NAME, PROJECT_LEAD, PROJECT_URL, DEFAULT_ASSIGNEE, PROJECT_DESCRIPTION, PROJECT_AVATAR, PROJECT_KEY) VALUES('project_name92', 41, 'link92', 1, 'description92', 'link92', 'abc') RETURNING PROJECT_ID into v_id"
	_, err := DbOracle.Db.Exec(query)
	// fmt.Println(result)
	// fmt.Println(query)
	// fmt.Println(result)
	if err == nil {

		// var projects []Project
		// rows.Scan(&project.Project_Id, &project.Project_Name, &project.Project_Lead, &project.Project_Url, &project.Default_Assignee, &project.Project_Description, &project.Project_Avatar)
		rowsLastRecord, errLastRecord := DbOracle.Db.Query("SELECT * FROM (SELECT * FROM JIRA_PROJECT ORDER BY PROJECT_ID DESC) WHERE ROWNUM = 1")
		if errLastRecord == nil {
			var ListProjects []Project
			// fmt.Println(rows.Next())
			for rowsLastRecord.Next() {
				// fmt.Println(err.Error())
				project := Project{}
				rowsLastRecord.Scan(&project.ProjectId, &project.ProjectName, &project.ProjectLead, &project.ProjectUrl, &project.DefaultAssignee, &project.ProjectDescription, &project.ProjectAvatar, &project.ProjectKey)
				// fmt.Println(project)
				ListProjects = append(ListProjects, project)
			}
			return ListProjects, nil
		} else {
			return nil, err
		}
		// projects = append(projects, project)

		// return projects, nil
	} else {
		return nil, err
	}
}

func (pm *ProjectsModel) UpdateProject(r io.ReadCloser, id string) (string, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	// fmt.Println(myMap)
	query := UpdateQuery(myMap, id)
	// query := fmt.Sprintf("UPDATE JIRA_PROJECT SET PROJECT_NAME = '%v', PROJECT_LEAD = %v, PROJECT_URL = '%v', DEFAULT_ASSIGNEE = %v, PROJECT_DESCRIPTION = '%v', PROJECT_AVATAR = '%v' WHERE PROJECT_ID = '%v'", project.Project_Name, project.Project_Lead, project.Project_Url, project.Default_Assignee, project.Project_Description, project.Project_Avatar, id)

	row, err := DbOracle.Db.Exec(query)

	if err == nil {

		rowsAffect, _ := row.RowsAffected()
		// fmt.Println(rowsAffectErr)
		if rowsAffect == 0 {
			return "", errors.New("no row affect")
		}
		return "Update successfully", nil
	} else {
		// fmt.Println(row.RowsAffected())
		return "", err
	}

	// return "abc", nil
}

func (pm *ProjectsModel) DeleteProject(id string) ([]Project, error) {
	var project Project
	query := fmt.Sprintf("DELETE FROM JIRA_PROJECT WHERE PROJECT_ID = '%v'", id)

	row, err := DbOracle.Db.Exec(query)

	if err == nil {
		var projects []Project
		projects = append(projects, project)
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		return projects, nil
	} else {
		return nil, err
	}
}

func UpdateQuery(project map[string]interface{}, id string) string {
	// "UPDATE JIRA_PROJECT SET PROJECT_NAME = '%v', PROJECT_LEAD = %v, PROJECT_URL = '%v', DEFAULT_ASSIGNEE = %v, PROJECT_DESCRIPTION = '%v', PROJECT_AVATAR = '%v' WHERE PROJECT_ID = '%v'", project.Project_Name, project.Project_Lead, project.Project_Url, project.Default_Assignee, project.Project_Description, project.Project_Avatar, id)""
	// "project.Project_Name, project.Project_Lead, project.Project_Url, project.Default_Assignee, project.Project_Description, project.Project_Avatar"
	var ProjectNameVal, ProjectLeadVal, ProjectUrlVal, ProjectDefaultAssigneeVal, ProjectDescriptionVal, ProjectAvatarVal, ProjectKeyVal string
	// a := project["Project_Name"]
	// fmt.Println(a)
	if project["ProjectName"] != nil {
		ProjectNameVal = fmt.Sprintf("'%v'", project["ProjectName"])
	} else {
		ProjectNameVal = "PROJECT_NAME"
	}

	if project["ProjectLead"] != nil {
		ProjectLeadVal = fmt.Sprintf("'%v'", project["ProjectLead"])
	} else {
		ProjectLeadVal = "PROJECT_LEAD"
	}

	if project["ProjectUrl"] != nil {
		ProjectUrlVal = fmt.Sprintf("'%v'", project["ProjectUrl"])
	} else {
		ProjectUrlVal = "PROJECT_URL"
	}

	if project["DefaultAssignee"] != nil {
		ProjectDefaultAssigneeVal = fmt.Sprintf("'%v'", project["DefaultAssignee"])
	} else {
		ProjectDefaultAssigneeVal = "DEFAULT_ASSIGNEE"
	}

	if project["ProjectDescription"] != nil {
		ProjectDescriptionVal = fmt.Sprintf("'%v'", project["ProjectDescription"])
	} else {
		ProjectDescriptionVal = "PROJECT_DESCRIPTION"
	}

	if project["ProjectAvatar"] != nil {
		ProjectAvatarVal = fmt.Sprintf("'%v'", project["ProjectAvatar"])
	} else {
		ProjectAvatarVal = "PROJECT_AVATAR"
	}

	if project["ProjectKey"] != nil {
		ProjectKeyVal = fmt.Sprintf("'%v'", project["ProjectKey"])
	} else {
		ProjectKeyVal = "PROJECT_KEY"
	}

	query := fmt.Sprintf("UPDATE JIRA_PROJECT SET PROJECT_NAME = %v, PROJECT_LEAD = %v, PROJECT_URL = %v, DEFAULT_ASSIGNEE = %v, PROJECT_DESCRIPTION = %v, PROJECT_AVATAR = %v, PROJECT_KEY = %v WHERE PROJECT_ID = '%v'", ProjectNameVal, ProjectLeadVal, ProjectUrlVal, ProjectDefaultAssigneeVal, ProjectDescriptionVal, ProjectAvatarVal, ProjectKeyVal, id)

	return query
}
