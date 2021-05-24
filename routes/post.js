const express = require("express")
const { find } = require("../db/post_schema")
const post_schema = require("../db/post_schema")
const router = express.Router()

function authenticate(req, res, next) {
     if (req.user)
          next()
     else
          res.redirect("/auth/login")
}
router.get("/createPost", authenticate, (req, res) => {
     res.render("CreatePost", { title: "Create Post", user: req.user })
})

router.get("/editpost/:id",authenticate,async (req,res)=>{
     try {
     const find_post = await post_schema.findById(req.params.id)
     res.render("editpost",{title:"View Post",post:find_post, user: req.user})

     } catch (err) {
          console.log("The post cannot be found");
     }
})



router.post("/createPost", async (req, res) => {
     req.body.user = req.user.id
     
     try {
          let createpost = await new post_schema(req.body).save()
          res.redirect("/")
     } catch (err) {
          console.log("failed to save the post in the database" + err);
     }
})

router.post("/updatepost/:id",authenticate,async(req,res)=>{
     let {title, bodyOfEditor} = req.body
     try {
          const upadatepost =await post_schema.findOneAndUpdate({_id:req.params.id},{
               title: req.body.title,
               bodyOfEditor: req.body.bodyOfEditor
          })
          res.redirect("/")
     } catch (err) {
          console.log("Can't save the changes to the database");
     }
})
router.get("/deletepost/:id",authenticate,async(req,res)=>{
     try {
          const deletepost =await post_schema.findOneAndDelete({_id:req.params.id})
          res.redirect("/")
     } catch (err) {
          console.log("can't delete the post");
     }
})
router.get("/viewpost/:id",async(req,res)=>{
     try {
          const findpost =await post_schema.findById(req.params.id)
          res.render("viewpost",{title:findpost.title, user:req.user,post:findpost})
     } catch (err) {
          
     }
})


module.exports = router
