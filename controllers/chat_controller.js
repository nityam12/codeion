const Room = require('../models/room');
const Chat = require('../models/chat');

module.exports.startchat = async function (req, res) {
  try {
    let room = await Room.findOne({ name: req.params.chatroom });
    let chat = await Chat.find({ room: room }).populate('sender', 'name email').populate('room');
    //   path: 'messages',
    //   populate: [
    //     {
    //       path: 'sender',
    //     },
    //     {
    //       path: 'room',
    //     },
    //   ],
    // });
    
  

    if (req.xhr) {
      return res.status(200).json({
        name: req.params.name,
        email: req.params.email,
        id1: req.params.id1,
        id2: req.params.id2,
        chatroom: req.params.chatroom,
      });
    }

    

  } catch (err) {
    console.log(err);
  }
};

module.exports.send = function (username, room) {
  return {
    username,
    room,
  };
};

module.exports.groupchat = function (req, res) {
  return res.render('_chat_box_master', {
    title: 'Chat App',
  });
};

module.exports.groupchatroom = function (req, res) {
  const username = req.body.username;
  const room = req.body.room;
  // send(username, room);
  // console.log(username, room);

  return res.render('chat_box_master_room', {
    title: 'Chat App',
  });
};
