package handlers

import (
	"encoding/json"
	"fmt"
	. "jira/common/helpers"
	. "jira/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

var ScreenHandlers = ScreenHandler{}

type ScreenHandler struct {
}

func (s *ScreenHandler) Index() gin.HandlerFunc {
	return func(c *gin.Context) {
		screenId := c.Param("id")
		var screens []Screen
		var err error = nil
		if screenId != "" {
			scrId, _ := strconv.Atoi(screenId)
			screens, err = ScreenModels.GetById(scrId)
		} else {
			screens, err = ScreenModels.Get()
		}

		if err == nil {
			c.JSON(http.StatusOK, MessageResponse{Data: screens})
		} else {
			fmt.Println(err)
			c.JSON(http.StatusInternalServerError, MessageResponse{Msg: "An error just occurred"})
		}
	}
}

func (s *ScreenHandler) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		var postParams map[string]string
		json.NewDecoder(c.Request.Body).Decode(&postParams)
		scrName, scrDes := postParams["screen_name"], postParams["screen_des"]
		if scrName == "" || scrDes == "" {
			c.JSON(http.StatusBadRequest, MessageResponse{Msg: "The parameters are not enough"})
		} else {
			scr := Screen{Name: scrName, Description: scrDes}
			sm := ScreenModel{}
			if _, err := sm.Insert(scr); err != nil {
				c.JSON(http.StatusInternalServerError, MessageResponse{Msg: "An error just occurred"})
			} else {
				c.JSON(http.StatusCreated, MessageResponse{Msg: "The screen has been created"})
			}
		}
	}
}

func (s *ScreenHandler) Upadate() gin.HandlerFunc {
	return func(c *gin.Context) {
		var postParams map[string]string
		json.NewDecoder(c.Request.Body).Decode(&postParams)
		sId, sName, sDes := c.Param("id"), postParams["screen_name"], postParams["screen_des"]
		if sId == "" {
			c.JSON(http.StatusBadRequest, MessageResponse{Msg: "Require id of screen"})
		} else {
			if sName == "" && sDes == "" {
				c.JSON(http.StatusBadRequest, MessageResponse{Msg: "All data fields are empty"})
			} else {
				id, _ := strconv.Atoi(sId)
				if _, err := ScreenModels.Update(Screen{Id: id, Name: sName, Description: sDes}); err == nil {
					c.JSON(http.StatusOK, MessageResponse{Msg: "The sreen has been updated"})
				} else {
					c.JSON(http.StatusInternalServerError, MessageResponse{Msg: "An error just occurred"})
				}
			}
		}
	}
}

func (s *ScreenHandler) Delete() gin.HandlerFunc {
	return func(c *gin.Context) {
		if id, err := strconv.Atoi(c.Param("id")); err == nil {
			scrs, err := ScreenModels.GetById(id)
			if err == nil {
				//if len(scrs) > 0 && scrs[0].ScrPro[0].ProjectId > 0
				//fmt.Println(scrs)
				if len(scrs) > 0 && len(scrs[0].ScrPro) > 0 {
					c.JSON(http.StatusConflict, MessageResponse{Msg: "The creen has a lot of project", Data: scrs})
				} else {
					result, err := ScreenModels.Delete(id)
					if err != nil {
						c.JSON(http.StatusInternalServerError, MessageResponse{Msg: "An error just occurred"})
					} else {
						c.JSON(http.StatusOK, MessageResponse{Msg: "The screen has deleted"})
					}
					fmt.Println(result)
				}
			}
		} else {
			c.JSON(http.StatusBadRequest, MessageResponse{Msg: "Require the id param"})
		}
	}
}
