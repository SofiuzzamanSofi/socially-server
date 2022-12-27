const express = require('express');
const cors = require('cors');
require("dotenv").config();   // NB: initialized before port= process.env
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
require("colors");
const app = express();

// middleware -----
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Bismillahir Rahmanir Rahim, Successfully Running  Socially-Server");
});
app.get("/data/data", (req, res) => {
    res.send({
        success: true,
        message: "finally got this ",
        data: "k: data"
    });
});

app.listen(port, () => console.log(`Socially-server running ${port}`.bgCyan))