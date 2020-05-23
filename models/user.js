const crypto = require('crypto');

const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const { Console } = require('console');
const AVATAR_PATH = path.join('/uploads/users/avatars');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// const sharp = require('sharp');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please Provide valid email'],
    },
    password: {
      type: String,
      required: [true, 'please provide a password'],
      minlength: 8,
      Select: false,
    },
    name: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    avatar: {
      type: String,
      default: `${AVATAR_PATH}/default.jpeg`,
    },
    friendships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friendship',
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    acountVerifyToken: String,
    accountVerifyExpires: Date,
    isActive: {
      type: Boolean,
      default: false,
      //   select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

//instance method available for multiple documents for a collection
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    // cb(null, file.fieldname + '-' + Date.now());
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(req.flash('error', 'Please upload only images.'), false);
  }
};

// userSchema.methods.resizeUserPhoto = function (req) {

//   req.file.filename
//   sharp(req.file.buffer).resize(800, 800).toFormat('jpeg').jpeg({ quality: 90 });

// };
//forgot pass
//instance method
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // console.log({ resetToken }, this.passwordResetTo/ken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createAccountVerifyToken = function () {
  const verifyToken = crypto.randomBytes(32).toString('hex');

  this.acountVerifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');

  // console.log({resetToken},this.passwordResetToken);

  this.accountVerifyExpires = Date.now() + 20 * 60 * 1000;

  return verifyToken;
};

//static methods

userSchema.statics.uploadedAvatar = multer({ storage: storage, fileFilter: multerFilter }).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema); //telling mongoose this is a model --collection

module.exports = User;
