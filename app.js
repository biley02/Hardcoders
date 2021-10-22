const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
app.use(express.json());
app.use(express.static("public"));

// using dotenv module for environment
require("dotenv").config();

//setting up configuration for flash

const PORT = process.env.PORT || 8080;

mongoose
  .connect("mongodb://localhost/db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongo server"))
  .catch((err) => console.log(err));

//Setting EJS view engine
app.set("view engine", "ejs");

//setting jwt
app.set("jwtTokenSecret", process.env.JWT_SECRET);

//body parser
app.use(
  express.urlencoded({
    extended: true,
  })
);

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

//Setup for rendering static pages
//for static page
const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));

//Routes===========================================
var indexRoutes = require("./routes/index");

app.use("/", indexRoutes);

app.get("*", (req, res) => {
  res.send("error");
});

// Start the server
app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
