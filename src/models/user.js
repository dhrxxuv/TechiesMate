const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:2,
        maxLength: 50
    },
    lastName:{
        type:String,
        minLength:2,
        maxLength: 50
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid gender")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://imgs.search.brave.com/GgeEQLjGiOY4YOZCPKIRPgOu7obktk8QHGC8EQ1L0RY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9yb3VuZC11c2Vy/LWljb24taXNvbGF0/ZWQtd2hpdGUtYmFj/a2dyb3VuZC1ibGFj/ay13aGl0ZS0zZC1y/ZW5kZXJpbmdfNjMx/MzUtMzg5My5qcGc_/c2VtdD1haXNfaHli/cmlkJnc9NzQw"
    },
    about:{
        type:String,
        default:"You Know Me"
    },
    skills:{
        type:[String],
    }

},{
    timestamps:true 
})

const User = mongoose.model("User",userSchema)
 
module.exports = User;