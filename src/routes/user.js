const express = require('express')
const { userAuth } = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequest')
const userRouter = express.Router()

//get all the pending connection request for the user
userRouter.get("/user/request",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user
        console.log("LOGGED IN USER ID", req.user._id)

        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id ,
            status:"interested"
        }).populate("fromUserId",["firstName", "lastName", "about"])

        res.status(200).json({
            message:"Data fetched Successfully ",
            data:connectionRequest
        })
    }catch(err){
        res.status(404).send("ERROR "+ err.message)
    }
})

userRouter.get('/user/connections', userAuth , async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        })
        .populate("fromUserId", ["firstName", "lastName", "about", "gender"])
        .populate("toUserId", ["firstName", "lastName", "about", "gender"]);

        const data = connectionRequest.map((user) => {
            
            if(user.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return user.toUserId;
            }

            return user.fromUserId;
        });

        res.status(200).json({
            data: data,
            id: loggedInUser._id
        });
    } catch(err){
        res.status(404).json({
            message: "Error " + err.message
        });
    }
});


module.exports = userRouter

