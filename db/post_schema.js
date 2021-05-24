const User = require("./schema")
const mongoose = require("mongoose");

const post_schema = new mongoose.Schema({
     title:{
          type:String,
          required: true
     },
     bodyOfEditor:{
          type:String
     },
     user:{
          type: mongoose.Schema.Types.ObjectId,
          ref: User
     },
     createdate:{
          type: Date,
          default: Date.now
     }
})

module.exports = mongoose.model("Post",post_schema)