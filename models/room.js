const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    name: { type: String, lowercase: true, unique: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
