var kue = require('kue');
var config= require('../../config/environment/index')

console.log("consumer is started")
var queue = kue.createQueue(config.redisConn);


queue.process("cryptopair_process", (job, done) => {
    console.log(job, "check what happened")
    done()
    // axios
    //   .get("https://jsonplaceholder.typicode.com/todos/" + job.data.data)
    //   .then(result => {
    //     console.log(result.data);
    //     done();
    //     return result.data;
    //   })
    //   .catch(error => done(error));
});