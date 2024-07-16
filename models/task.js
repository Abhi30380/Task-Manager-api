const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
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
    dueDate:{
        type:String,
        require:true
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'History'
    }]
},{timestamps:true})
module.exports = mongoose.model("Task",taskSchema)