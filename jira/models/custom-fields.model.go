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
	query := fmt.Sprintf(
		`INSERT INTO NEW_JIRA_CUSTOM_FIELD (ID,NAME,FIELD_TYPE,DESCRIPTION) 
		VALUES (SEQ_NEW_JIRA_CUSTOM_FIELD.nextval, '%v', '%v', '%v')`,
		customField.Name, customField.Field_Type, customField.Description)
	_, err := DbOracle.Db.Exec(query)
	// fmt.Println(result)
	// fmt.Println(query)
	// fmt.Println(result)
	if err == nil {

		rowsLastRecord, errLastRecord :=
			DbOracle.Db.Query("SELECT * FROM (SELECT * FROM NEW_JIRA_CUSTOM_FIELD ORDER BY ID DESC) WHERE ROWNUM = 1")
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
	} else {
		return nil, err
	}
}

func (pm *CustomFieldsModel) Update(r io.ReadCloser, id string) (string, error) {
	var myMap map[string]interface{}
	json.NewDecoder(r).Decode(&myMap)
	query := UpdateQueryCustomField(myMap, id)

	row, err := DbOracle.Db.Exec(query)

	if err == nil {

		rowsAffect, _ := row.RowsAffected()
		// fmt.Println(rowsAffectErr)
		if rowsAffect == 0 {
			return "", errors.New("no row affect")
		}
		return "Update successfully", nil
	} else {
		return "", err
	}

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

	var Name, Field_Type, Description string
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
	query := fmt.Sprintf("UPDATE NEW_JIRA_CUSTOM_FIELD SET NAME = %v, FIELD_TYPE = %v, DESCRIPTION = %v WHERE ID = %v",
		Name, Field_Type, Description, id)
	//fmt.Println(query)
	return query
}
