const nodeMailer = require('../config/nodemailer');

//this is another way of exporting a method like module.exports

exports.accverify = (url, email) => {
  //    console.log('inside newcomment mailer',comment);

  // let url=

  let htmlString = nodeMailer.renderTemplate(
    { email: email, url: url },
    '/account_verification/account_verification.ejs'
  );

  nodeMailer.transporter.sendMail(
    {
      from: 'Gameomania 👥 <gameomania-roxz.ddns.net>',
      to: email,
      subject: 'Account Activation',
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
