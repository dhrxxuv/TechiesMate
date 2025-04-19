const express = require('express');
const { userAuth } = require('../middleware/auth');
const {validateProfileData} = require('../utils/validation')
const profileRouter = express.Router();
const User = require('../models/user')

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        res.json({
            cookies: req.cookies, 
            user: req.user
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

profileRouter.patch('/profile/edit', userAuth , async(req,res)=>{
    try {
   
        if (!validateProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        console.log(loggedInUser)
        Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key])
        console.log(loggedInUser)
       res.json(loggedInUser)
       await loggedInUser.save()
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = profileRouter
