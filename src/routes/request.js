const express = require('express')
const { userAuth } = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');


const requestRouter = express.Router()

requestRouter.post("/request/send/:status/:toUserId", userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User Not Found" });
        }
        
        if(fromUserId==toUserId){
            throw new Error("You cannot send a connection request to yourself.");
        }
        const allowedUser = ["ignored","interested"]

        if(!allowedUser.includes(status)){
            return res
            .status(400)
            .json({
                message:"Invalid Status Type "+ status
            })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                { fromUserId, toUserId },
                {fromUserId:toUserId,toUserId:fromUserId}

            ]
        });

        if(existingConnectionRequest){
            return res.status(409).json({ message: "Connection request already exists." })
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        await connectionRequest.save()

        res.json({
            message:"connection Request Sent Successfully"
        })
    }catch(err){
        res.status(400).send("ERROR "+ err.message)
    }
})

module.exports = requestRouter