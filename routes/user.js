const { Router } = require('express');
const userRouter = Router();
const { z } = require('zod');
const { UserModel } = require('../database/db');
const bcrypt = require('bcrypt');
const userMiddleware = require('../middleware/userMiddleware');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const { error } = require('console');
dotenv.config();


userRouter.post("/signup", async (req, res) => {
    const Body = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8)
    })
    const parsedBody = Body.safeParse(req.body);
    if(!parsedBody.success) {
        console.error(parsedBody.error.errors);
        return res.status(422).send("Invalid Credentials Format");
    }
    const userExists = await UserModel.findOne({
        email: parsedBody.data.email
    })
    if (userExists) {
        return res.status(409).send("User Already Exists");
    }
    const hashedPasswd = await bcrypt.hash(parsedBody.data.password, 5);
    try {
        const user = await UserModel.create({
            name: parsedBody.data.name,
            email: parsedBody.data.email,
            password: hashedPasswd
        })
        if(user) {
            res.status(200).send(`Thank you for signing up ${user.name}!`);
        }
    }
    catch(e) {
        console.error(e);
        return res.json({
            msg: "Error Creating User"
        })
    }



})

userRouter.post("/signin", async (req, res) => {
    const signinCreds = z.object({
        email: z.string().email(),
        password: z.string().min(8).max(20)
    })
    const parsedCreds = signinCreds.safeParse(req.body);

    if(!parsedCreds.success) {
        console.error(parsedCreds.error.errors);
        return res.status(400).json({
            msg: "Invalid Credential Format"
        })
    }
    const user = await UserModel.findOne({
        email: parsedCreds.data.email
    })
    if (user) {
        const passwordCheck = await bcrypt.compare(parsedCreds.data.password, user.password);
        if (passwordCheck) {
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET);
            return res.json({
                token
            })
        }
        else {
            return res.status(401).send("Incorrect Password. Try Again");
        }
    }
    else {
        return res.status(404).send("User Not Found");
    }

})

userRouter.get("/me", userMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findOne({_id: req.userId});
        if (user) {
            return res.status(200).json({
                msg: "Logged In Successfully",
                user
            });
        }
        else {
            return res.status(401).json({
                loggedIn: false,
                msg: "Authentication Error"
            })
        }
    }
    catch(e) {
        console.log(e);
        res.json({
            error: e
        })
    }
})

userRouter.get("/mytodos", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/todos.html"));
})

userRouter.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
})

userRouter.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signin.html"))
})

module.exports = { userRouter };