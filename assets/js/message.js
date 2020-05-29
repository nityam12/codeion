const generateMessage = (text, user_email, user_name, chatroom) => {
  return {
    text,
    user_email,
    chatroom,
    user_name,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (url, user_email, user_name, chatroom) => {
  return {
    url,
    user_email,
    chatroom,
    user_name,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
