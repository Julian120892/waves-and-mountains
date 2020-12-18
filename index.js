const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config.json");

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + "/uploads");
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 20971520,
    },
});

app.use(express.static("public"));
app.use(express.json());

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    if (req.file) {
        const { username, title, description } = req.body;
        const url = config.s3Url + req.file.filename;

        db.uploadImage(url, username, title, description)
            .then(({ rows }) => {
                res.json(rows[0]); //why is id undefined here?
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({ success: false });
    }
});

app.get("/images", (req, res) => {
    db.getImagesFromDB().then(({ rows }) => {
        res.json(rows);
    });
});

app.get("/image", (req, res) => {
    db.getImageFromDB(req.query.id)
        .then(({ rows }) => {
            res.json(rows); //why is id undefined here?
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/more", (req, res) => {
    db.getMoreImages(req.query.id).then(({ rows }) => {
        res.json(rows);
    });
});

app.post("/addComment", (req, res) => {
    let newCommet = {
        username: req.body.username,
        id: req.body.id,
        comment: req.body.comment,
    };
    db.addComment(req.body.comment, req.body.username, req.body.id).then(() => {
        res.json(newCommet);
    });
});

app.get("/getComments", (req, res) => {
    db.getComments(req.query.id).then(({ rows }) => {
        res.json(rows);
    });
});

app.listen(8080, () => console.log("running imageboard on 8080..."));
