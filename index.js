const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));

const cities = [
    {
        name: "Berlin",
        country: "Germany",
    },
    {
        name: "London",
        country: "UK",
    },
    {
        name: "Köln",
        country: "Germany",
    },
];

app.get("/cities", (req, res) => {
    //things
    console.log("get route was asked");
    res.json(cities);
});

app.get("/images", (req, res) => {
    db.getImageFromDB().then(({ rows }) => {
        console.log(rows[0]);
        res.json(rows);
    });
});

app.listen(8080, () => console.log("running imageboard on 8080..."));
