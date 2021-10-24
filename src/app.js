const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const authorization = require("./middleware/auth");
const app = express();
app.use(express.static("public"));

//setting up configuration for flash
const port = process.env.PORT || 8080;

//Setup for rendering static pages
//for static page
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

// using dotenv module for environment
require("dotenv").config();

//Setting EJS view engine
app.set("view engine", "ejs");

//setting jwt
app.set("jwtTokenSecret", process.env.JWT_SECRET);

require("./db/conn");
const { Console } = require("console");

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
var userRoutes = require("../routes/user");
var resourceRoutes = require("../routes/resource");
var discussionRoutes = require("../routes/discussion");

app.use("/user", userRoutes);
app.use("/forum", discussionRoutes);
app.use("/resource", resourceRoutes);

app.get("/", authorization, (req, res) => {
  res.render("viewresource");
});

// app.get("/tracks-form", (req, res) => {
//   res.render("track-form");
// });

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
