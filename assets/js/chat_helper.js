

class Chatter {
  constructor(chatElement) {
    this.chats = chatElement;
    this.activate();
  }

  activate() {
    $(this.chats).click(function (e) {
      e.preventDefault();
      let self = this;

      // this is a new way of writing ajax which you might've studied, it looks like the same as promises
      $.ajax({
        type: 'POST',
        url: $(self).attr('href'),
      })
        .done(function (data) {

            $('#user-chat-box').css('display', 'block');
   
          new ChatEngine('user-chat-box', data.email, data.name, data.chatroom);
          // new Noty({
          //     theme: 'relax',
          //     text: "liked",
          //     type: 'success',
          //     layout: 'topRight',
          //     timeout: 1500
          // }).show();
        })
        .fail(function (errData) {
          console.log('error in completing the request');
        });
    });
  }
}
