const express=require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path=require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const app=express();
app.use(express.static("public"));

//setting up configuration for flash
const port=process.env.PORT || 8080;

//Setup for rendering static pages
//for static page
const static_path=path.join(__dirname,"../public");
app.use(express.static(static_path));

// using dotenv module for environment
require("dotenv").config();

//Setting EJS view engine
app.set('view engine','ejs');

//setting jwt
app.set("jwtTokenSecret", process.env.JWT_SECRET);

require("./db/conn");
const Register =require("./module/userRegister");
const { Console } = require('console');

//body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


//setting up methods
app.use(bodyParser.json());
app.use(cookieParser("secret_passcode"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

//Routes===========================================
app.get("/",(req,res)=>{
  res.render('index');
});
app.get("/login",(req,res)=>{
  res.render('login');
});
app.get("/signup",(req,res)=>{
  res.render('signup');
});

app.post("/signup",async(req,res)=>{
  try{
   const password= req.body.password;
   const cpassword= req.body.confirmpassword;
   if(password==cpassword)
   {
      const registerEmployee = new Register({
       email:req.body.email,
       name: req.body.name,
       password:req.body.password,
       confirmpassword:req.body.confirmpassword
      })
      
    
     
      const registered=await registerEmployee.save();
      
      res.status(201).render('/');
   }else{
       res.send("password not matching");
   }
  }
  catch(error){
   res.status(400).send(error);
  } 
});

app.post("/login",async(req,res)=>{
  try{
   const email =req.body.email;
   const password=req.body.password;
   const useremail=await Register.findOne({email:email});
   
  if(useremail.password=== password){
            res.status(201).render("/");
        }else{
            res.send("invalid datas");
        }
       }

  catch(error){
   res.status(400).send(error); 
  }
});
app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})