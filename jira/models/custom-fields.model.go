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

var CustomFieldsModels = CustomFieldsModel{}

// var CustomFieldModels = CustomField{}

type CustomField struct {
	Id          int
	Name        string
	Field_Type  string
	Description string
}

type CustomFieldsModel struct {
	CustomFields []CustomField
}

func (pm *CustomFieldsModel) Get() ([]CustomField, error) {
	rows, err := DbOracle.Db.Query("select * from NEW_JIRA_CUSTOM_FIELD")
	if err == nil {
		var ListCustomFields []CustomField
		for rows.Next() {
			customField := CustomField{}
			rows.Scan(&customField.Id, &customField.Name, &customField.Field_Type, &customField.Description)
			ListCustomFields = append(ListCustomFields, customField)
		}
		return ListCustomFields, nil
	} else {
		return nil, err
	}
}

func (pm *CustomFieldsModel) GetById(id string) ([]CustomField, error) {
	query := fmt.Sprintf("select * from NEW_JIRA_CUSTOM_FIELD where ID = '%v'", id)
	// fmt.Println(query)
	rows, err := DbOracle.Db.Query(query)
	// a := byte([]`{}`)

	if err == nil {
		var ListCustomFields []CustomField
		// fmt.Println(rows.Next())
		for rows.Next() {
			// fmt.Println(err.Error())
			customField := CustomField{}
			rows.Scan(&customField.Id, &customField.Name, &customField.Field_Type, &customField.Description)
			// fmt.Println(customField)
			ListCustomFields = append(ListCustomFields, customField)
		}
		return ListCustomFields, nil
	} else {
		return nil, err
	}
}

func (pm *CustomFieldsModel) Create(r io.ReadCloser) ([]CustomField, error) {
	var customField CustomField
	json.NewDecoder(r).Decode(&customField)
	// fmt.Println(customField)
	query := fmt.Sprintf("INSERT INTO NEW_JIRA_CUSTOM_FIELD (ID,NAME,FIELD_TYPE,DESCRIPTION) VALUES (SEQ_NEW_JIRA_CUSTOM_FIELD.nextval, '%v', '%v', '%v')", customField.Name, customField.Field_Type, customField.Description)
	// query := "INSERT INTO NEW_JIRA_CUSTOM_FIELD (CUSTOM_FIELD_NAME, CUSTOM_FIELD_LEAD, CUSTOM_FIELD_URL, DEFAULT_ASSIGNEE, CUSTOM_FIELD_DESCRIPTION, CUSTOM_FIELD_AVATAR, CUSTOM_FIELD_KEY) VALUES('customField_name92', 41, 'link92', 1, 'description92', 'link92', 'abc') RETURNING CUSTOM_FIELD_ID into v_id"
	_, err := DbOracle.Db.Exec(query)
	// fmt.Println(result)
	// fmt.Println(query)
	// fmt.Println(result)
	if err == nil {
		// var customFields []CustomField
		// rows.Scan(&customField.CustomField_Id, &customField.CustomField_Name, &customField.CustomField_Lead, &customField.CustomField_Url, &customField.Default_Assignee, &customField.CustomField_Description, &customField.CustomField_Avatar)
		rowsLastRecord, errLastRecord := DbOracle.Db.Query("SELECT * FROM (SELECT * FROM NEW_JIRA_CUSTOM_FIELD ORDER BY ID DESC) WHERE ROWNUM = 1")
		if errLastRecord == nil {
			var ListCustomFields []CustomField
			// fmt.Println(rows.Next())
			for rowsLastRecord.Next() {
				// fmt.Println(err.Error())
				customField := CustomField{}
				rowsLastRecord.Scan(&customField.Id, &customField.Name, &customField.Field_Type, &customField.Description)
				// fmt.Println(customField)
				ListCustomFields = append(ListCustomFields, customField)
			}
			return ListCustomFields, nil
		} else {
			return nil, err
		}
		// customFields = append(customFields, customField)

		// return customFields, nil
	} else {
		return nil, err
	}
}

func (pm *CustomFieldsModel) Update(r io.ReadCloser, id string) (string, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	//fmt.Println(myMap)
	query := UpdateQueryCustomField(myMap, id)
	// query := fmt.Sprintf("UPDATE NEW_JIRA_CUSTOM_FIELD SET CUSTOM_FIELD_NAME = '%v', CUSTOM_FIELD_LEAD = %v, CUSTOM_FIELD_URL = '%v', DEFAULT_ASSIGNEE = %v, CUSTOM_FIELD_DESCRIPTION = '%v', CUSTOM_FIELD_AVATAR = '%v' WHERE CUSTOM_FIELD_ID = '%v'", customField.CustomField_Name, customField.CustomField_Lead, customField.CustomField_Url, customField.Default_Assignee, customField.CustomField_Description, customField.CustomField_Avatar, id)

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

func (pm *CustomFieldsModel) Delete(id string) ([]CustomField, error) {
	var customField CustomField
	query := fmt.Sprintf("DELETE FROM NEW_JIRA_CUSTOM_FIELD WHERE ID = %v", id)
	row, err := DbOracle.Db.Exec(query)
	if err == nil {
		var customFields []CustomField
		customFields = append(customFields, customField)
		rowsAffect, _ := row.RowsAffected()
		if rowsAffect == 0 {
			return nil, errors.New("no row affect")
		}
		return customFields, nil
	} else {
		return nil, err
	}
}

func UpdateQueryCustomField(customField map[string]interface{}, id string) string {
	// "UPDATE NEW_JIRA_CUSTOM_FIELD SET CUSTOM_FIELD_NAME = '%v', CUSTOM_FIELD_LEAD = %v, CUSTOM_FIELD_URL = '%v', DEFAULT_ASSIGNEE = %v, CUSTOM_FIELD_DESCRIPTION = '%v', CUSTOM_FIELD_AVATAR = '%v' WHERE CUSTOM_FIELD_ID = '%v'", customField.CustomField_Name, customField.CustomField_Lead, customField.CustomField_Url, customField.Default_Assignee, customField.CustomField_Description, customField.CustomField_Avatar, id)""
	// "customField.CustomField_Name, customField.CustomField_Lead, customField.CustomField_Url, customField.Default_Assignee, customField.CustomField_Description, customField.CustomField_Avatar"
	var Name, Field_Type, Description string
	// a := customField["CustomField_Name"]
	// fmt.Println(a)
	if customField["Name"] != nil {
		Name = fmt.Sprintf("'%v'", customField["Name"])
	} else {
		Name = ""
	}
	if customField["Field_Type"] != nil {
		Field_Type = fmt.Sprintf("'%v'", customField["Field_Type"])
	} else {
		Field_Type = ""
	}
	if customField["Description"] != nil {
		Description = fmt.Sprintf("'%v'", customField["Description"])
	} else {
		Description = ""
	}
	query := fmt.Sprintf("UPDATE NEW_JIRA_CUSTOM_FIELD SET NAME = %v, FIELD_TYPE = %v, DESCRIPTION = %v WHERE ID = %v", Name, Field_Type, Description, id)
	//fmt.Println(query)
	return query
}
