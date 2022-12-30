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
            const result1 = await postsCollection.find({}).toArray();
            const result = result1.reverse();
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


        // add comment on post  ----
        app.put("/post/:id", async (req, res) => {
            const id = req?.params?.id;
            const comment = req?.body;
            let query = { _id: ObjectId(id) };
            // console.log(id, comment);
            const updateDoc = {
                $push: {
                    comments: comment,
                }
            };
            const options = { upsert: true };
            const resultEdit = await usersCollection.updateOne(query, updateDoc, options);
            console.log(resultEdit);
        });

        // get user  and edit user data ------
        app.get("/user", async (req, res) => {
            const email = req.query?.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            if (result) {
                res.send({
                    success: true,
                    message: "Successfully got the user.",
                    data: result,
                });
            } else {
                res.send({
                    success: false,
                    message: "No user found on database record."
                });
            };
        });


        // EDIT user data ------
        app.put("/user", async (req, res) => {
            const email = req.query?.email;
            const query = { email: email };
            const modalEditedData = req?.body;
            const result = await usersCollection.findOne(query);
            if (result) {
                const updateDoc = {
                    $set: {
                        displayName: modalEditedData?.displayName,
                        university: modalEditedData?.university,
                        profession: modalEditedData?.profession,
                        address: modalEditedData?.address,
                    },
                };
                const options = { upsert: true };
                const resultEdit = await usersCollection.updateOne(query, updateDoc, options);
                if (resultEdit?.acknowledged) {
                    res.send({
                        success: true,
                        message: "Successfully got the user.",
                        data: resultEdit,
                    });
                } else {
                    res.send({
                        success: false,
                        message: "Success but acknowledged false/ no data changed",
                    });
                };
            } else {
                const resultElse = usersCollection.insertOne(modalEditedData);
                res.send({
                    success: false,
                    message: "No user found on database record.",
                    data: resultElse,
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