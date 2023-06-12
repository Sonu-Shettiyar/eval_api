const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const UserRouter = express.Router();
require("dotenv").config();
UserRouter.use(express.json())
UserRouter.post("/register",async (req,res) => {
    const { email, password } = req.body
    
    const user = await UserModel.findOne({email})
try {
 
    if (user) {
        res.status(200).json({ "msg": "User already exist, please login" })
    } else {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.status(200).json({err:err.message})
            } else {
                const newuser = new UserModel({...req.body,password:hash})
                await newuser.save()
                res.status(200).json({"msg":"User Registered Succesfully",newuser})
            }
        })
}

    
} catch (error) {
    res.status(400).json({ error: error.message })
}

})

UserRouter.post("/login", async (req, res) => {
    
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    try {
        if (user) {
            if (user.password === req.body.password) {
                const token = jwt.sign({ userId: user._id, userName: user.name }, process.env.secret_key, {
                    expiresIn : "7d"
                });
                res.status(200).json({ "msg": "Login Successfull", token });
            } else {
                res.status(200).json({"msg":"Wrong Credentials !!"})
            }  
        } else {
            res.status(200).json({
                "msg":"Not registered !"
            })
       }    
    } catch (error) {
        res.status(400).json({error:error.message,err:"errppppp"})
    }
    
})


module.exports = {
    UserRouter
}