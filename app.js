//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
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

});

app.post("/login", function(req, res){
    const username= req.body.username;
    const password= req.body.password;

    User.findOne({email: username})
    .then((foundUser, err)=>{
        if(foundUser){

            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result===true){
                    res.render("secrets");
                }else{
                    res.send("Incorrect password");
                }
            });

        }else{
            console.log(err);
        }
    });
});

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});