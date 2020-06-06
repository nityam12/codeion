const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('../assets/js/message.js');
const Room = require('../models/room');
const User = require('../models/user');
const Chat = require('../models/chat');
// //for backend
// //for receivin connection
// //first event-----connection

// module.exports.chatSockets = function(socketServer){

//     let io = require('socket.io')(socketServer);//now io has established for receiving connection

//     //here event is connection where in client side connect

//     //socket is an object with lot of properties of user sending   like
//     io.sockets.on('connection',function(socket){
//         console.log('new connection recived',socket.id);

//         socket.on('disconnect',function(){

//             console.log('socket disconnected');

//         });

//         socket.on('join_room',function(data){
//             console.log('joining request rec.',data);

//             socket.join(data.chatroom);

//             io.in(data.chatroom).emit('user_joined',data);//to emit from a particular room

//         });

//     });

// }

module.exports.chatSockets = function (socketServer) {
  let io = require('socket.io')(socketServer);

  io.sockets.on('connection', function (socket) {
    // console.log('new connection received', socket.id);

    socket.on('disconnect', function () {
      // console.log('socket disconnected!', socket.id);

      // socket.broadcast
      //   .to(data.chatroom)
      //   .emit(
      //     'receive_message',
      //     generateMessage(`${data.user_name} has left`, data.user_email, data.user_Name, data.chatroom)

      //
    });

    socket.on('join_room', async function (data) {
      try {
        let correctroom;
        const secondroom = data.chatroom.split('-');
        const bonusroom = secondroom[1] + '-' + secondroom[0];
        // console.log(data.chatroom);
        // console.log(bonusroom);
        const oldroom = await Room.findOne({ name: data.chatroom });
        const oldroom2 = await Room.findOne({ name: bonusroom });
        if (!oldroom && !oldroom2) {
          let newroom = await Room.create({
            name: data.chatroom,
          });
          const user = await User.findById(data.id1);
          newroom.users.push(user);
          await newroom.save({ validateBeforeSave: false });
          correctroom = newroom;
        } else {
          const user = await User.findById(data.id1);
          // console.log(user._id);
          let index;
          if (oldroom) {
            index = await oldroom.users.indexOf(user._id);
            // console.log(index);
            correctroom = oldroom;
          } else if (oldroom2) {
            index = await oldroom2.users.indexOf(user._id);
            // console.log(index);
            correctroom = oldroom2;
          }
          if (index != -1) {
            // console.log('already in room');
            await socket.join(correctroom.name);
            return;
          } else {
            correctroom.users.push(user);
            correctroom.save();
          }
        }

        // console.log('joining request rec.', data);
        // console.log(correctroom.name);
        // const usert = await User.findOne({ email: data.user_email });
        // const chat = await Chat.create({
        //   message: 'Welcome',
        //   sender: usert,
        //   room: correctroom,
        // });

        // correctroom.meassages.push(chat);
        // correctroom.save();

        await socket.emit(
          'receive_message',
          generateMessage('Welcome!', data.user_email, data.user_name, correctroom.name)
        );

        await socket.join(correctroom.name); //joining user to chat room

        // const chat2 = await Chat.create({
        //   message: `${data.user_name} has joined`,
        //   sender: usert,
        //   room: correctroom,
        // });
        // correctroom.meassages.push(chat2);
        // correctroom.save();

        await socket.broadcast
          .to(correctroom.name)
          .emit(
            'receive_message',
            generateMessage(`${data.user_name} has joined`, data.user_email, data.user_name, correctroom.name)
          );
        // io.in(data.chatroom).emit('user_joined', data);//this emit to all in room
        //socket.broadcast.emit() alternative
      } catch (err) {
        console.log(err);
      }
    });

    // CHANGE :: detect send_message and broadcast to everyone in the room
    socket.on('send_message', async function (data, callback) {
      try {
        const filter = new Filter();
        // console.log('send');
        if (filter.isProfane(data.message)) {
          return callback('profanity is not allowed!');
        }

        let correctroom;
        const secondroom = data.chatroom.split('-');
        const bonusroom = secondroom[1] + '-' + secondroom[0];
        const room = await Room.findOne({ name: data.chatroom });
        const room2 = await Room.findOne({ name: bonusroom });
        if (room) {
          correctroom = room;
        } else {
          correctroom = room2;
        }

        const user = await User.findOne({ email: data.user_email });
        let chat = await Chat.create({
          message: data.message,
          sender: user,
          room: correctroom,
        });
        correctroom.messages.push(chat);
        await correctroom.save({ validateBeforeSave: false });
        chat = await chat.populate('sender', 'name email').populate('room', 'messages users').execPopulate();
        console.log(chat);
        console.log(correctroom);
        await io
          .in(correctroom.name)
          .emit('receive_message', generateMessage(data.message, data.user_email, data.user_name, correctroom.name));
        callback();
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('sendlocation', async function (coords, callback) {
      try {
        let correctroom;
        const secondroom = coords.chatroom.split('-');
        const bonusroom = secondroom[1] + '-' + secondroom[0];
        const room = await Room.findOne({ name: coords.chatroom });
        const room2 = await Room.findOne({ name: bonusroom });
        if (room) {
          correctroom = room;
        } else {
          correctroom = room2;
        }
        await io
          .in(correctroom.name)
          .emit(
            'receive_location',
            generateLocationMessage(
              `https://google.com/maps?q=${coords.latitude},${coords.longitude} `,
              coords.userEmail,
              correctroom.name
            )
          );
        callback();
      } catch (err) {
        console.log(err);
      }
    });
  });
};
