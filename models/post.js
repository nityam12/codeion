const mongoose=require('mongoose');



const postSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,//schema of type object id-pleaserefer to documents
        ref:'User'//refered to user schema
    }
    
},{

        timestamps:true
   }

);

const Post=mongoose.model('Post',postSchema);
module.exports=Post;