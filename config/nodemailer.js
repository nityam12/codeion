const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const env = require('./environment');

const transporter = nodemailer.createTransport(env.smtp);

//relative path from where mail is to be sent
const renderTemplate = (data, relativePath) => {
  let mailHtml;
  //   console.log("*************");
  ejs.renderFile(
    path.join(__dirname, '../views/mailers', relativePath), //relative path fron=m this fn is called
    data,
    function (err, template) {
      //callback fn
      if (err) {
        console.log('error in rendering template', err);
        return;
      }
      mailHtml = template;
    }
  );

  return mailHtml;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
