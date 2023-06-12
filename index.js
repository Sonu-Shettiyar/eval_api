const express = require("express");
const { connection } = require("mongoose");
const { UserRouter } = require("./routes/user.routes");
const { PostModel } = require("./models/post.model");
const app = express();
app.use(express.json())
const cors = require("cors");
app.use(cors())
require("dotenv").config();
app.use("/users", UserRouter);
app.use("/posts", PostModel);
// console.log(process.env.mongoURL)
app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log(`DB Connected`)
        console.log(`Succesfully running at port::${process.env.port}`)
    } catch (error) {
        console.log(error.message)
    }
})