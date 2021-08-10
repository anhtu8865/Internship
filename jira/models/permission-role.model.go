package models

import (
	"database/sql"
	"fmt"
	. "jira/common/db"

	_ "github.com/godror/godror"
)

var PermissionRoleModels = PemissionRoleModel{}
type PermissionRole struct{
	PermissionId int `json:"PermissionId"`
	RoleId int `json:"RoleId"`
	PermissionName string `json:"PermissionName"`
	RoleName string `json:"RoleName"`
}

type PemissionRoleModel struct{
	PermissionRoles []Permission
}
///
func (pr *PemissionRoleModel) GetAll(id string)([]PermissionRole,error){
	var temp_permissionrole []PermissionRole
	//sql
	 query :=fmt.Sprintf("SELECT NEW_JIRA_ROLE_PERMISSION.PERMISSION_ID,NEW_JIRA_ROLE_PERMISSION.ROLE_ID,NEW_JIRA_PERMISSION.PERMISSION_NAME,NEW_JIRA_ROLE.ROLE_NAME FROM NEW_JIRA_PERMISSION, NEW_JIRA_ROLE_PERMISSION,NEW_JIRA_ROLE WHERE NEW_JIRA_PERMISSION.PERMISSION_ID=NEW_JIRA_ROLE_PERMISSION.PERMISSION_ID  AND NEW_JIRA_ROLE_PERMISSION.ROLE_ID = NEW_JIRA_ROLE.ROLE_ID AND NEW_JIRA_ROLE_PERMISSION.PERMISSION_ID ='%v'",id)

    rows,err := DbOracle.Db.Query(query)
	if err == nil{
		for rows.Next(){
			permissionrole := PermissionRole{}
			rows.Scan(
				&permissionrole.PermissionId,
				&permissionrole.RoleId,
				&permissionrole.PermissionName,
				&permissionrole.RoleName,
			)
			temp_permissionrole = append(temp_permissionrole, permissionrole)

		}
		return temp_permissionrole,nil
} else{
	return nil,err
}
	
}
func (pr *PemissionRoleModel) UpdatePermissionRole (idrole string,idpermission string)	(sql.Result,error){
    var Query_temp string
	if idrole != ""{
		Query_temp = fmt.Sprintf("ROLE_ID= '%v'",idrole)
	}else{
		Query_temp = "ROLE_ID=ROLE_ID"
	}
	smt := fmt.Sprintf(`UPDATE "NEW_JIRA_ROLE_PERMISSION" SET %v  WHERE "PERMISSION_ID"=:1`, Query_temp)
	return DbOracle.Db.Exec(smt, idpermission)


}