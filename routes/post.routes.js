const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth.middleware");
const { PostModel } = require("../models/post.model");
const PostRouter = express.Router();
require("dotenv").config();
PostRouter.use(auth)
PostRouter.post("/add", async (req, res) => {
    try {
        const post = new PostModel(req.body)
        await post.save();
        res.status(200).json({"msg":"Post Added !!"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

PostRouter.get("/",async (req, res) => {
    const userID = req.body.userID;
    const { min, max,page,device,device1,device2 } = req.query;
    let query = {};
    if (min && max) {
        query.no_of_comments ={$or :[{no_of_comments:{$gte:min}},{no_of_comments:{$lte:max}}]}
    }
    if (device) {
       query.device = device
    }
    if (device1 && device2) {
        query.device = {$and : [{device :device1},{device:device2}]}
    }
    
    try {

        if (userID) {
            query.userID = userID   
            const posts = await PostModel.find(query).limit(3).skip((page*3)-3)
            res.status(200).json(posts);
        } else {
            res.status(200).json({"msg":"Please Login first !!"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

PostRouter.get("/top", async (req, res) => {
    const userID = req.body.userID;
try {
    const post = await PostModel.find({userID}).sort({no_of_comments:-1});
  
            res.status(200).json(post);
} catch (error) {
    res.status(400).json({error:error.message})
    
}
})

// /posts/update ==> The logged in user can update his/her posts.

PostRouter.patch("/update/:id", async (req, res) => {
    // const userID = req.body.userID;
    const { id } = req.params;
try {
    const post = await PostModel.findByIdAndUpdate({ _id: id }, req.body);
    await post.save();
  
            res.status(200).json({"msg":"Post Updated"});
} catch (error) {
    res.status(400).json({error:error.message})
    
}
})
PostRouter.delete("/delete/:id", async (req, res) => {
    // const userID = req.body.userID;
    const { id } = req.params;
try {
    const post = await PostModel.findByIdAndDelete({ _id: id }, req.body);
 
  
            res.status(200).json({"msg":"Post Deleted."});
} catch (error) {
    res.status(400).json({error:error.message})
    
}
})
module.exports = {
    PostRouter
}