package models

import (
	. "jira/common/db"
	//_ "github.com/alexbrainman/odbc"
	_ "github.com/godror/godror"
)

var PermissionModels = PermissionModel{}

type Permission struct {
	PermissionId int `json:"Permission_Id"`
	PermissionName string `json:"Permission_Name"`
	PermissionType string `json:"Permission_Type"`
	PermissionDescription string `json:"Permission_Description"`
}

type PermissionModel struct{
	Permissions []Permission
}

func (pr *PermissionModel) GetAllPermission() ([]Permission,error){
	var temp_permission []Permission
	//sql
	smt := `SELECT * FROM NEW_JIRA_PERMISSION`
	rows, err := DbOracle.Db.Query(smt)
	if err == nil{
            for rows.Next(){
				permission := Permission{}
				rows.Scan(
					&permission.PermissionId,
					&permission.PermissionName,
					&permission.PermissionType,
					&permission.PermissionDescription,
				)
				temp_permission = append(temp_permission, permission)

			}
			return temp_permission,nil
	} else{
		return nil,err
	}
}

