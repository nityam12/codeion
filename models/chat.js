const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
      // you can add any other properties to the message here.
      // for example, the message can be an image ! so you need to tweak this a little
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    // if you want to make a group chat, you can have more than 2 users in this array
    users: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    read: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', MessageSchema);

module.exports = Chat;
