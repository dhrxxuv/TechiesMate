const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.post('/signup',async(req,res)=>{
    const userobj = {
        firstname:"Luv",
        lastname:"neekha",
        emailId:"Luv@gmail.com",
        password:"dhruv123",
        age:24,
        gender:"male"
    }
    const user = new User(userobj)
    try{
        await user.save()
        res.send("user created")
    }catch(err){
        res.status(404).send(err)
    }
})




connectDB()
    .then(() => {
        console.log("DB connected");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((err) => {
        console.error("DB not connected:", err);
    }); 
