const autoscroll = (chatBoxId) => {
  // New message element$('#chat-messages-list')
  const $messages = document.getElementById('chat-messages-list');
  const $newMessage = $messages.lastElementChild;

  console.log($newMessage);
  // Height of the new message
  const newMessageStyles = window.getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

class ChatEngine {
  constructor(chatBoxId, userEmail, userName, id1, id2, chatroom) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;
    this.userName = userName;
    this.id1 = id1;
    this.id2 = id2;
    this.socket = io.connect('http://54.83.172.113:5000');
    // this.socket = io({
    //   connect: 'http://localhost:5000',
    //   transports: ['websocket'],
    // });
    this.chatBoxId = chatBoxId;
    this.chatroom = chatroom;
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
        chatroom: self.chatroom,
        user_name: self.userName,
        id1: self.id1,
        id2: self.id2,
      });

      self.socket.on('user_joined', function (data) {
        console.log('a user joined!', data);
      });
    });

    // CHANGE :: send a message on clicking the send message button
    $('#send-message').click(function () {
      const psself = $(this);

      const msg = $('#chat-message-input').val();
      $('#chat-message-input').val('');
      psself.attr('disabled', true);
      if (msg != '') {
        self.socket.emit(
          'send_message',
          {
            message: msg,
            user_email: self.userEmail,
            chatroom: self.chatroom,
            user_name: self.userName,
          },
          (error) => {
            psself.attr('disabled', false);
            $('#chat-message-input').focus();
            if (error) {
              console.log(error);
            }

            console.log(' Message delivered!');
          }
        );
      } else {
        psself.attr('disabled', false);
      }
    });

    self.socket.on(
      'receive_message',
      function (data) {
        console.log('message received', data.text);

        let newMessage = $('<li>');

        let messageType = 'other-message';

        if (data.user_email == self.userEmail) {
          messageType = 'self-message';
        }

        newMessage.append(
          $('<span>', {
            html: data.text,
          })
        );

        newMessage.prepend(
          $('<sup>', {
            html: data.user_name,
          })
        );

        newMessage.append(
          $('<sub>', {
            html: moment(data.createdAt).format('h:mm a'),
          })
        );

        newMessage.addClass(messageType);

        $('#chat-messages-list').append(newMessage);
        autoscroll(self.chatBoxId);
      },
      (error) => {
        if (error) {
          console.log(error);
        }
        console.log(' Message received!');
      }
    );

    $('#share-location').click(function () {
      const psself = $(this);
      if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
      }
      psself.attr('disabled', true);
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
          self.socket.emit(
            'sendlocation',
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              user_email: self.userEmail,
              chatroom: self.chatroom,
              user_name: self.user_name,
            },
            () => {
              psself.attr('disabled', false);
              console.log('Location shared');
            }
          );
        });
      }

      function getGeolocation() {
        navigator.geolocation.getCurrentPosition(success, error);
      }

      //   self.socket.on('userlocation', function (location) {
      //     console.log(location.latitude, location.longitude, location.user_email, location.chatroom);
      //   });
    });

    self.socket.on('receive_location', function (data) {
      console.log('location received', data.message);

      let newMessage = $('<li>');

      let messageType = 'other-message';

      if (data.user_email == self.userEmail) {
        messageType = 'self-message';
      }

      const link = $('<a>My Current Location</a>');

      link.attr('href', data.url);
      link.attr('target', '_blank');

      newMessage.append(
        $('<span>', {
          html: link,
        })
      );

      newMessage.prepend(
        $('<sup>', {
          html: data.user_email,
        })
      );

      newMessage.append(
        $('<sub>', {
          html: moment(data.createdAt).format('h:mm a'),
        })
      );

      newMessage.addClass(messageType);

      $('#chat-messages-list').append(newMessage);
      autoscroll(self.chatBoxId);
    });
  }
}

// $('.chat-button').click((e) => {
//   // e.preventDefault();

//   $('#user-chat-box').css('display', 'block');

// });
