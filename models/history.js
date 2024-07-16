const mongoose = require("mongoose");
const historySchema = new mongoose.Schema({
    title:{
        type: String,
        required:true,
        
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        require:true
    },
    priority:{
        type:String,
        require:true
    },
    chagesAt:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("History",historySchema)