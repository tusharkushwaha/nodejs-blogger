const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local")
const Users = require("../db/schema")
require("dotenv").config();


passport.serializeUser((user, done) => {
     done(null, user.id)
})
passport.deserializeUser((id, done) => {
     Users.findById(id).then((user) => {
          done(null, user)
     })
})

// ------GoogleStrategy-------
passport.use(
     new GoogleStrategy({
          // options for google strategy

          clientID: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          callbackURL: "https://blogger-tk.herokuapp.com/auth/google/redirect"
     }, (accessToken, refreshToken, profile, done) => {
          // callback function
          console.log("callback function fired");
          // console.log(profile._json.given_name);
          Users.findOne({ googleId: profile.id }).then((exisitngUser) => {
               if (exisitngUser) {
                    // console.log("The existing user is: " + exisitngUser);
                    done(null, exisitngUser)
               } else {
                    new Users({
                         username: profile.displayName,
                         googleId: profile.id,
                         firstname: profile._json.given_name,
                         lastname: profile._json.family_name,
                         imageurl: profile._json.picture,
                         email: profile._json.email
                    }).save().then((newUser) => {
                         // console.log("New user created: " + newUser)
                         done(null, newUser)
                    }).catch((e) => {
                         console.log("The user can't be saved due to some problem");
                    })

               }

          }).catch((e) => {
               console.log("some error occured");
          })




     })
)


// ----------LocalStrategy---------

passport.use(new LocalStrategy({ usernameField: "email" },
     async (email, password, done) => {
          try {
               const checkingUser = await Users.findOne({ email: email })

               if (checkingUser) {
                    
                    if (await bcrypt.compare(password,checkingUser.password)) {
                         return done(null, checkingUser);
                    }
                    else {

                         return done(null, false, {message:"Incorrect password"});
                    }
               }
               else {
                    return done(null, false, {message: "User is not resgisted. Please Sign up."});

               }
          } catch (e) {
               console.log("Some error is occuring");
               console.log(e);
          }
     }
));