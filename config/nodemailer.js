const nodemailer=require("nodemailer");
const ejs=require('ejs');
const path=require('path');





let transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'nityam1050@gmail.com', // generated ethereal user
      pass: 'Nvidia1050' // generated ethereal password
      //activate in gmail "less secure app" option
    }
  });

//relative path from where mail is to be sent
  let renderTemplate = (data,relativePath) => {
      let mailHtml;
    //   console.log("*************");
      ejs.renderFile(
          path.join(__dirname,'../views/mailers',relativePath), //relative path fron=m this fn is called
          data,
          function(err,template){ //callback fn
              if(err)
              {
                  console.log("error in rendering template",err);
                  return;
              }
              mailHtml=template;
          }
      )

      return mailHtml;
  }



  module.exports={
      transporter:transporter,
      renderTemplate:renderTemplate
  }
