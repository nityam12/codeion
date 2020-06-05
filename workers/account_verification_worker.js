const queue = require('../config/kue');

const AccountverLinkMailer = require('../mailers/user_account_auth_mailer');

//worker for this queue
// console.log("**********");
// emails her is name of queue and proces  fn is exec every time a job is added
queue.process('loginemail', 40, function (job, done) {
  // console.log("loginemail worker is processing a job",job.data);

  AccountverLinkMailer.accverify(job.data.url, job.data.email);

  done();
});
