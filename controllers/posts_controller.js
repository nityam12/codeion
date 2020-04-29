const Post=require('../models/post');

module.exports.create=function(req,res)
{
    Post.create({
        content:req.body.content,//contents is passed with name content
        user:req.user._id //not checking whether signed in or not
    },function(err,post){
            if(err){console.log('error in creating a post');return;}
            return res.redirect('back');
    });
}