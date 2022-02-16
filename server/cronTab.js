var cron = require('node-cron');

var task = cron.schedule('*/5 * * * *', () =>  {
  console.log('will execute every minute until stopped');
});

task.stop();