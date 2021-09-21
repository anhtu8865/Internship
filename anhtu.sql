CREATE TABLE NEW_JIRA_CUSTOM_FIELD (
    ID int NOT NULL PRIMARY KEY,
    NAME varchar(255) NOT NULL,
    FIELD_TYPE varchar(255) NOT NULL,
    DESCRIPTION varchar(1000)
);
CREATE SEQUENCE SEQ_NEW_JIRA_CUSTOM_FIELD
MINVALUE 1
START WITH 1
INCREMENT BY 1
CACHE 10;
ALTER TABLE NEW_JIRA_CUSTOM_FIELD
ADD CONSTRAINT UC_NEW_JIRA_CUSTOM_FIELD UNIQUE (NAME);
INSERT INTO NEW_JIRA_CUSTOM_FIELD (ID,NAME,FIELD_TYPE,DESCRIPTION)
VALUES (SEQ_NEW_JIRA_CUSTOM_FIELD.nextval,'Creator','Text','');
INSERT INTO NEW_JIRA_CUSTOM_FIELD (ID,NAME,FIELD_TYPE)
VALUES (SEQ_NEW_JIRA_CUSTOM_FIELD.nextval,'Assignee','Text');
SELECT * FROM NEW_JIRA_CUSTOM_FIELD;



CREATE TABLE NEW_JIRA_SCREEN (
    ID int NOT NULL PRIMARY KEY,
    NAME varchar(255) NOT NULL,
    DESCRIPTION varchar(1000)
);
CREATE SEQUENCE SEQ_NEW_JIRA_SCREEN
MINVALUE 1
START WITH 1
INCREMENT BY 1
CACHE 10;
ALTER TABLE NEW_JIRA_SCREEN
ADD CONSTRAINT UC_NEW_JIRA_SCREEN UNIQUE (NAME);
INSERT INTO NEW_JIRA_SCREEN (ID,NAME)
VALUES (SEQ_NEW_JIRA_SCREEN.nextval,'One');
INSERT INTO NEW_JIRA_SCREEN (ID,NAME)
VALUES (SEQ_NEW_JIRA_SCREEN.nextval,'Two');



CREATE TABLE NEW_JIRA_SCREEN_CUSTOM_FIELD (
    SCREEN int NOT NULL,
    CUSTOM_FIELD int NOT NULL,
    CONSTRAINT PK_NEW_JIRA_SCREEN_CUSTOM_FIELD PRIMARY KEY (SCREEN,CUSTOM_FIELD),
    CONSTRAINT FK_SCREEN FOREIGN KEY (SCREEN)
    REFERENCES NEW_JIRA_SCREEN(ID),
    CONSTRAINT FK_CUSTOM_FIELD FOREIGN KEY (CUSTOM_FIELD)
    REFERENCES NEW_JIRA_CUSTOM_FIELD(ID)
);
ALTER TABLE NEW_JIRA_SCREEN_CUSTOM_FIELD
ADD ID int NOT NULL;
ALTER TABLE NEW_JIRA_SCREEN_CUSTOM_FIELD
ADD CONSTRAINT UC_NEW_JIRA_SCREEN_CUSTOM_FIELD UNIQUE (ID);
ALTER TABLE NEW_JIRA_SCREEN_CUSTOM_FIELD
DROP COLUMN ID;
CREATE SEQUENCE SEQ_NEW_JIRA_SCREEN_CUSTOM_FIELD
MINVALUE 1
START WITH 1
INCREMENT BY 1
CACHE 10;
INSERT INTO NEW_JIRA_SCREEN_CUSTOM_FIELD (SCREEN,CUSTOM_FIELD,ID)
VALUES (1,1,SEQ_NEW_JIRA_SCREEN_CUSTOM_FIELD.nextval);
DELETE FROM NEW_JIRA_SCREEN_CUSTOM_FIELD;
select * from NEW_JIRA_SCREEN_CUSTOM_FIELD;



CREATE TABLE NEW_JIRA_ISSUE_TYPE (
    ID int NOT NULL PRIMARY KEY,
    NAME varchar(255) NOT NULL,
    ICON varchar(255) NOT NULL,
    DESCRIPTION varchar(1000)
);
CREATE SEQUENCE SEQ_NEW_JIRA_ISSUE_TYPE
MINVALUE 1
START WITH 1
INCREMENT BY 1
CACHE 10;
ALTER TABLE NEW_JIRA_ISSUE_TYPE
ADD CONSTRAINT UC_NEW_JIRA_ISSUE_TYPE UNIQUE (NAME);
INSERT INTO NEW_JIRA_ISSUE_TYPE (ID,NAME,ICON)
VALUES (SEQ_NEW_JIRA_ISSUE_TYPE.nextval,'Story','Story');
INSERT INTO NEW_JIRA_ISSUE_TYPE (ID,NAME,ICON)
VALUES (SEQ_NEW_JIRA_ISSUE_TYPE.nextval,'Task','Task');









CREATE TABLE NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN (
    PROJECT varchar(255) NOT NULL,
    ISSUE_TYPE int NOT NULL,
    SCREEN int NOT NULL,
    CONSTRAINT PK_NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN PRIMARY KEY (PROJECT,ISSUE_TYPE),
    CONSTRAINT FK_NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN_PROJECT FOREIGN KEY (PROJECT)
    REFERENCES NEW_JIRA_PROJECT(PROJECT_KEY),
    CONSTRAINT FK_NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN_ISSUE_TYPE FOREIGN KEY (ISSUE_TYPE)
    REFERENCES NEW_JIRA_ISSUE_TYPE(ID),
    CONSTRAINT FK_NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN_SCREEN FOREIGN KEY (SCREEN)
    REFERENCES NEW_JIRA_SCREEN(ID)
);
INSERT INTO "NEW_JIRA_PROJECT"("PROJECT_KEY", "PROJECT_NAME", "PROJECT_DESCRIPTION","PROJECT_LEAD","ID_WORKFLOW") VALUES ('Tu', 'Tu', 'dont remove', 42, 1);
INSERT INTO "NEW_JIRA_PROJECT"("PROJECT_KEY", "PROJECT_NAME", "PROJECT_DESCRIPTION","PROJECT_LEAD","ID_WORKFLOW") VALUES ('Tu2', 'Tu2', 'dont remove', 42, 1);
INSERT INTO "NEW_JIRA_PROJECT"("PROJECT_KEY", "PROJECT_NAME", "PROJECT_DESCRIPTION","PROJECT_LEAD","ID_WORKFLOW") VALUES ('Tu3', 'Tu3', 'dont remove', 42, 1);
SELECT * FROM NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN;
SELECT PROJECT AS PROJECT_ID FROM NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN;

SELECT * FROM NEW_JIRA_ISSUE_TYPE;
SELECT PROJECT, ISSUE_TYPE, SCREEN, ID, PROJECT_NAME, NEW_JIRA_ISSUE_TYPE.NAME AS ISSUE_TYPE_NAME
FROM (SELECT PROJECT, ISSUE_TYPE, SCREEN, ID, PROJECT_NAME
FROM NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN 
INNER JOIN NEW_JIRA_PROJECT ON NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN.PROJECT = NEW_JIRA_PROJECT.PROJECT_KEY;
INNER JOIN NEW_JIRA_ISSUE_TYPE ON TEMP.ISSUE_TYPE = NEW_JIRA_ISSUE_TYPE.ID;


SELECT A.ID, A.PROJECT, A.ISSUE_TYPE, 
A.SCREEN, B.PROJECT_NAME, 
C.NAME AS ISSUE_TYPE_NAME, C.ICON AS ISSUE_TYPE_ICON
FROM NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN A
JOIN NEW_JIRA_PROJECT B
  ON A.PROJECT = B.PROJECT_KEY
JOIN NEW_JIRA_ISSUE_TYPE C
  ON A.ISSUE_TYPE = C.ID;

select * from NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN

SELECT *
FROM NEW_JIRA_CUSTOM_FIELD
WHERE ID IN (SELECT CUSTOM_FIELD FROM NEW_JIRA_SCREEN_CUSTOM_FIELD WHERE SCREEN = 174);



create view hell as select * from new_jira_custom_field;
DROP VIEW hell;
select * from hell;



ALTER TABLE NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN
ADD ID int NOT NULL UNIQUE;
CREATE SEQUENCE SEQ_NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN
MINVALUE 1
START WITH 1
INCREMENT BY 1
CACHE 10;
INSERT INTO NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN (PROJECT,ISSUE_TYPE,SCREEN,ID)
VALUES ('Tu',1,174,SEQ_NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN.nextval);
INSERT INTO NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN (PROJECT,ISSUE_TYPE,SCREEN,ID)
VALUES ('Tu',2,182,SEQ_NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN.nextval);
INSERT INTO NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN (PROJECT,ISSUE_TYPE,SCREEN,ID)
VALUES ('Tu2',2,182,SEQ_NEW_JIRA_PROJECT_ISSUE_TYPE_SCREEN.nextval);




CREATE TABLE NEW_JIRA_ISSUE (
    KEY varchar(255) NOT NULL PRIMARY KEY,
    NAME varchar(255) NOT NULL,
    PROJECT varchar(255) NOT NULL,
    ISSUE_TYPE int NOT NULL,
    CONSTRAINT FK_NEW_JIRA_ISSUE_ISSUE_TYPE FOREIGN KEY (ISSUE_TYPE)
    REFERENCES NEW_JIRA_ISSUE_TYPE(ID)
);
ALTER TABLE NEW_JIRA_ISSUE
ADD CONSTRAINT FK_NEW_JIRA_ISSUE_PROJECT
FOREIGN KEY (PROJECT) REFERENCES NEW_JIRA_PROJECT(PROJECT_KEY);
ALTER TABLE NEW_JIRA_ISSUE
ADD CONSTRAINT UC_NEW_JIRA_ISSUE UNIQUE (NAME);
ALTER TABLE NEW_JIRA_ISSUE
DROP CONSTRAINT UC_NEW_JIRA_ISSUE;
ALTER TABLE NEW_JIRA_ISSUE
ADD ID int NOT NULL UNIQUE;
ALTER TABLE NEW_JIRA_ISSUE
ADD ICON varchar(255) NOT NULL;
CREATE SEQUENCE SEQ_NEW_JIRA_ISSUE
MINVALUE 1
START WITH 1
INCREMENT BY 1
CACHE 10;
ALTER TABLE NEW_JIRA_ISSUE
ADD DESCRIPTION CLOB;

INSERT INTO NEW_JIRA_ISSUE (KEY,NAME,PROJECT,ISSUE_TYPE,ID,ICON,DESCRIPTION)
		VALUES ('is81', 'test', 'JP', '93', SEQ_NEW_JIRA_ISSUE.nextval, 'Bug','<p>This is some text in a paragraph.</p>')

select * from new_jira_issue where key='is81'

select C.permission_id from new_jira_user_project_role A, new_jira_role_permission B, new_jira_permission C where A.user_id = '1' and A.project_key = '61' and A.role_id = B.role_id and B.permission_id = C.permission_id"



select A.KEY, A.NAME, A.PROJECT, B.PROJECT_NAME, C.NAME AS ISSUE_TYPE_NAME, A.ID, A.ICON from NEW_JIRA_ISSUE A
JOIN NEW_JIRA_PROJECT B
  ON A.PROJECT = B.PROJECT_KEY
JOIN NEW_JIRA_ISSUE_TYPE C
  ON A.ISSUE_TYPE = C.ID;
  

select custom_field, name, field_type, description from new_jira_screen_custom_field A, new_jira_custom_field B where A.custom_field = B.id and A.screen = 231;

select * from new_jira_custom_field B

delete from new_jira_issue
select * from new_jira_field

delete from new_jira_field where issue = 'is1'
delete from new_jira_field where issue = 'is1'

select * from NEW_JIRA_FIELD where ISSUE = 'is1'
select project_name from new_jira_project where project_key = 'JP2'
select name from new_jira_issue_type where ID = '61'
select * from new_jira_issue
UPDATE new_jira_issue
SET key = value1, name = value2
WHERE id = ;


select * from new_jira_project


CREATE TABLE NEW_JIRA_ISSUE_PARENT (
    ISSUE varchar(255) NOT NULL PRIMARY KEY,
    PARENT varchar(255) NOT NULL,
    CONSTRAINT FK_NEW_JIRA_ISSUE_PARENT_ISSUE FOREIGN KEY (ISSUE)
    REFERENCES NEW_JIRA_ISSUE(KEY),
    CONSTRAINT FK_NEW_JIRA_ISSUE_PARENT_PARENT FOREIGN KEY (PARENT)
    REFERENCES NEW_JIRA_ISSUE(KEY)
);




CREATE TABLE NEW_JIRA_FIELD (
    ISSUE varchar(255) NOT NULL,
    NAME varchar(255) NOT NULL,
    DESCRIPTION varchar(1000),
    TYPE varchar(255) NOT NULL,
    VALUE varchar(1000),
    CONSTRAINT PK_NEW_JIRA_FIELD PRIMARY KEY (ISSUE,NAME),
    CONSTRAINT FK_NEW_JIRA_FIELD_ISSUE FOREIGN KEY (ISSUE)
    REFERENCES NEW_JIRA_ISSUE(KEY)
);

select * from new_jira_issue A where A.project = 'JP2'
select A.* from new_jira_issue A, new_jira_user_project_role B where B.user_id = 363 and B.project_key = A.project
select * from new_jira_user
select * from new_jira_project
select A.user_id, B.user_full_name from new_jira_user_project_role A, new_jira_user B where A.project_key = 'JP2' and B.user_id = A.user_id
select * from new_jira_role_permission
select * from new_jira_permission

select C.permission_id from new_jira_user_project_role A, new_jira_role_permission B, new_jira_permission C where A.user_id = 363 and A.project_key = 'JP2' and A.role_id = B.role_id and B.permission_id = C.permission_id

ALTER TABLE new_jira_permission
ALTER COLUMN column_name datatype;

select C.permission_id from new_jira_user_project_role A, new_jira_role_permission B, new_jira_permission C where A.user_id = '363' and A.project_key = 'JP' and A.role_id = B.role_id and B.permission_id = C.permission_id



select * from new_jira_workflowproject A, new_jira_transition B where A.project_key = 'JP2' and B.id_workflow = A.id_workflow
select * from new_jira_transition

select A.id_workflow, B.id_transition, B.name_transition, B.id_status1, B.name_status1, B.id_status2, B.name_status2 
from new_jira_workflowproject A, new_jira_transition B where A.project_key = 'JP2' and B.id_workflow = A.id_workflow and B.name_status1 = 'TO DO'


select * from new_jira_user
delete from new_jira_project
select * from new_jira_workflow
select * from new_jira_workflowproject
delete from new_jira_workflowproject
delete from new_jira_transition
select * from new_jira_transition


