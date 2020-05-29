const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('../assets/js/message.js');
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
    console.log('new connection received', socket.id);

    socket.on('disconnect', function () {
      console.log('socket disconnected!');
      // socket.broadcast
      //   .to(data.chatroom)
      //   .emit(
      //     'receive_message',
      //     generateMessage(`${data.user_name} has left`, data.user_email, data.user_Name, data.chatroom)
      //   );
    });

    socket.on('join_room', function (data) {
      console.log('joining request rec.', data);

      socket.emit('receive_message', generateMessage('Welcome!', data.user_email, data.user_name, data.chatroom));
      socket.join(data.chatroom); //joining user to chat room

      socket.broadcast
        .to(data.chatroom)
        .emit(
          'receive_message',
          generateMessage(`${data.user_name} has joined`, data.user_email, data.user_name, data.chatroom)
        );
      // io.in(data.chatroom).emit('user_joined', data);//this emit to all in room
      //socket.broadcast.emit() alternative
    });

    // CHANGE :: detect send_message and broadcast to everyone in the room
    socket.on('send_message', function (data, callback) {
      const filter = new Filter();

      if (filter.isProfane(data.message)) {
        return callback('profanity is not allowed!');
      }
      io.in(data.chatroom).emit('receive_message', generateMessage(data.message, data.user_email,data.user_name, data.chatroom));
      callback();
    });

    socket.on('sendlocation', function (coords, callback) {
      io.in(coords.chatroom).emit(
        'receive_location',
        generateLocationMessage(
          `https://google.com/maps?q=${coords.latitude},${coords.longitude} `,
          coords.userEmail,
          coords.chatroom
        )
      );
      callback();
    });
  });
};
