package handlers

import (
	"encoding/json"
	"fmt"
	"jira/common/helpers"
	. "jira/common/helpers"
	"jira/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var FieldHandlers = FieldHandler{}

type FieldHandler struct{}

func (f *FieldHandler) Index() gin.HandlerFunc {
	return func(c *gin.Context) {

	}
}

func (f *FieldHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {

		var fName, fType string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		fName = fmt.Sprintf("%v", myMap["field_name"])
		fType = fmt.Sprintf("%v", myMap["field_type"])

		if fName == "" || fType == "" {
			c.JSON(http.StatusBadRequest, MessageResponse{Msg: "The parameters are not enough"})
		} else {
			if _, err := models.FieldModels.Insert(models.Field{Name: fName, Type: fType}); err == nil {
				c.JSON(http.StatusOK, MessageResponse{Msg: "The field has been created"})
			} else {
				fmt.Println(err)
				c.JSON(http.StatusInternalServerError, MessageResponse{Msg: "An error just occurred"})
			}
		}
	}
}

func (f *FieldHandler) Update() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var fName, fType string
		var myMap map[string]string
		json.NewDecoder(c.Request.Body).Decode(&myMap)
		fName = fmt.Sprintf("%v", myMap["field_name"])
		fType = fmt.Sprintf("%v", myMap["field_type"])

		if fName == "" && fType == "" {
			c.JSON(http.StatusBadRequest, MessageResponse{Msg: "All data fields are empty"})
		} else {
			if _, err := models.FieldModels.Update(fName, fType, id); err == nil {
				c.JSON(http.StatusOK, MessageResponse{Msg: "The field has been updated"})
			} else {
				fmt.Println(err)
				c.JSON(http.StatusInternalServerError, MessageResponse{Msg: "An error just occurred"})
			}
		}
	}
}
func (f *FieldHandler) Get() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		field, err := models.FieldModels.Get()
		if err != nil {
			c.JSON(http.StatusNotFound, MessageResponse{Msg: "Not found field list"})
		} else {

			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data Success", Data: field})
		}

	}
}

func (f *FieldHandler) GetById() gin.HandlerFunc {
	//Do everything here, call model etc...
	return func(c *gin.Context) {
		id := c.Param("id")
		field, err := models.FieldModels.GetById(id)

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": err.Error(),
			})
		} else {
			//c.JSON(http.StatusOK, field)
			c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Get data by ID Success", Data: field})
			//c.JSON(http.StatusOK, helpers.MessageResponse{Msg: "Sign Up Success", Data: struct{ field []models.Field }{field}})
		}

	}
}
