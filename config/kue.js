const kue = require('kue');

const queue = kue.createQueue();
queue.setMaxListeners(queue.getMaxListeners() + 1);
queue.watchStuckJobs();

module.exports = queue;
