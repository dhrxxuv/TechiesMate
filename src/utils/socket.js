const crypto = require('crypto');
const socket = require('socket.io');
const { Chat } = require('../models/chat');

const getRoomId = (userId, targetUserId) => {
    return crypto.createHash('sha256')
        .update([userId, targetUserId].sort().join("_"))
        .digest('hex');
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });

    io.on("connection", (socket) => {

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getRoomId(userId, targetUserId);
            console.log(`${firstName} joined room: ${roomId}`);
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ firstName,lastName, userId, targetUserId, text }) => {
            const roomId = getRoomId(userId, targetUserId);
            console.log("message from", firstName, lastName, ":", text)

            try {
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text
                });

                await chat.save();

                const lastMsg = chat.messages[chat.messages.length - 1];

                io.to(roomId).emit("messageReceived", {
                    sender: firstName,
                    senderLast: lastName,
                    text: lastMsg.text,
                    time: lastMsg.createdAt // Use real Mongo timestamp
                });
            } catch (err) {
                console.error("Error saving message:", err);
            }


        });

        socket.on("disconnect", () => {
            // Optional: log or handle disconnection
        });
    });
};

module.exports = initializeSocket;
