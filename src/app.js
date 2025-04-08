const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(express.json());


app.post('/signup', async (req, res) => {
    const userobj = req.body;
    const user = new User(userobj);
    try {
        await user.save();
        res.send("user created");
    } catch (err) {
        res.status(500).send(err); 
    }
});


app.get('/feed', async (req, res) => {
    try {
        const allUsers = await User.find({emailId:"Luv@gmail.com"});
        console.log(allUsers);
        res.json(allUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete('/user', async(req,res)=>{
    const id = req.body._id;
    try{
        await User.findByIdAndDelete({_id:id})
        console.log("user deleted")
        res.send("user deleted");
    }catch(err){
        res.status(500).json({error:err.message})
    }
})

app.patch('/userupdate', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, req.body, { 
            new: true, 
            runValidators: true 
        });

        if (!user) return res.status(404).send("User not found");

        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send(err.message);
    }
});
 




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
