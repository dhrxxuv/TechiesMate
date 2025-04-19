const express = require('express')
const { userAuth } = require('../middleware/auth')
const User = require('../models/user');

const requestRouter = express.Router()

requestRouter.post("/sendConnectionRequest", userAuth,async(requestRouter,res)=>{
    const user = req.body

    res.send(user.firstName+ "sent a connect request")
})

module.exports = requestRouter