const mongoose=require('mongoose');
// const Comment=require('../models/comment');
// const Post=require('../models/post');

const likeSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.ObjectId,
        // ref:'User'
    },

// this defines the object id of liked object---using dynamic reference
    likeable:{
        type:mongoose.Schema.ObjectId,
        require:true,
        refPath:'onModel'
    },

    //this field is used for defining the type of liked object since this is a dynamic reference
    onModel:{
        type:String,
        required:true,
        enum: ['Post','Comment']
    }


},

{
    timestamps:true
}

);


//tell mongoose this is a model
const Like=mongoose.model('Like',likeSchema);
module.exports=Like;