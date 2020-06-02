const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    // you can add any other properties to the message here.
    // for example, the message can be an image ! so you need to tweak this a little

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', MessageSchema);

module.exports = Chat;
