module.exports.startchat = function (req, res) {
  if (req.xhr) {
    return res.status(200).json({
      name: req.params.name,
      email: req.params.email,
      chatroom: req.params.chatroom,
    });
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

  res.render('chat_box_master_room', {
    title: 'Chat App',
  });

  return {
    username,
    room,
  };
};
