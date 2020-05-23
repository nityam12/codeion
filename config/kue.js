const kue = require('kue');

const queue = kue.createQueue();
queue.watchStuckJobs();

module.exports = queue;
