const mongoose=require("mongoose");

module.exports.init=async function(){
    await mongoose.connect("mongodb+srv://todoadmin:@cluster0.h1usxsj.mongodb.net/todostorage?retryWrites=true&w=majority");
}