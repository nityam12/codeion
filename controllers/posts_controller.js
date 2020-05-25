const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jimp = require('jimp');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

const POST_PATH = path.join('/uploads/users/posts_img');
// module.exports.create=function(req,res)
// {
//     Post.create({
//         content:req.body.content,//contents is passed with name content
//         user:req.user._id //not checking whether signed in or not
//     },function(err,post){
//             if(err){console.log('error in creating a post');return;}
//             return res.redirect('back');
//     });
// }
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

module.exports.uploadUserPhoto = upload.fields([{ name: 'images', maxCount: 3 }]);

module.exports.resizeUserPhoto = async (req, res, next) => {
  // console.log(req.files);

  try {
    console.log(req.body);
    console.log(req.files);
    if (!req.files.images) return next();
    // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    // const
    // conole.log(req.files.images);

    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `user-${req.user.id}-post-${Date.now()}-${i + 1}.jpeg`;
        // console.log(filename);
        const image = await jimp.read(file.buffer);
        image
          .resize(1000, 1000)

          .quality(95)

          .write(`assets/images/uploads/user_post_img/${filename}`);

        req.body.images.push(filename);
      })
    );
    next();
  } catch (err) {
    console.log('error', err);
  }
};

// module.exports.uploadpostpic = upload.fields([
//   { name: 'firstone', maxcount: 1 },
//   { name: 'images', maxcount: 3 },
// ]);

module.exports.create = async function (req, res) {
  try {
    // console.log(req.body);
    // console.log(req.body);
    let post = await Post.create({
      content: req.body.content, //contents is passed with name content
      user: req.user._id, //not checking whether signed in or not
      images: req.body.images,
    });

    // to check it is ajax form

    if (req.xhr) {
      // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
      post = await post.populate('user', 'name').execPopulate();
      return res.status(200).json({
        data: {
          post: post,
        },
        message: 'Post Created!',
      });
    }

    req.flash('success', 'Post Published!');
    return res.redirect('back');
  } catch (err) {
    // added this to view the error on console as well
    console.log(err);
    return res.redirect('back');
  }
};

// module.exports.destroy=function(req,res)
// {
//     Post.findById(req.params.id,function(err,post){

//     // .id means converting the object id into string otherwise it should bre ._id
//         if(post.user == req.user.id){
//             post.remove();

//             Comment.deleteMany({post:req.params.id},function(err){
//                 return res.redirect('back');
//             })
//         }
//         else{
//             return res.redirect('back');
//         }
//     })
// }

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    // .id means converting the object id into string otherwise it should bre ._id
    if (post.user == req.user.id) {
      // CHANGE :: delete the associated likes for the post and all its comments' likes too
      await Like.deleteMany({ likeable: post, onModel: 'Post' });
      await Like.deleteMany({ _id: { $in: post.Comments } });

      post.images.forEach(element => {
        if (fs.existsSync(path.join(__dirname, '../assets/images/uploads/user_post_img/', element))) {
          fs.unlinkSync(path.join(__dirname, '../assets/images/uploads/user_post_img/', element), function (err) {
            if (err) throw err;
          });
        }
      });
      



      post.remove();

      await Comment.deleteMany({ post: req.params.id });

      if (req.xhr) {
        req.flash('success', 'Post and associated comments deleted!');
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: 'Post deleted!',
        });
      }

      return res.redirect('back');
    } else {
      req.flash('error', 'You can not delete this post!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', err);
    return res.redirect('back');
  }
};
