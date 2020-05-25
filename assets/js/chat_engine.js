class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;

    this.socket = io.connect('http://localhost:5000');

    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    let self = this;

    this.socket.on('connect', function () {
      console.log('connection established using sockets...!');

      self.socket.emit('join_room', {
        user_email: self.userEmail,
        chatroom: 'codeial',
      });

      self.socket.on('user_joined', function (data) {
        console.log('a user joined!', data);
      });
    });

    // CHANGE :: send a message on clicking the send message button
    $('#send-message').click(function () {
      let msg = $('#chat-message-input').val();

      if (msg != '') {
        self.socket.emit('send_message', {
          message: msg,
          user_email: self.userEmail,
          chatroom: 'codeial',
        });
      }
    });

    self.socket.on('receive_message', function (data) {
      console.log('message received', data.message);

      let newMessage = $('<li>');

      let messageType = 'other-message';

      if (data.user_email == self.userEmail) {
        messageType = 'self-message';
      }

      newMessage.append(
        $('<span>', {
          html: data.message,
        })
      );

      newMessage.append(
        $('<sub>', {
          html: data.user_email,
        })
      );

      newMessage.addClass(messageType);

      $('#chat-messages-list').append(newMessage);
    });

    $('#share-location').click(function () {
      if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
      }

      getGeolocation();

      function error(err) {
        console.error(`ERROR(${error.code}): ${err.message}`);
      }

      function success(position) {
        // alert(`latitude: ${pos.coords.latitude}
        //     \n longitude: ${pos.coords.longitude}
        //     \n accuracy: ${pos.coords.accuracy}`);
        navigator.geolocation.getCurrentPosition((position) => {
          // console.log('232');
          self.socket.emit('sendlocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            user_email: self.userEmail,
            chatroom: 'codeial',
          });
        });
      }
      
      function getGeolocation() {
        navigator.geolocation.getCurrentPosition(success, error);
      }

      //   self.socket.on('userlocation', function (location) {
      //     console.log(location.latitude, location.longitude, location.user_email, location.chatroom);
      //   });
    });
  }
}
