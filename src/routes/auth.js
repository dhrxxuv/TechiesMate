const express = require('express')
const User = require('../models/user');
const bcrypt = require('bcrypt')
const validator = require('validator')
const {validateSignupdata} = require('../utils/validation')
const authRouter = express.Router()
const jwt = require('jsonwebtoken')

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignupdata(req);

        const { firstName, lastName, emailId, password, age, gender, skills } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const userobj = {
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
            age,
            gender,
            skills
        };

        const user = new User(userobj);
        await user.save();
        res.send("User created");
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Invalid email");
        }

        const user = await User.findOne({ emailId: emailId }); 

        if (!user) {
            throw new Error("Invalid Cradential");
        }

        const isPassValid = await bcrypt.compare(password, user.password); 

        if (isPassValid) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY,{
                expiresIn: '1h'
            })
            console.log(token)
            res.cookie("token",token,{
                expires:new Date(Date.now()+1*3600000)
            })
            res.status(200).send(user);
        } else {
            throw new Error();
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

authRouter.post('/logout',async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })

    res.send("Logout Successfull")
})


module.exports = authRouter