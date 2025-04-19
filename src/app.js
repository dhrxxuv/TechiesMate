const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');
const validator = require('validator');

const app = express();
const {userAuth} = require('./middleware/auth')
require('dotenv').config();


app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)

// app.post('/signup', async (req, res) => {
//     try {
//         validateSignupdata(req);

//         const { firstName, lastName, emailId, password, age, gender, skills } = req.body;

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const userobj = {
//             firstName,
//             lastName,
//             emailId,
//             password: hashedPassword,
//             age,
//             gender,
//             skills
//         };

//         const user = new User(userobj);
//         await user.save();
//         res.send("User created");
//     } catch (err) {
//         res.status(500).json({ error: err.message }); 
//     }
// });


// app.get('/feed', async (req, res) => {
//     try {
//         const allUsers = await User.find({emailId:"Luv@gmail.com"});
//         console.log(allUsers);
//         res.json(allUsers);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


// app.delete('/user', async(req,res)=>{
//     const id = req.body._id;
//     try{
//         await User.findByIdAndDelete({_id:id})
//         console.log("user deleted")
//         res.send("user deleted");
//     }catch(err){
//         res.status(500).json({error:err.message})
//     }
// })

// app.patch('/userupdate/:userId', async (req, res) => {
    
    
//     try {
//         const Allowed_updates = ["skills","gender","About","age"]

//         const isAllowed = Object.keys(req.body).every(k=>Allowed_updates.includes(k))
//         if(!isAllowed){
//             throw new Error("invalid feilds cant be updated")
//         }
//         const user = await User.findByIdAndUpdate(req.params.userId, req.body, { 
//             new: true, 
//             runValidators: true 
//         });

//         if (!user) return res.status(404).send("User not found");

//         res.send("User updated successfully");
//     } catch (err) {
//         res.status(400).send(err.message);
//     }
// });
 
// app.post('/login', async (req, res) => {
//     try {
//         const { emailId, password } = req.body;

//         if (!validator.isEmail(emailId)) {
//             throw new Error("Invalid email");
//         }

//         const user = await User.findOne({ emailId: emailId }); 

//         if (!user) {
//             throw new Error("Invalid Cradential");
//         }

//         const isPassValid = await bcrypt.compare(password, user.password); 

//         if (isPassValid) {
//             const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY,{
//                 expiresIn: '1h'
//             })
//             console.log(token)
//             res.cookie("token",token,{
//                 expires:new Date(Date.now()+1*3600000)
//             })
//             res.status(200).send("Login Successful");
//         } else {
//             throw new Error("Invalid Cradential");
//         }

//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// app.get('/profile', userAuth, async (req, res) => {
//     try {
//         res.json({
//             cookies: req.cookies, 
//             user: req.user
//         });
//     } catch (err) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });





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
