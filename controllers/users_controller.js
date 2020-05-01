const User= require('../models/user');

//let's keep it same as before-one callback
module.exports.profile = function(req, res) {

    User.findById(req.params.id,function(err,user){
        return  res.render('user_profile', {
            title: "My Profile",
            profile_user:user
        });
    })
  
}

module.exports.update=function(req,res)
{
    //alternate -way for req.body--->  {name:req.body.name,email:req.body.email};
    //
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
return res.redirect('back');
        });

    }else{
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
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(err,user){

        if(err)
        {
            console.log('error in finding user in signing up');
            return;
        }

        if(!user){
            User.create(req.body,function(err,user){

                if(err)
                {
                    console.log('error in creating user in signing up');
                    return;
                }

                return res.redirect('/users/sign-in');
            });
           }
           else{
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
