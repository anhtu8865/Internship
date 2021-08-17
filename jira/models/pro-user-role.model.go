package models

import (
	"fmt"
	. "jira/common/db"
	_ "github.com/godror/godror"
)

var ProjectUserRoleModels = ProjectUserRoleModel{}

type ProjectUserRole struct {
	UserName    string `json:"UserName"`
	UserId      int `json:"UserId"`
	UserMail    string `json:"UserMail"`
	RoleName    string `json:"RoleName"`
	RoleId      int   `json:"RoleId"`
	ProjectName string `json:"ProjectName"`
	ProjectId   int `json:"ProjectId"`
}
type ProjectUserRoleModel struct {
	ProjectUserRoles []ProjectUserRole
}

func (pr *ProjectUserRoleModel) GetAllUser(id_project string) ([]ProjectUserRole, error) {
	var temp_projectuserrole []ProjectUserRole
	query := fmt.Sprintf("SELECT NEW_JIRA_USER.USER_NAME,NEW_JIRA_USER.USER_EMAIL,NEW_JIRA_USER_PROJECT_ROLE.USER_ID,NEW_JIRA_ROLE.ROLE_NAME,NEW_JIRA_USER_PROJECT_ROLE.ROLE_ID FROM NEW_JIRA_ROLE,NEW_JIRA_USER,NEW_JIRA_PROJECT,NEW_JIRA_USER_PROJECT_ROLE WHERE NEW_JIRA_ROLE.ROLE_ID=NEW_JIRA_USER_PROJECT_ROLE.ROLE_ID AND NEW_JIRA_USER_PROJECT_ROLE.PROJECT_KEY = new_jira_project.project_key AND NEW_JIRA_USER_PROJECT_ROLE.USER_ID = new_jira_user.user_id AND NEW_JIRA_USER_PROJECT_ROLE.PROJECT_KEY = '%v'", id_project)
	rows, err := DbOracle.Db.Query(query)
	if err == nil {
		for rows.Next() {
			projectuserrole := ProjectUserRole{}
			rows.Scan(&projectuserrole.UserName,&projectuserrole.UserMail,&projectuserrole.UserId,&projectuserrole.RoleName,&projectuserrole.RoleId)
			temp_projectuserrole = append(temp_projectuserrole, projectuserrole)
			fmt.Println(temp_projectuserrole)
		}
		
		return temp_projectuserrole, nil
	} else {
		return nil, err
	}
}
