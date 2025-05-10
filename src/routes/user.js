const express = require('express')
const { userAuth } = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')
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
        .populate("fromUserId", ["firstName", "lastName", "about", "gender","age", "photoUrl"])
        .populate("toUserId", ["firstName", "lastName", "about", "gender","age","photoUrl"]);

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



userRouter.get('/user/feed', userAuth , async (req,res)=>{
    try{
        const loggedUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const calculateSkip = (page - 1) * limit

        const connectionRequestPeople = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedUser._id },
                { toUserId: loggedUser._id }
            ]
        }).select("fromUserId toUserId")
          .populate("fromUserId", ["firstName", "lastName"])
          .populate("toUserId", ["firstName", "lastName"])

        const hideUserFromFeed = new Set()
        connectionRequestPeople.forEach(request => {
            hideUserFromFeed.add(request.fromUserId._id.toString())
            hideUserFromFeed.add(request.toUserId._id.toString())
        })

        const users = await User.find({
            _id: {
                $ne: loggedUser._id,
                $nin: Array.from(hideUserFromFeed)
            }
        })
        .select(["firstName", "lastName", "age","about", "gender","photoUrl","skills"])
        .skip(calculateSkip).limit(limit)

        res.json({
            message: "Success",
            user: users
        })
    } catch(err) {
        res.status(500).json({
            message: "Error " + err.message
        })
    }
})

module.exports = userRouter

