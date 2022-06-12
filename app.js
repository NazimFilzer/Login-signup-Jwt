const express = require('express');
const mongoose = require('mongoose');
const authRoutes= require("./routes/authRouter");
const cookieParser= require("cookie-parser");

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://nazim:123@cluster0.pxt34.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000,()=>{
    console.log("Running");
  }))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies')); 
app.use(authRoutes);  

//cookies

app.get("/set-cookies",(req,res)=>{

  // res.setHeader("Set-Cookie","newUser=true");

  res.cookie("newUser",false);
  res.cookie("isEmployee",true,{ maxAge:1000*60*60*24, httpOnly:true}); // this is the properties which we can give it    

  res.send("u got the cookies")

})

app.get("/read-cookies",(req,res)=>{
  const cookies= req.cookies; //can we accessed in any route
  console.log(cookies.newUser);

  res.json(cookies);

})