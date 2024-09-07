const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const employeeSchema= new Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:["Employee","Hr"]
    },
    password:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model("Employee",employeeSchema);