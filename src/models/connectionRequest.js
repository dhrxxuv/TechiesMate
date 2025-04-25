const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        required:true,
        enum: {
            values:['ignored','interested' ,'accepted', 'rejected'],
            message:`{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps: true
})


//create compund index on fromUserId and toUserId to make searching more fast 
connectionRequestSchema.index({fromUserId:1,toUserId:1})

// connectionRequestSchema.pre("save",function(){
//     const connectionRequest = this
// })

const ConnectionRequestModel = new mongoose.model("connectionRequest",connectionRequestSchema)
module.exports = ConnectionRequestModel