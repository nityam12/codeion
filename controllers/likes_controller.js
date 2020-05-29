const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function (req, res) {
  try {
    //likes/toggle/?id=abcde&type=Post

    let likeable;
    let deleted = false;
    // console.log(req.query);
    if (req.query.type == 'Post') {
      likeable = await Post.findById(req.query.id).populate('likes');
    } else {
      likeable = await Comment.findById(req.query.id).populate('likes');
    }

    //check if a like already exist
    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id, //it use locals currently logged in user from req for authenticated user
      //only logged in authenticated user will be allowed
    });

    //if a like already exist then delete it
    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();

      existingLike.remove();
      deleted = true;
    } else {
      //else make a new like
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });

      likeable.likes.push(newLike._id);
      likeable.save();
    }

    return res.json(200, {
      message: 'request Successfull!',
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: 'Internal server error',
    });
  }
};
