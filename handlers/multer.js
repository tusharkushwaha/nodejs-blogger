const multer = require("multer")

module.exports=multer({
     storage:multer.diskStorage({}),
     fileFilter:(req,file, cb)=>{
          if(file.mimetype.match(/jpg|jpeg|png$i/)){
               return cb ("File must be of the type jpeg, png or jpg", false)
          }
          return cb(null, true)
     }
})