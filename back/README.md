```
TABLE ARTICLES

+------------+-------------+------+-----+---------+-------+
| Field      | Type        | Null | Key | Default | Extra |
+------------+-------------+------+-----+---------+-------+
| title      | varchar(30) | NO   |     | NULL    |       |
| content    | text        | YES  |     | NULL    |       |
| user       | varchar(30) | YES  |     | NULL    |       |
| uploadDate | datetime    | YES  |     | NULL    |       |
| num        | int(11)     | NO   | PRI | 0       |       |
| hit        | int(11)     | YES  |     | NULL    |       |
+------------+-------------+------+-----+---------+-------+
create or replace table articles (title varchar(30), content text, user varchar(30), uploadDate datetime, num int(11) PRIMARY KEY, hit int(11));

TABLE USERINFO

+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | varchar(20) | NO   | PRI | NULL    |       |
| pw    | varchar(20) | YES  |     | NULL    |       |
| user  | varchar(30) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
create or replace table userinfo (id varchar(20) PRIMARY KEY, pw varchar(20), user varchar(30));
```
