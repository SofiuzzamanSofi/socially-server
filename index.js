const express = require('express');
const cors = require('cors');
require("dotenv").config();   // NB: initialized before port= process.env
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
require("colors");
const app = express();

// MONGODB-------
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwgt8km.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// middleware -----
app.use(cors());
app.use(express.json());






// initialize a function named RUN --
async function run() {

    // MONGODB COLLECTIONS-----
    const database = client.db("socially-server");
    const usersCollection = database.collection("users");
    const postsCollection = database.collection("post")



    // under try catch MAIN WORK'S is done here ----
    // try catch to cath if errors -----
    try {

        // insert a post / add a post --
        app.post("/post", async (req, res) => {
            const post = req?.body;
            const result = await postsCollection.insertOne(post);
            if (result.acknowledged) {
                res.send({
                    success: true,
                    message: "Successfully add the  posts",
                    data: result,
                });
            } else {
                res.send({
                    success: false,
                    message: "No post found/ somthing went wron form database"
                });
            };
        });

        // get all post --
        app.get("/post", async (req, res) => {
            // const query = {};
            const result = await postsCollection.find({}).toArray();
            if (result) {
                res.send({
                    success: true,
                    message: "Successfully add the  posts",
                    data: result,
                });
            } else {
                res.send({
                    success: false,
                    message: "No post found/or, somthing went wron form database"
                });
            };
        });

        // get a (single post) / post details  --
        app.get("/post/:id", async (req, res) => {
            const id = req?.params?.id;
            let query = { _id: ObjectId(id) };
            const result = await postsCollection.findOne(query);
            if (result) {
                res.send({
                    success: true,
                    message: "Successfully add the  posts",
                    data: result,
                });
            } else {
                res.send({
                    success: false,
                    message: "No post found/or, somthing went wron form database"
                });
            };
        });


    } catch (error) {
        console.log("error from TRY catch function's catch section:".bgRed, error);
    };

};

// call the function named RUN--
run().catch(error => console.log("error to call the RUN function's catch section:".bgRed, error))






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