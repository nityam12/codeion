const passport=require('passport');


const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/user');
//TELL PASSPORT TO USE LOCAL STRATEGY

//authentication using passport
passport.use(new LocalStrategy({
      
    usernameField:'email'
},function(email,password,done){ //done is callback fn returning to passport/js

        User.findOne({email:email},function(err,user){
            if(err)
            {
                console.log('Error in finding user --> pasport');
                return done(err);
            }

            if(!user || user.password!=password){
                console.log("Invali Ussername/Password");
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

passport.deserializeUser(functione(id,done){
    User.findOne({email:email},function(err,user){
        if(err)
        {
            console.log('Error in finding user --> pasport');
            return done(err);
        }
        return done(null,user);
    });
});


module.exports=passport;
