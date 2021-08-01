package models

import (
	"database/sql"
	"errors"
	"fmt"
	. "jira/common/db"
	"reflect"
)

var ScreenModels = ScreenModel{}

type Screen struct {
	Id          int    `json:"Screen_Id"`
	Name        string `json:"Screen_Name"`
	Description string `json:"Screen_Description"`
	ScrPro      []Project
}

type ScreenModel struct {
	Screens []Screen
}

func (sm *ScreenModel) Get() ([]Screen, error) {
	stm := `select Jira_Screen.Screen_Id, Jira_Screen.Screen_Name, Jira_Project.Project_Id, Jira_Project.Project_Name
	from Jira_Screen left outer join Jira_Project_Screen on Jira_Screen.Screen_Id = Jira_Project_Screen.Screen_Id
	left outer join Jira_Project on Jira_Project_Screen.Project_Id = Jira_Project.Project_Id`
	rows, err := DbOracle.Db.Query(stm)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	screens := []Screen{}
	for rows.Next() {
		scr, pro := Screen{}, Project{ProjectId: -1}
		rows.Scan(&scr.Id, &scr.Name, &pro.ProjectId, &pro.ProjectName)
		existed := false
		for i, el := range screens {
			if el.Id == scr.Id {
				screens[i].ScrPro = append(screens[i].ScrPro, pro)
				existed = true
			}
		}
		if !existed && pro.ProjectId != -1 {
			scr.ScrPro = append(scr.ScrPro, pro)
		}
		if !existed {
			screens = append(screens, scr)
		}
	}
	return screens, nil
}

func (sm *ScreenModel) Insert(scr Screen) (sql.Result, error) {
	stm := `Insert Into Jira_Screen(Screen_Name, Screen_Description) Values(:1, :2)`
	return DbOracle.Db.Exec(stm, scr.Name, scr.Description)
}

func (sm *ScreenModel) Update(scr Screen) (sql.Result, error) {
	stm := `Update Jira_Screen Set %v Where Screen_Id=:1`
	setStm := ""
	for key, val := range ParseStructToMap(scr) {
		if key != "" && val != "" && key != "Screen_Id" {
			if reflect.TypeOf(val) == reflect.TypeOf("") {
				setStm = fmt.Sprintf(setStm+" "+key+" = '%v'", val)
			} else {
				setStm = fmt.Sprintf(setStm+" "+key+" = '%v'", val)
			}
		}
	}
	if setStm != "" {
		stm = fmt.Sprintf(stm, setStm)
		return DbOracle.Db.Exec(stm, scr.Id)
	}
	return nil, errors.New("No field to update")
	// smt := `Update Jira_Screen Set Screen_Name=:1, Screen_Description=:2 Where Screen_Id=:3`
	// return DbOracle.Db.Exec(smt, scr.Name, scr.Description, scr.Id)
}

func (sm *ScreenModel) GetById(Id int) ([]Screen, error) {
	stm := `select Jira_Screen.Screen_Id, Jira_Screen.Screen_Name, Jira_Project.Project_Id, Jira_Project.Project_Name
	from Jira_Screen left outer join Jira_Project_Screen on Jira_Screen.Screen_Id = Jira_Project_Screen.Screen_Id
	left outer join Jira_Project on Jira_Project_Screen.Project_Id = Jira_Project.Project_Id
	where Jira_Screen.Screen_Id = :1`
	rows, err := DbOracle.Db.Query(stm, Id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	screens := []Screen{}
	for rows.Next() {
		scr, pro := Screen{}, Project{ProjectId: -1}
		rows.Scan(&scr.Id, &scr.Name, &pro.ProjectId, &pro.ProjectName)
		existed := false
		for i, el := range screens {
			if el.Id == scr.Id {
				screens[i].ScrPro = append(screens[i].ScrPro, pro)
				existed = true
			}
		}
		if !existed && pro.ProjectId != -1 {
			scr.ScrPro = append(scr.ScrPro, pro)
		}
		if !existed {
			screens = append(screens, scr)
		}
	}
	return screens, nil
}

func (sm *ScreenModel) Delete(id int) (sql.Result, error) {
	smt := `Delete From Jira_Screen Where Jira_Screen.Screen_Id = :1`
	return DbOracle.Db.Exec(smt, id)
}

func ParseStructToMap(scr Screen) map[string]interface{} {
	e := reflect.ValueOf(&scr).Elem()
	results := make(map[string]interface{})
	for i := 0; i < e.NumField(); i++ {
		results[e.Type().Field(i).Tag.Get("json")] = e.Field(i).Interface()
	}
	return results
}
