module.exports.startchat = function (req, res) {
  if (req.xhr) {
    return res.status(200).json({
      name: req.params.name,
      email: req.params.email,
      chatroom: req.params.chatroom,
    });
  }
};
