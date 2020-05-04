
const Post=require('../../../models/post');
const Comment=require('../../../models/comment');

module.exports.index=async function(req,res){

    let posts= await Post.find({})

    .sort('-createdAt') //in this way data is stored in mongo db
    .populate('user')
    .populate({
        path:'Comments',
        populate:{
            path:'user'
        }
    });

    return res.json(200,{

            message:"List of Posts",
            posts:posts
    })
}


module.exports.destroy=async function(req,res)
{
    try{
        let post= await Post.findById(req.params.id);
    
    //doing authorization
        // .id means converting the object id into string otherwise it should bre ._id
            if(post.user == req.user.id){
                post.remove();
    
                await Comment.deleteMany({post:req.params.id});
                   


                    
                return res.json(200,{

                    message:"Post and associated comments deleted siccessfully"
                });

                 }
            
             else{
             
                 return res.json(401,{
                     message:"you can not delete this post"
                 });
             }
    }catch(err){
        console.log('***',err);
        return res.json(500,{
            
                message:"internal server error"
        });
    }
   
}