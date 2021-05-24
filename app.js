const express = require("express");
const path = require("path")
const bodyParser = require("body-parser")
const port = process.env.PORT || 8000;
const router_auth = require("./routes/auth");
const router_profile = require("./routes/profile")
const router_blog = require("./routes/blog")
const router_post = require("./routes/post")
const MongoDB = require("./db/con")
const mongoose = require("mongoose")
const passportSetup = require("./config/passport-setup");
const Session = require("express-session")
const MongoStore = require("connect-mongo") 
const flash = require("express-flash")
const passport = require("passport");


require("dotenv").config();

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
//serving static files
app.use(express.static(__dirname + '/public'));
app.use(express.json())
//ejs view engine
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"/templates/views"))

app.use(flash())

app.use(Session({
     maxAge: 24*60*60*1000,
     secret:process.env.EXPRESS_SECRET,
     resave:false,
     saveUninitialized:false,
     store:MongoStore.create({mongoUrl:process.env.MONGO_URL})
}))

//-------passport initialize
app.use(passport.initialize())
app.use(passport.session());



//blog routes
app.use("/",router_blog)

//auth routes
app.use("/auth",router_auth)

//profile routes
app.use("/profile",router_profile)

//view post routes
app.use("/post",router_post)





app.listen(port,()=>{
     console.log(`Server is activated at the ${port}`);
})