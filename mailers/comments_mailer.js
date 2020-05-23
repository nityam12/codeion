const nodeMailer=require('../config/nodemailer');


//this is another way of exporting a method like module.exports

exports.newComment = (comment) => {
//    console.log('inside newcomment mailer',comment);

    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
    
    nodeMailer.transporter.sendMail({
        from:'Codeial',
        to:comment.user.email,
        subject:"New Comment Published:",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending email',err);
            return;
    }

        // console.log("Message Sent",info);
        return;

    });
}



