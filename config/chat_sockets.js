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
    });

    socket.on('join_room', function (data) {
      console.log('joining request rec.', data);

      socket.join(data.chatroom); //joining user to chat room

      io.in(data.chatroom).emit('user_joined', data);
    });

    // CHANGE :: detect send_message and broadcast to everyone in the room
    socket.on('send_message', function (data) {
      io.in(data.chatroom).emit('receive_message', data);
    });
  });
};
