const Comment=require('../models/comment');
const Post=require('../models/post');


module.exports.create=function(req,res){
    Post.findById(req.body.post,function(err,post){

        if(post)
        {
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id //check
            },function(err,comment){
                //handle error

                post.Comments.push(comment);
                post.save();//must be done after each update 

                res.redirect('back');
            });
        }
    });
}

module.exports.destroy=function(req,res)
{
    Comment.findById(req.params.id,function(err,comment){
          if(comment.user == req.user.id)
          {
                let postId=Comment.post;


                comment.remove();

                Post.findByIdAndUpdate(postId,{$pull: {Comments:req.params.id}},function(err,post){    //removed from comments array

                    return res.redirect('back');
                    
                });
                
                
           }
           else{
               return res.redirect('back');
           }

        });



 }



