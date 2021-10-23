const mongoose= require("mongoose");
const jwt=require("jsonwebtoken");
const employeeSchema =new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
        required:true 
        }
    }]
})

const Register= new mongoose.model("Register",employeeSchema);
module.exports= Register;