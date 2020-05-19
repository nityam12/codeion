const crypto = require('crypto');

const mongoose=require('mongoose');

const multer=require('multer');
const path=require('path');
const { Console } = require('console');
const AVATAR_PATH=path.join('/uploads/users/avatars');
const validator = require('validator');


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please Provide valid email']
    },
    password:{
        type:String,
        required:[true,'please provide a password'],
        minlength:8
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    friendships:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Friendship'
        }
    ],
    passwordResetToken:String,
    passwordResetExpires:Date,
    acountVerifyToken:String,
    accountVerifyExpires:Date,
    isActive:{
        type:Boolean,
        default:false,
        select:false
    }
},{
    timestamps:true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });


//forgot pass
//instance method
userSchema.methods.createPasswordResetToken = function() {

    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken},this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10*60*1000;

    return resetToken;
};

userSchema.methods.createAccountVerifyToken = function() {

    const verifyToken = crypto.randomBytes(32).toString('hex');

    this.acountVerifyToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');

    // console.log({resetToken},this.passwordResetToken);

    this.accountVerifyExpires = Date.now() + 20*60*1000;

    return verifyToken;
};

  //static methods

  userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');
  userSchema.statics.avatarPath=AVATAR_PATH;


const User=mongoose.model('User',userSchema);//telling mongoose this is a model --collection


module.exports=User;