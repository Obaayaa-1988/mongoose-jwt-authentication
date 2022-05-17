const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');
const bcrypt  = require('bcrypt');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path')
const SignerModel = require('./model/auth')
const { handleErrors, generateToken }  = require("./helpers/sign.helper");


const PORT = process.env.PORT || 8080

const app = express()

app.use(express.json()); //req.body
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));
app.use(cookieParser());

const mongoUrl = "mongodb://localhost:27017/mongo-express-auth"


mongoose.connect(mongoUrl, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
}).then(result => {
    if(result)
    console.log('authentication to mongodb database authorized')
}).catch(err => {
   console.log(err) 
})


app.use(express.static('public'));

app.set('view engine', 'ejs');

//routes for our pages

app.get("/", (req,res) => {
  res.render('index', {title: 'Home'})
  })

  app.get("/log", (req,res) => {
    res.render('log', {title: 'Log'})
})

app.get("/sign", (req,res) => {
    res.render('sign', {title: 'Sign'})
})

app.get("/logout", (req,res) => {
    res.render('logout', {title: 'Logout'})
})



//post request for sign up
app.post("/signUp", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const newUser = new SignerModel ({
        email,
        password,
      });
      // user is saved
      const user = await newUser.save();
  
      // generate jwt tokens
      const token = generateToken(user._id);
  
      // set cookie for subsequent request to the server
      res.cookie("jwt", token, { maxAge: 3 * 24 * 60 * 60, httpOnly: true });
  
      // send response to the agent ie the browser
      res.status(201).json({ user: user._id });
    } catch (error) {
      // res.json({Error: error.message})
      // handleErrors(error)
  
      const errors = handleErrors(error);
      console.log(errors);
      res.json({ errors });
  
      // res.send(errors);
    }
  });
  
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
      try {
  
          // check for availability of the user in db
          const user = await SignerModel.findOne({ email });
  
          
          if (user) {
              // do this if available
            const isSame = await bcrypt.compare(password, user.password);
            if (isSame) {
              
            // generate jwt token 
            const token = generateToken(user._id);
            // set cookie for subsequent requests
            res.cookie("jwt", token, { maxAge: 3 * 24 * 60 * 60, httpOnly: true });
        
            res.status(200).json({user: user._id})
        
            } else {
              res.status(401).json({ errors: "Authentication failed" });
              // res.sendStatus(401)
              // throw Error("Incorrect password")
            }
          } else {
            // throw Error("Email does not exist please signup")
            res.json({ errors: "Authentication failed" });
          }
      } catch (error) {
          const errors = handleErrors(error);
          console.log(errors)
          res.json({errors});
      }
  });



  app.get("/log-out", (req, res) => {
      res.cookie("jwt",  " ", {maxAge: 1});
      res.redirect('/');

  })






app.listen(PORT, () => console.log(`authenticating on server ${PORT} `))