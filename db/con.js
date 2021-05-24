require("dotenv").config();
const mongoose = require("mongoose")

const mongoDB = mongoose.connect(process.env.MONGO_URL,{
     useNewUrlParser:true,
     useUnifiedTopology:true,
     useCreateIndex:true,
     useFindAndModify:false
}).then(()=>{
     console.log("MongoDB connected");
}).catch(()=>{
     console.log("MongoDB not connected");
})
module.exports = mongoDB;