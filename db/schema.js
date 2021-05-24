const mongoose = require("mongoose")
// const validator = require("validator")
const user = new mongoose.Schema({
     email :{
          type: String
    },
     googleId:{
          type: String
     },
     password:{
          type:String
    },
     confirmpassword:{
          type:String
    },
    firstname:{
         type:String
    },
    lastname:{
         type: String
    },
    mobilenumber:{
         type:Number
    },
    imageurl:{
         type:String,
         default:"private"
    }
     
})

const student = new mongoose.model("Bloggin_people", user);
module.exports = student;