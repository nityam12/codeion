//action for a controller
//as it is a object it must have a name -0home

const Post = require('../models/post');
const User = require('../models/user');

// module.exports.home = function(req, res) {
//     //console.log(req.cookies);
//    // res.cookie('user_id',25);

//     // Post.find({},function(err,posts){

//     //     return res.render('home', {
//     //         title: "Codeial | Home",
//     //         posts:posts
//     //     });

//     // });

//     //populate the user of each post
//     Post.find({})
//     .populate('user')
//     .populate({
//         path:'Comments',
//         populate:{
//             path:'user'
//         }
//     })

//     .exec(function(err,posts){

//       User.find({},function(err,users){
//         return res.render('home', {
//             title: "Codeial | Home",
//             posts:posts,
//             all_users:users
//         });

//     });

// })}

//module then.exports.actionName=function(req,res){};

//using then
//post.find({},populate('comments').then(funcytion())

// let posts=post.find({}).populate('comments').exec();
//exec simply means like then of promise
// posts.then(); executing promises

//using async await-imp

module.exports.home = async function (req, res) {
  try {
    //populate the user of each post

    let posts = await Post.find({})

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

    let users = await User.find({})
      .sort('-createdAt')
      .populate({
        path: 'friendships',
        populate: {
          path: 'from_user to_user',
        },
      });

    let personal = -1;
    if (req.user) {
      personal = await User.findById(req.user._id).populate({
        path: 'friendships',
        populate: {
          path: 'from_user to_user',
        },
      });
    }

    console.log(personal);

    //   let user= await User.findById(locals.user._id)

    return res.render('home', {
      title: 'Gameomania | Home',
      posts: posts,
      all_users: users,
      personal: personal,
    });
  } catch (err) {
    console.log('Error', err);
    return;
  }
};
