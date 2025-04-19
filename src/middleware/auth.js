const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ msg: "Please login to access this" });
        }

        const decodedObj = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decodedObj.userId).select("-password"); 

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;

        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or Expired Token", details: err.message });
    }
};

module.exports = { userAuth };
