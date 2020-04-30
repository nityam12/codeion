//action for a controller
//as it is a object it must have a name -0home

const Post=require('../models/post');

module.exports.home = function(req, res) {
    //console.log(req.cookies);
   // res.cookie('user_id',25);

    // Post.find({},function(err,posts){

    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts:posts
    //     });

    // });

    //populate the user of each post
    Post.find({})
    .populate('user')
    .populate({
        path:'Comments',
        populate:{
            path:'user'
        }
    })
    
    .exec(function(err,posts){

        return res.render('home', {
            title: "Codeial | Home",
            posts:posts
        });

    })

    
}