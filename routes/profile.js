const { promiseImpl } = require("ejs")
const express = require("express")
const User = require("../db/schema")
const router = express.Router()
const cloudinary = require("../handlers/cloudinary")
const upload = require("../handlers/multer")

function authenticate(req, res, next) {
     if (req.user)
          next()
     else
          res.redirect("/auth/login")
}

router.get("/", authenticate, (req, res) => {
     console.log(req.user);
     res.render("profile", { title: "profile", user: req.user })


})




router.post("/", upload.single("image"), (req, res) => {
     if (req.file) {
          const image_result = cloudinary.v2.uploader.upload(req.file.path).then((image_result) => {
          //     console.log(image_result.secure_url);
               let { firstname, lastname, mobilenumber } = req.body
               const find_user = User.findByIdAndUpdate(req.user.id, { firstname: firstname, lastname: lastname, mobilenumber: mobilenumber, imageurl: image_result.secure_url }).then(() => {
                    res.redirect("/profile")
               }).catch((err) => {
                    console.log("problem in filling the data to the database"+err);
               })

          }).catch((e) => {
               console.log("error in uploading image" + e);
               
          })

     } else {
          
          let { firstname, lastname, mobilenumber } = req.body
          // console.log("User found by is:" + req.body);
          const find_user = User.findByIdAndUpdate(req.user.id, { firstname: firstname, lastname: lastname, mobilenumber: mobilenumber}).then(() => {
          res.redirect("/profile")
     }).catch(() => {
          console.log("problem in filling the data to the database");
     })
     }

})


module.exports = router