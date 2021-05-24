const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const passport =  require("passport")
const User = require("../db/schema")


router.get("/login",(req,res)=>{
     res.status(200).render("auth-login",{title:"login",user:req.user})
})

router.get("/signup",(req,res)=>{
     res.status(200).render("auth-signup",{title:"sign_up", user:req.user})
})

router.get("/google",passport.authenticate("google",{
     scope:["profile", "email"]
}))





// -------------sign up
router.post("/signup",async(req,res)=>{
     let {email,password,confirmpassword} = req.body
     try {
          const existing_user = await User.findOne({email:email})
          if(existing_user){
               res.render("auth-signup",{existing_message :"The user already exists!. Please Login",title:"sign_up"} )
          }
          else{
               let { password, confirmpassword}= req.body
               // console.log(password, confirmpassword);
               if(password==confirmpassword){
                    const salt= await bcrypt.genSalt(8)
                    const hashedpassword = await bcrypt.hash(req.body.password, salt)
                    // console.log(hashedpassword);
                    req.body.password= hashedpassword,
                    req.body.confirmpassword=hashedpassword
                    const new_user = new User(req.body)

                    new_user.save().then(()=>{
                         res.render("auth-login",{existing_message :"You are now registered. Please Login.",title:"sign_up"} )
                         // console.log("user saved to the database")
                    }).catch(()=>{
                         // console.log("user cant be saved due to some error");
                    })

               }
               else{
                    res.render("auth-signup", {existing_message: "Password do not match", title:"sign_up"})
               }
          }
     } catch (err) {
          console.log("user cant be saved due to some error 2nd");
     }
})




// ----------login post----------
router.post("/login", passport.authenticate("local",{
     successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash:true
}),(req,res)=>{

})




router.get("/google/redirect",passport.authenticate("google"),(req,res)=>{
     // res.send(req.user.id)
     res.redirect("/profile")
})


// ---------logout------
router.get("/logout",(req,res)=>{
     req.logout()
     res.redirect("/")
})



module.exports = router