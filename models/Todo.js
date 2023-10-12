const mongoose=require("mongoose");

const todoSchema=new mongoose.Schema({
    task:String,
    completed:String,
    uid:String,
    todoImage:String
});

const Todo=mongoose.model("Todo",todoSchema);

module.exports=Todo;