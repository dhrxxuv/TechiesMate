const express = require('express');
const { userAuth } = require('../middleware/auth');
const { Chat } = require('../models/chat');
const ConnectionRequestModel = require('../models/connectionRequest');

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    try {
        const areTheyConnected = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId:userId, toUserId:targetUserId, status:"accepted"},
                {fromUserId:targetUserId, toUserId:userId, status:"accepted"}
            ]
        })

        if(!areTheyConnected) return res.status(404).json({ message: "Use are Friend" });
;
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save();
        }

        res.json(chat);
    } catch (err) {
        console.error("Error fetching chat:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = chatRouter;
