const express = require('express');
const app = express();
const fs = require("fs");
const uuid = require("uuid");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const db = require("./models/db");
const TodoModel = require("./models/Todo");


app.use(upload.single("todoImage"));
app.use(express.static("uploads"));
app.use(express.json());


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/index.js", function (req, res) {
    res.sendFile(__dirname + "/index.js");
});
app.get("/index.css", function (req, res) {
    res.sendFile(__dirname + "/index.css");
});

app.post("/todo", function (req, res) {
    //to save todo
    const uid = uuid.v4();
    req.body["uid"] = uid;
    req.body["todoImage"] = req.file.filename;

    TodoModel.create(req.body).then(function () {
        res.status(200).json(req.body);
    }).catch(function (err) {
        res.status(500).send("error");
    });
});

app.get("/todo", function (req, res) {
    //to get all todos
    TodoModel.find({}).then(function (todos) {
        if (todos) {
            res.status(200).json(todos);
            return;
        }
        res.status(500).send("error");
    })
});

app.post("/todoComplete", function (req, res) {
    //to update complete flag oftodo
    todo = req.body;
    TodoModel.updateOne({ uid: todo.uid }, { completed: "true" }).then(function () {
        res.status(200).send("success");
    }).catch(function (err) {
        res.status(500).send("error");
    });
});

app.post("/todoDelete", function (req, res) {
    //to delete a todo
    todo = req.body;
    TodoModel.deleteOne({ uid: todo.uid }).then(function () {
        fs.unlink("./uploads/" + todo.todoImage, function (err) {
            if (err) {
                res.status(500).send("error");
                return;
            }
        });
        res.status(200).send("success");
    }).catch(function (err) {
        res.status(500).send("error");
    });
});

db.init().then(function () {
    console.log("db connected");
    app.listen(2000, function () {
        console.log("listening on 2000");
    });
}).catch(function (err) {
    console.log(err);
});