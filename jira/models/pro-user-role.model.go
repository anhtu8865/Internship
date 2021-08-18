package models

import (
	"database/sql"
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
	ProjectKey   int `json:"ProjectKey"`
}
type ProjectUserRoleModel struct {
	ProjectUserRoles []ProjectUserRole
}
//
func (pr *ProjectUserRoleModel) GetAllUser(key_project string) ([]ProjectUserRole, error) {
	var temp_projectuserrole []ProjectUserRole
	query := fmt.Sprintf("SELECT NEW_JIRA_USER.USER_NAME,NEW_JIRA_USER.USER_EMAIL,NEW_JIRA_USER_PROJECT_ROLE.USER_ID,NEW_JIRA_ROLE.ROLE_NAME,NEW_JIRA_USER_PROJECT_ROLE.ROLE_ID FROM NEW_JIRA_ROLE,NEW_JIRA_USER,NEW_JIRA_PROJECT,NEW_JIRA_USER_PROJECT_ROLE WHERE NEW_JIRA_ROLE.ROLE_ID=NEW_JIRA_USER_PROJECT_ROLE.ROLE_ID AND NEW_JIRA_USER_PROJECT_ROLE.PROJECT_KEY = new_jira_project.project_key AND NEW_JIRA_USER_PROJECT_ROLE.USER_ID = new_jira_user.user_id AND NEW_JIRA_USER_PROJECT_ROLE.PROJECT_KEY = '%v'", key_project)
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
//Check exists
func (pr *ProjectUserRoleModel) ExistsProjecUserRole(key_project string,id_user string, id_role string) ([]ProjectUserRole, error){
   var temp_exist []ProjectUserRole
   query :=fmt.Sprintf("SELECT * FROM NEW_JIRA_USER_PROJECT_ROLE WHERE USER_ID = '%v' AND PROJECT_KEY ='%v' AND ROLE_ID ='%v' ",id_user,key_project,id_role) 
   rows,err := DbOracle.Db.Query(query)
   if err == nil {
	   for rows.Next(){
		   projectUserRole := ProjectUserRole{}
		   rows.Scan(
			   &projectUserRole.UserId,
			   &projectUserRole.ProjectKey,
			   &projectUserRole.RoleId,
		   )
		   temp_exist = append(temp_exist, projectUserRole)
	   }
	   return temp_exist,nil
   }else{
	   return nil,err
   }

}
//update role user in project 
func (pr *ProjectUserRoleModel) UpdateRoleForUser(key_project string,id_user string, id_role string, id_role_new string) (sql.Result,error){
	var RoleQuery string
	if id_role_new != ""{
      RoleQuery = fmt.Sprintf("ROLE_ID ='%v'",id_role_new)
	}else{
		RoleQuery = "ROLE_ID=ROLE_ID"
	}
	smt := fmt.Sprintf(`UPDATE "NEW_JIRA_USER_PROJECT_ROLE" SET %v
	WHERE "USER_ID"=:1 AND "PROJECT_KEY"=:2 AND "ROLE_ID"=:3`,RoleQuery)
	return DbOracle.Db.Exec(smt,id_user,key_project,id_role)
}
