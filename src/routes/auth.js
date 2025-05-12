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

    const { firstName, lastName, emailId, password, age, gender, skills, about, location } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userobj = {
      firstName,
      lastName,
      emailId: emailId.toLowerCase(),
      password: hashedPassword,
      age,
      gender,
      skills: skills || [],
      about: about || 'You Know Me',
      location,
    };

    const user = new User(userobj);
    await user.save();


    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });


    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict',
      expires: new Date(Date.now() + 1 * 3600000), // 1 hour
    });


    res.status(201).json({
      message: 'User created successfully',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        age: user.age,
        gender: user.gender,
        skills: user.skills,
        about: user.about,
        location: user.location,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
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