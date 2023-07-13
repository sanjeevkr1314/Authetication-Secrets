//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// connect to mongodb database
mongoose
.connect("mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then((success, err) => {
    if (success) {
        console.log(`CONNECTED TO MONGO!`);
    } else {
        console.log(`OH NO! MONGO CONNECTION ERROR!`);
        console.log(err);
    }
});

// creating schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// creating a model
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    
    newUser.save()
    .then((success, err)=>{
        if(success){
            res.render("secrets");
        }else{
            console.log(err);
        }
    });
});

app.post("/login", function(req, res){
    const username= req.body.username;
    const password= md5(req.body.password);

    User.findOne({email: username})
    .then((foundUser, err)=>{
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }else{
                res.send("Incorrect Password!")
            }
        }else{
            console.log(err);
        }
    });
});

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});