const multer = require('multer');
const jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const passwordValidator = require('password-validator');
const queue = require('../config/kue');
const User = require('../models/user');
const Post = require('../models/post');
const ResetWorker = require('../workers/password_reset_worker');
const AccountVerifier = require('../workers/account_verification_worker');
const AVATAR_PATH = path.join('/uploads/users/avatars');

let test = new passwordValidator();

test
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits() // Must have digits
  .has()
  .not()
  .spaces() // Should not have spaces
  // .symbols()
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123']); // Blacklist these values

//let's keep it same as before-one callback
module.exports.profile = async function (req, res) {
  try {
    const posts = await Post.find({ user: req.params.id })
      .sort('-createdAt') //in this way data is stored in mongo db
      .populate('user')
      .populate({
        path: 'Comments',
        populate: {
          path: 'user likes',
        },

        //   problem here  likes of comment not populated
      })
      .populate('likes');
    const user = await User.findById(req.params.id);
    // console.log(posts);
    return res.render('user_profile', {
      title: 'My Profile',
      profile_user: user,
      posts: posts,
    });
  } catch (err) {
    console.log('error', err);
  }
};

module.exports.updatepassword = async function (req, res) {
  try {
    const user = await User.findById(req.params.id).select('+password');
    if (!user || req.user.id !== req.params.id) {
      req.flash('error', 'not authorized to change password');
      return res.redirect('back');
    }

    if (!(await user.correctPassword(req.body.currentpassword, user.password))) {
      req.flash('error', 'Password is not Correct');
      return res.redirect('back');
    }
    // console.log(req.body.currentpassword, req.body.newpassword);
    user.password = req.body.newpassword;
    await user.save();
    req.flash('success', 'Password changed successfully');
    return res.redirect('back');
  } catch (err) {
    console.log('error', err);
  }
};

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(req.flash('error', 'Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

module.exports.uploadUserPhoto = upload.single('avatar');

module.exports.resizeUserPhoto = async (req, res, next) => {
  try {
    if (!req.file) return next();
    // console.log(req.body);
    // console.log(req.file);
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    const image = await jimp.read(req.file.buffer);
    image
      .resize(800, 800)

      .quality(90)

      .write(`uploads/users/avatars/${req.file.filename}`);

    next();
  } catch (err) {
    console.log('error', err);
  }
};

module.exports.update = async function (req, res) {
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
  try {
    // console.log('55555555555555555555555555');
    if (req.body.password) {
      req.flash('error', 'Sorry password cannot be changed');
      return res.redirect('back');
    }

    if (req.user.id === req.params.id) {
      const user = await User.findById(req.params.id);
      // User.uploadedAvatar(req, res, function (err) {
      //   if (err) {
      //     console.log('*****-Multer:error', err);
      //   }

      // console.log(req.file);
      if (req.body.about !== '') user.about = req.body.about;

      user.name = req.body.name;
      user.email = req.body.email;
      if (req.file) {
        if (user.avatar) {
          if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {
            fs.unlinkSync(path.join(__dirname, '..', user.avatar), function (err) {
              if (err) throw err;
            });
          }
        }

        // this is saving the path of the uploaded file into the avatar field in the user

        user.avatar = User.avatarPath + '/' + req.file.filename;
      }
      user.save();
      req.flash('success', 'Info Updated successfully');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', err);
    req.flash('error', 'not authorized to update details');
    return res.redirect('back');
  }
};
// else {
//   // req.flash('error', 'not authorized to update details');
//   // return res.status(401).send('unauthorized'); //giving status
// }

//action for sin up
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    // if already logged in redirect to profile
    return res.redirect('/users/profile');
  }
  return res.render('user_sign_up', {
    title: 'Codeial | Sign Up',
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    //passport functionallity
    return res.redirect('/users/profile');
  }
  return res.render('user_sign_in', {
    title: 'Codeial | Sign In',
  });
};

//get the sign up data
module.exports.create = async function (req, res) {
  try {
    if (req.body.password !== req.body.confirm_password) {
      req.flash('error', 'password and confirm password does not match');
      return res.redirect('back');
    }

    if (!test.validate(req.body.password)) {
      req.flash('error', 'please choose a strong password | space not allowed');
      return res.redirect('back');
    }

    let olduser = await User.findOne({ email: req.body.email });

    if (olduser) {
      req.flash('error', 'User already exist');
      return res.redirect('back');
    }

    let user = await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    });

    if (!user) {
      req.flash('error', 'error in signing up');
      console.log('error in creating user in signing up');
      return res.redirect('back');
    }

    const verifyToken = user.createAccountVerifyToken();

    await user.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get('host')}/users/verify/${verifyToken}`;

    let job = await queue
      .create('loginemail', { url: url, email: req.body.email })
      .priority('high')
      .attempts(5)
      .save(function (err) {
        if (err) {
          console.log('error in creating a queue', err);
          return;
        }

        console.log('job enqued', job.id);
      });

    req.flash('success', 'successfully account created');
    req.flash('success', 'verify your account from your email');
    return res.redirect('/users/sign-in');
  } catch (err) {
    console.log('error', err);
    // user.acountVerifyToken = undefined;
    // user.accountVerifyExpires = undefined;
    // await user.save({ validateBeforeSave: false });
    req.flash('error', 'There was an error sending the email.Try again later!');
    return res.redirect('/users/sign-up');
  }
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in Successfully');
  return res.redirect('/');
  // return res.redirect('/users/forgot_passp');
};

//sign-out
module.exports.destroySession = function (req, res) {
  req.logout(); //from passport service
  req.flash('error', 'You have logged Out:');
  return res.redirect('/');
};

module.exports.forgotpage = function (req, res) {
  return res.render('forgot_page', {
    title: 'forgot password',
  });
};

module.exports.forgotpage2 = function (req, res) {
  return res.render('forgot_page2', {
    title: 'Change password',
  });
};

module.exports.forgotPassword = async function (req, res, next) {
  //1-> get user based on posted email
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // return next(new AppError('there is no user with this email adddress.',404));
      console.log('there is no user with this email adddress.');
      req.flash('error', 'there is no user with this email adddress.');
      return res.redirect('back');
    }

    //2->generate the random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;

    let job = await queue.create('resetemail', { resetURL: resetURL, email: user.email }).save(function (err) {
      if (err) {
        console.log('error in creating a queue', err);
        return;
      }

      console.log('job enqued', job.id);
    });

    req.flash('success', 'Reset link sent to your email');
    return res.redirect('/users/sign-in');
  } catch (err) {
    console.log('Error', err);
    user.PasswordResetToken = undefined;
    user.PasswordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    req.flash('error', 'There was an error sending the email.Try again later!');

    return res.redirect('/users/sign-in');
  }

  //3->send it to user's email
};

module.exports.resetPassword = async function (req, res, next) {
  // 1) gET USER BASED UPON TOKEN
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    console.log(req.params.token, hashedToken);

    const user = await User.findOne({
      passwordResetToken: hashedToken,

      passwordResetExpires: { $gt: Date.now() },
      // sort: { 'created_at' : -1 }
    });

    //2 if the token has not expired, and there is user set the new password

    if (!user) {
      req.flash('error', 'Token has expired or is invalid');
      return res.redirect('/users/sign-in');
    }

    return res.render('forgot_page2', {
      title: 'Change password',
      Token: hashedToken,
    });

    // if(req.body.confirm_password == req.body.password){
    // user.password = req.body.password;
    // user.PasswordResetExpires=undefined;
    // user.PasswordResetToken=undefined;
    // await user.save();
    // req.flash("success","Password changed successfully");
    // req.flash("success","Login Again");
    // return res.redirect('/users/sign-in');
    // }
    // else{
    //      req.flash("error","Password and confirm password doesn't match");
    //     return res.redirect('back');
    // }
  } catch (err) {
    console.log('Error', err);
    // user.PasswordResetToken = undefined;
    // user.PasswordResetExpires = undefined;
    // await user.save({validateBeforeSave:false});
    // req.flash('error','There was an error sending the email.Try again later!');

    // return res.redirect('/users/sign-in');
  }

  //3 update changedPasswordAt property for the user

  //4 log the user in ,send jwt
};

module.exports.resetPassword2 = async function (req, res, next) {
  try {
    // const hashedToken = crypto
    // .createHash('sha256')
    // .update(req.params.token)
    // .digest('hex');

    console.log(req.params.token);

    const user = await User.findOne({
      passwordResetToken: req.params.token,

      passwordResetExpires: { $gt: Date.now() },
      // sort: { 'created_at' : -1 }
    });

    //2 if the token has not expired, and there is user set the new password

    if (!user) {
      req.flash('error', 'Token has expired or is invalid');
      return res.redirect('/users/sign-in');
    }

    if (req.body.confirm_password == req.body.password) {
      user.password = req.body.password;
      user.PasswordResetExpires = undefined;
      user.PasswordResetToken = undefined;
      await user.save();
      req.flash('success', 'Password changed successfully');
      req.flash('success', 'Login Again');
      return res.redirect('/users/sign-in');
    } else {
      req.flash('error', "Password and confirm password doesn't match");
      return res.redirect('back');
    }
  } catch (err) {
    console.log('Error', err);
  }
};

module.exports.verifyAccount = async function (req, res) {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    console.log(req.params.token, hashedToken);

    const user = await User.findOne({
      acountVerifyToken: hashedToken,

      accountVerifyExpires: { $gt: Date.now() },
      // sort: { 'created_at' : -1 }
    });

    if (!user) {
      req.flash('error', 'Token has expired or is invalid');
      return res.redirect('/users/sign-up');
    }

    user.isActive = true;
    user.acountVerifyToken = undefined;
    user.accountVerifyExpires = undefined;
    await user.save();
    req.flash('success', 'Account Verified');
    req.flash('success', 'Login Again');
    return res.redirect('/users/sign-in');
  } catch (err) {
    console.log('error', err);
  }
};
