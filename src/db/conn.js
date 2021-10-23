const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/detailsofeducation",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
})
.then(()=> {console.log("Mongo db is connected");})
.catch((err)=>{console.log(err);})
 
