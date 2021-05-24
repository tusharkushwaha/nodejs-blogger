const { json } = require("express")
const express = require("express")
const post_schema = require("../db/post_schema")
const router = express.Router()

const Post_blog = require("../db/post_schema")

function authenticate(req, res, next) {
     if (req.user)
          next()
     else
          res.redirect("/auth/login")
}

router.get("/", async (req, res) => {
     try {

          let posts = await (await Post_blog.find({ user: req.user.id }))

          res.render("blog", { title: "home", user: req.user, posts: posts })

     } catch (err) {
          res.render("blog", { title: "home", user: req.user})
          // console.log("error in blogg.js" + err);
     }
})
router.get("/imagegallery",(req,res)=>{
     res.render("imagegallery",{title:"Image Gallery", user:req.user})
})



module.exports = router