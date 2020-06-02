const passport = require('passport');

const JWTStrategy = require('passport-jwt').Strategy;

const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const env = require('./environment');

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt_secret, //this  is encryption key -specifically here decryption key
};

passport.use(
  new JWTStrategy(opts, function (jwtPayload, done) {
    User.findById(jwtPayload._id, function (err, user) {
      if (err) {
        console.log('error in finding user from jwt');
        return;
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        //false means user not found
      }
    });
  })
);

module.exports = passport;
