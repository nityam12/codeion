const nodeMailer = require('../config/nodemailer');

//this is another way of exporting a method like module.exports

exports.recover = (resetURL, email) => {
  //    console.log('inside newcomment mailer',comment);

  // let url=

  let htmlString = nodeMailer.renderTemplate(
    { email: email, resetURL: resetURL },
    '/forgot_password/forgot_password.ejs'
  );

  nodeMailer.transporter.sendMail(
    {
      from: 'Codeial',
      to: email,
      subject: 'forgot password',
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log('Error in sending email', err);
        return;
      }

      // console.log("Message Sent",info);
      return;
    }
  );
};
