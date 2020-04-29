const User= require('../models/user');

module.exports.profile = function(req, res) {
   return  res.render('user_profile', {
        title: "My Profile"
    });
};

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
    return res.redirect('/');
    
}



//sign-out
module.exports.destroySession=function(req,res){
    req.logout();//from passport service
    return res.redirect('/');
}
