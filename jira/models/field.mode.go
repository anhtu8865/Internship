package models

import (
	"database/sql"
	"fmt"
	. "jira/common/db"
)

var FieldModels = FieldModel{}

type Field struct {
	Id   int    `json:"Field_Id"`
	Name string `json:"Field_Name"`
	Type string `json:"Field_Type"`
}

type FieldModel struct{}

func (fm *FieldModel) Get() ([]Field, error) {
	rows, err := DbOracle.Db.Query("Select * From JIRA_FIELD")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	fields := []Field{}
	for rows.Next() {
		f := Field{}
		rows.Scan(&f.Id, &f.Name, &f.Type)
		fields = append(fields, f)
	}
	return fields, nil
}

func (pm *FieldModel) GetById(id string) ([]Field, error) {
	query := fmt.Sprintf("select \"FIELD_ID\", \"FIELD_NAME\", \"FIELD_TYPE\" from \"JIRA_FIELD\" where \"FIELD_ID\" = '%v'", id)
	
	rows, err := DbOracle.Db.Query(query)

	if err == nil {
		var ListField []Field
		
		for rows.Next() {
			
			field := Field{}
			rows.Scan(&field.Id, &field.Name, &field.Type)
			
			ListField = append(ListField, field)
		}
		return ListField, nil
	} else {
		return nil, err
	}
}

func (fm *FieldModel) Insert(f Field) (sql.Result, error) {
	stm := `INSERT INTO "JIRA_FIELD"("FIELD_NAME", "FIELD_TYPE") VALUES(:1, :2)`
	return DbOracle.Db.Exec(stm, f.Name, f.Type)
}

func (sm *FieldModel) Update(fName string, fType string, id string) (sql.Result, error) {
	query := fmt.Sprintf(`UPDATE "JIRA_FIELD" SET "FIELD_NAME"='%v', "FIELD_TYPE"='%v' WHERE "FIELD_ID"='%v'`, fName, fType, id)
	return DbOracle.Db.Exec(query)
}
