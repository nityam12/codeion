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