const express = require('express');
const { userAuth } = require('../middleware/auth');
const User = require('../models/user')
const {validateProfileData, validationPassword} = require('../utils/validation')
const profileRouter = express.Router();
const bcrypt = require('bcrypt')


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



profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        validationPassword(req); 

        const { password, newPassword } = req.body;
        const loggedInUser = await User.findById(req.user._id).select('+password');

        // console.log(loggedInUser)
        // console.log("Incoming password:", password);
        // console.log("Stored password:", loggedInUser.password);

        const isPassCorrect = await bcrypt.compare(password, loggedInUser.password);
        if (!isPassCorrect) {
            return res.status(401).json({ error: "Incorrect current password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedNewPassword;

        await loggedInUser.save();
        res.status(200).json({ message: "Password updated successfully" });

    } catch (err) {
        console.error("Error while changing password:", err.message);
        res.status(400).json({ error: err.message });
    }
});


module.exports = profileRouter
