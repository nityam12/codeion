
const User=require('../models/user');
const Post=require('../models/post');
const Comment=require('../models/comment');


// module.exports.create=function(req,res)
// {
//     Post.create({
//         content:req.body.content,//contents is passed with name content
//         user:req.user._id //not checking whether signed in or not
//     },function(err,post){
//             if(err){console.log('error in creating a post');return;}
//             return res.redirect('back');
//     });
// }

module.exports.create=async function(req,res)
{
    try{
   let post= await Post.create({
        content:req.body.content,//contents is passed with name content
        user:req.user._id //not checking whether signed in or not
    })

     
    
    
    
    // to check it is ajax form

        if(req.xhr){
             // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post Created!"
            });
        }


    req.flash('success','Post Published!')
    return res.redirect('back'); 

}catch(err){ 
   // added this to view the error on console as well
   console.log(err);
    return res.redirect('back'); 
}



}

// module.exports.destroy=function(req,res)
// {
//     Post.findById(req.params.id,function(err,post){

//     // .id means converting the object id into string otherwise it should bre ._id
//         if(post.user == req.user.id){
//             post.remove();

//             Comment.deleteMany({post:req.params.id},function(err){
//                 return res.redirect('back');
//             })
//         }
//         else{
//             return res.redirect('back');
//         }
//     })
// }







module.exports.destroy=async function(req,res)
{
    try{
        let post= await Post.findById(req.params.id);

        // .id means converting the object id into string otherwise it should bre ._id
            if(post.user == req.user.id){
                post.remove();
    
                await Comment.deleteMany({post:req.params.id});
                   


                if(req.xhr){
                    req.flash('success','Post and associated comments deleted!'); 
                    return res.status(200).json({
                        data:{
                            post_id:req.params.id
                        },
                        message:"Post deleted!"
                    });
                }


                    
                    return res.redirect('back');

                }
            
            else{
                req.flash('error','You can not delete this post!')
                return res.redirect('back');
            }
    }catch(err){
        req.flash('error',err); 
        return res.redirect('back');
    }
   
}