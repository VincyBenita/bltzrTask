var kue = require('kue');
var config= require('../../config/environment/index')
var request= require('request')
var Q= require('q')
var async= require('async')
var _= require('lodash');
var ProcessedData= require('./processedData.model')
console.log("consumer is started")
var queue = kue.createQueue(config.redisConn);

//for better performance we could host the consumer.js file seperately on a different server.

queue.process("cryptopair_process", (job, done) => {
    async.waterfall([
        function(wcb){
            fetchMarketData(job.data).then(function(marketData){
                marketData= JSON.parse(marketData)
                if(marketData && _.size(marketData)){
                    return wcb(null, marketData)
                }
                else{
                    console.log("no market data available")
                    done()
                }
            }).catch(function(err){
                return wcb(err)
            })
        },
        function(marketData,wcb){
            analyseAndSaveMarketData(marketData, job.data).then(function(consolidatedData){
                wcb(null, consolidatedData)
            }).catch(function(err){
                return wcb(err)
            })
        }
    ],function(err,result){
        if(err){
            done(err)
        }
        done()
        return result;
    })
});

var fetchMarketData= function(arg){
    var d= Q.defer()
    request('https://api.wazirx.com/api/v2/trades?market='+ arg.pairName, function(error, response, body) {
        if (error) {
            console.log(error);
            d.reject(error)
        } else {
            d.resolve(body)
        }
    })
    return d.promise;
}

var analyseAndSaveMarketData= function(marketData, arg){
    var d= Q.defer()
    var consolidatedData={avgPrice:0, hourlyAvgPrice: {}, pairName: arg.pairName}
    var totalPrice=0
    _.forEach(marketData, function(data){
        console.log(data)
        if(data.created_at!=null){
            var hour= new Date(data.created_at).getUTCHours()
            if(!consolidatedData.hourlyAvgPrice[hour]){
                consolidatedData.hourlyAvgPrice[hour]={totalPrice: 0, documentCount: 0}
            }
            totalPrice+= parseFloat(data.price)
            consolidatedData.hourlyAvgPrice[hour].totalPrice+=parseFloat(data.price)
            consolidatedData.hourlyAvgPrice[hour].documentCount+=1
        }
    })
    consolidatedData.avgPrice= (totalPrice/_.size(marketData))
    ProcessedData.create(consolidatedData, function(err, data){
        if(err){
            d.reject(err)
        }
        console.log("processed data saved")
        d.resolve(consolidatedData)
    })
    return d.promise;
}