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

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        // Validate incoming data
        if (!validateProfileData(req)) {
            return res.status(400).json({ 
                error: "Invalid Edit Request",
                message: "Only firstName, lastName, gender, age, about, and skills can be updated"
            });
        }

        // Get the authenticated user
        const userId = req.user._id;
        
        // Create update object with only allowed fields
        const updateData = {};
        const allowedFields = ["firstName", "lastName", "gender", "age", "about", "skills","photoUrl"];
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Additional validation for specific fields
        if (updateData.age && (updateData.age < 18 || updateData.age > 100)) {
            return res.status(400).json({ 
                error: "Validation Error",
                message: "Age must be between 18 and 100"
            });
        }

        if (updateData.gender && !["male", "female", "other"].includes(updateData.gender)) {
            return res.status(400).json({ 
                error: "Validation Error",
                message: "Gender must be male, female, or other"
            });
        }

        if (updateData.skills && updateData.skills.length > 20) {
            return res.status(400).json({ 
                error: "Validation Error",
                message: "Maximum 20 skills allowed"
            });
        }

        // Update the user in database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { 
                new: true, // Return the updated document
                runValidators: true // Run schema validations
            }
        ).select('-password -__v'); // Exclude sensitive fields

        if (!updatedUser) {
            return res.status(404).json({ 
                error: "Not Found",
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (err) {
        console.error("Profile update error:", err);

        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ 
                error: "Validation Error",
                messages: errors
            });
        }

        res.status(500).json({ 
            error: "Internal Server Error",
            message: "Could not update profile"
        });
    }
});



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
