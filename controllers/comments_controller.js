const Comment=require('../models/comment');
const Post=require('../models/post');

const commentMailer=require('../mailers/comments_mailer');
const queue=require('../config/kue');
const commentEmailWorker=require('../workers/comment_email_worker');
const Like = require('../models/like');

// module.exports.create=function(req,res){
//     Post.findById(req.body.post,function(err,post){

//         if(post)
//         {
//             Comment.create({
//                 content:req.body.content,
//                 post:req.body.post,
//                 user:req.user._id //check
//             },function(err,comment){
//                 //handle error

//                 post.Comments.push(comment);
//                 post.save();//must be done after each update 

//                 res.redirect('back');
//             });
//         }
//     });
// }

module.exports.create=async function(req,res){

   try{
    let post= await Post.findById(req.body.post);

    if(post)
    {
        let comment= await Comment.create({
            content:req.body.content,
            post:req.body.post,
            user:req.user._id //check
        });
           

            post.Comments.push(comment);
            post.save();//must be done after each update 

// console.log(req.xhr);

        comment = await comment.populate('user', 'name email').execPopulate();
        // commentMailer.newComment(comment);

       let job=queue.create('emails',comment).save(function(err){
            if(err)
            {
                console.log('error in creating a queue',err);
                return;
            }

            console.log('job enqued',job.id);
        })

            if (req.xhr){
                // Similar for comments to fetch the user's id!
                 
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }



            req.flash('success','Commented Successfully!');
            res.redirect('back');
     
        }

   }catch(err){
    req.flash('error',err);
    return;  
   }
  
        
}


// module.exports.destroy=function(req,res)
// {
//     Comment.findById(req.params.id,function(err,comment){
//           if(comment.user == req.user.id)
//           {
//                 let postId=Comment.post;


//                 comment.remove();

//                 Post.findByIdAndUpdate(postId,{$pull: {Comments:req.params.id}},function(err,post){    //removed from comments array

//                     return res.redirect('back');
                    
//                 });
                
                
//            }
//            else{
//                return res.redirect('back');
//            }

//         });



//  }

 module.exports.destroy= async function(req,res)
{
    try{
        let comment= await Comment.findById(req.params.id);
          if(comment.user == req.user.id)
          {
                let postId= comment.post;


                 comment.remove();

                let post= await Post.findByIdAndUpdate(postId,{$pull: {Comments:req.params.id}});    //removed from comments array
                // send the comment id which was deleted back to the views

                // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

                req.flash('success','Comment Deleted Successfully!');
                 return  res.redirect('back');
                    
          }

           else{
            req.flash('error','Permission Denied!!');
               return res.redirect('back');
           }

    } catch(err)
     {
        req.flash('error',err);
        return;
     }
   
}      


 


