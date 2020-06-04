// const queue = require('../config/kue');

// const commentMailer = require('../mailers/comments_mailer');

// //worker for this queue

// // emails her is name of queue and proces  fn is exec every time a job is added
// queue.process('emails', function (job, done) {
//   // console.log("email worker is processing a job",job.data);

//   commentMailer.newComment(job.data);

//   done();
// });
