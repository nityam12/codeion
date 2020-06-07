const queue = require('../config/kue');

const ResetLinkMailer = require('../mailers/reset_password_mailer');

//worker for this queue

// emails her is name of queue and proces  fn is exec every time a job is added
queue.process('resetemail', function (job, done) {
  console.log("resetemail worker is processing a job",job.data);

  ResetLinkMailer.recover(job.data.resetURL, job.data.email);

  done();
});
