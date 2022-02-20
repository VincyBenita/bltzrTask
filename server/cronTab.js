var cron = require('node-cron');
var Q= require('q')
var request= require('request')

//cron scheduled to call the API every 5 min which adds messages to the queue. 
//The messages are then consumed and processed by the consumer.
cron.schedule('*/1 * * * *', () =>  {
  console.log("cron started")
  //start the producer
  startProducer().then(function(message){
    console.log("cron successfully ran")
  }).catch(function(err){
    console.log(err)
  })
});



var startProducer= function(){
  //initiate a deffered promise.
  var d= Q.defer()
  var options = {
    'method': 'POST',
    'url': 'http://localhost:8080/api/fetchAndProcessData/createJobToProcess',
    'headers': {
    }
  };
  request(options, function(error, response) {
      if (error) {
          console.log(error);
          d.reject(error)
      } else {
          d.resolve(response.body)
      }
  })
  return d.promise;
}