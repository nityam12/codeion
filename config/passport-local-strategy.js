const passport=require('passport');


const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/user');
//TELL PASSPORT TO USE LOCAL STRATEGY

//authentication using passport
passport.use(new LocalStrategy({
      
    usernameField:'email',
    passReqToCallback:true  // as it has no ref to req
},
function(req,email,password,done){ //done is callback fn returning to passport/js

        User.findOne({email:email},function(err,user){
            if(err)
            {
                req.flash('error',err);
                return done(err);
            }

            if(!user || user.password!=password){
                
                req.flash('error','Invalid Username/Password');
                return done(null,false);//one for err & other for unsuccessful authentication
            }

            if(user.isActive==false)
            {
                req.flash('error','Please Verify Your Account');
                return done(null,false);//one for err & other for unsuccessful authentication
            }
                return done(null,user);//first one is err-null  sec-user
        });

    }

)); //problem

//serializing the user to decide which key  is to be kept in the cookies


//server->browser

passport.serializeUser(function(user,done){
    done(null,user.id);
});









//deserializing the user from the key in the cookies 
//browser->server

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err)
        {
            console.log('Error in finding user --> pasport');
            return done(err);
        }
        return done(null,user);
    });
});


//check if the user is authenticated
passport.checkAuthentication=function(req,res,next){

 // if the user is signed in,then pass on the request to the next func (controllers action).
  
    if(req.isAuthenticated()){
        return next();
    }



    //if the user is not signed in
    return res.redirect('/users/sign-in');

}

//set the user for view
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session  and  we are just sending this to the locals for the views
        res.locals.user=req.user;
    }
    next();
}







module.exports=passport;



//uses session cookie