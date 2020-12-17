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
        fileSize: 2097152,
    },
});

app.use(express.static("public"));

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    if (req.file) {
        let uploadedImage = {
            username: req.body.username,
            title: req.body.title,
            description: req.body.description,
            url: config.s3Url + req.file.filename,
        };

        db.uploadImage(
            uploadedImage.url,
            uploadedImage.username,
            uploadedImage.title,
            uploadedImage.description
        ).then(res.json(uploadedImage));
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
    db.getImageFromDB(req.query.id).then(({ rows }) => {
        res.json(rows);
    });
});

app.get("/more", (req, res) => {
    db.getMoreImages(req.query.id).then(({ rows }) => {
        res.json(rows);
    });
});

app.post("/addComment", (req, res) => {
    console.log(req.query.username);
});

app.listen(8080, () => console.log("running imageboard on 8080..."));
