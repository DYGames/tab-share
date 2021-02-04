const express = require("express");
const app = express();
const mysql = require("mysql");
const session = require("express-session");
const path = require("path");

//let staticPath = path.join(__dirname, "/public");
//app.use(express.static(staticPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "keyboard cat"
}));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "prac"
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header("Origin"));
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.get("/", function (req, res) {
    connection.query("SELECT * FROM ARTICLES ORDER BY NUM DESC", (err, results, fields) => {
        if (err) res.json({ error: err });
        else res.json({ data: results });
    });
});

app.get("/public/:filename", function (req, res) {
    const file = `${__dirname}/public/${req.params.filename}`;
    res.download(file);
});

app.get("/UserInfo", function (req, res) {
    if (req.session.isLogin) {
        connection.query(`SELECT * FROM USERINFO WHERE USER = "${req.session.user}"`, (err, results, fields) => {
            if (err) res.json({ data: [ { user: "" } ] });
            else res.json({ data: results });
        });
    } else {
        res.json({ data: [ { user: "" } ] });
    }
});

app.get("/Article/:num", function (req, res) {
    connection.query(`UPDATE ARTICLES SET HIT = HIT + 1 WHERE NUM = ${req.params.num}`);
    connection.query(`SELECT * FROM ARTICLES WHERE NUM = ${req.params.num}`, (err, results, fields) => {
        if (err) res.json({ error: err });
        else res.json({ data: results });
    });
});

app.post("/Article", function (req, res) {
    connection.query(`INSERT INTO ARTICLES SELECT "${req.body.title}", "${req.body.content}", "${req.body.user}", now(), MAX(NUM) + 1, 0 FROM ARTICLES`, (err, results, fields) => {
        if (err) res.json({ error: err });
        else res.json({ data: results });
    });
});

app.delete("/Article/:num", function (req, res) {
    connection.query(`DELETE FROM ARTICLES WHERE NUM = ${req.params.num}`, (err, results, fields) => {
        if (err) res.json({ error: err });
        else res.json({ data: results });
    });
});

app.put("/Article/:num", function (req, res) {
    connection.query(`UPDATE ARTICLES SET TITLE = "${req.body.title}", CONTENT = "${req.body.content}", USER = "${req.body.user}" WHERE NUM = ${req.params.num}`, (err, results, fields) => {
        if (err) res.json({ error: err });
        else res.json({ data: results });
    });
});

app.post("/Login", function (req, res) {
    connection.query(`SELECT user FROM USERINFO WHERE ID = "${req.body.id}" AND PW = "${req.body.pw}"`, (err, results, fields) => {
        if (err) {
            res.json({ error: err });
        }
        else {
            if (results.length == 1) {
                req.session.user = results[0].user;
                req.session.isLogin = true;
                res.json({ data: results });
            }
            else {
                req.session.isLogin = false;
                res.json({ data: results });
            }
        }
    });
});

app.get("/Logout", function (req, res) {
    req.session.destroy();
    res.send({ status: 200 });
});

app.post("/SignUp", function (req, res) {
    connection.query(`INSERT INTO USERINFO VALUES("${req.body.id}", "${req.body.pw}", "${req.body.user}")`, (err, results, fields) => {
        if (err) {
            res.json({ error: err });
        }
        else {
            res.json({ data: results })
        }
    });
});

app.listen(3001);