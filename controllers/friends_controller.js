const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');
const Friendship = require('../models/friendship');
const User = require('../models/user');

module.exports.makefriend = async function (req, res) {
  try {
    let user_from_id = req.query.from;
    let user_to_id = req.query.to;

    let friend_status = true;
    let requesting_user = await User.findById(user_from_id).populate('friendship');
    let target_user = await User.findById(user_to_id).populate('friendship');

    let friend1 = await Friendship.findOne({
      from_user: user_from_id,
      to_user: user_to_id,
    });

    let friend2 = await Friendship.findOne({
      from_user: user_to_id,
      to_user: user_from_id,
    });

    console.log(friend2, friend1);

    if (friend1 || friend2) {
      if (friend1) {
        requesting_user.friendships.pull(friend1._id);
        requesting_user.save();
        target_user.friendships.pull(friend1._id);
        target_user.save();
        friend1.remove();
      } else {
        requesting_user.friendships.pull(friend2._id);
        requesting_user.save();
        target_user.friendships.pull(friend2._id);
        target_user.save();
        friend2.remove();
      }

      friend_status = false;
    } else {
      let newFriend = await Friendship.create({
        from_user: user_from_id,
        to_user: user_to_id,
      });

      requesting_user.friendships.push(newFriend._id);
      requesting_user.save();
      target_user.friendships.push(newFriend._id);
      target_user.save();
    }

    return res.status(200).json({
      data: {
        friend_status: friend_status,
      },
      message: 'request successful',
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: 'Internal server error',
    });
  }
};
