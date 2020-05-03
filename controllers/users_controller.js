const User= require('../models/user');
const fs=require('fs');
const path=require('path');

//let's keep it same as before-one callback
module.exports.profile = function(req, res) {

    User.findById(req.params.id,function(err,user){
        return  res.render('user_profile', {
            title: "My Profile",
            profile_user:user
        });
    })
  
}

module.exports.update= async function(req,res)
{
    //alternate -way for req.body--->  {name:req.body.name,email:req.body.email};
    //
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         req.flash('success','Succesfully updated Details');
    //       return res.redirect('back');
    //     });

    // }else{
    //     req.flash('error','not authorized to update details');
    //     return res.status(401).send('unauthorized');//giving status
    // }

    if(req.user.id == req.params.id){
        try{

            let user= await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){

                if(err){console.log('*****-Multer:error',err)}


                    // console.log(req.file);
                    user.name=req.body.name;
                    user.email=req.body.email;
                    if(req.file){
                        
                        if(user.avatar)
                        {
                            if (fs.existsSync(path.join(__dirname,'..',user.avatar))) {
                                fs.unlinkSync(path.join(__dirname,'..',user.avatar),function(err){
                                    if (err) throw err;
                                });
                            }
                            
                        }

                        // this is saving the path of the uploaded file into the avatar field in the user

                        user.avatar=User.avatarPath+'/'+req.file.filename;

                    }
                        user.save();
                        return res.redirect('back');
            });

        }catch(err){
                req.flash('error',err);
                return res.redirect('back');

        }
     } else{
                 req.flash('error','not authorized to update details');
                 return res.status(401).send('unauthorized');//giving status
             }

}

//action for sin up
module.exports.signUp=function(req,res)
{
        if(req.isAuthenticated()){ // if already logged in redirect to profile 
           return  res.redirect('/users/profile');
        } 
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
}


module.exports.signIn=function(req,res)
{
    if(req.isAuthenticated()){ //passport functionallity
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    });
}


//get the sign up data
module.exports.create=function(req,res)
{
    if(req.body.password!=req.body.confirm_password){
        
        req.flash('error','password and confirm password does not match');
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(err,user){

        if(err)
        {   
            req.flash('error','error in finding user in signing up');
            console.log('error in finding user in signing up');
            return res.redirect('back');
        }

        if(!user){
            User.create(req.body,function(err,user){

                if(err)
                {
                    req.flash('error','error in signing up');
                    console.log('error in creating user in signing up');
                    return res.redirect('back');
                }
                req.flash('success','successfully account created');
                return res.redirect('/users/sign-in');
            });
           }
           else{
                req.flash('error','User already exist');
                return res.redirect('back');
           }

    });    


}

// sign in and create a session for the user
module.exports.createSession=function(req,res)
{

    req.flash('success','Logged in Successfully');
    return res.redirect('/');
    
}



//sign-out
module.exports.destroySession=function(req,res){
    req.logout();//from passport service
    req.flash('error','You have logged Out:');
    return res.redirect('/');
}
