var CryptoPair= require('../cryptoPair/cryptoPair.model')
var kue = require('kue');
var config= require('../../config/environment/index')
var Q= require('q')
var queue = kue.createQueue(config.redisConn);
var _= require('lodash')
var async= require('async')
var ObjectId = require('mongoose').Types.ObjectId;


//create a job to track each crypto pair with status=true
exports.createJobToProcess= function(req, res){
    console.log("check if here")
    CryptoPair.find({status: {$eq: true}}, {pairName: 1}, function(err, cryptoPairs){
        if(err){
            return res.status(500).json({message: err.message})
        }
        if(_.size(cryptoPairs)){
            async.eachSeries(cryptoPairs, function(pair, cb) {
                var arg = {
                    _id: new ObjectId(),
                    pairName: pair.pairName
                }
                
                //push the job to queue
                createJobQueue(arg).then(function(result) {
                    cb(null, result)
                }).catch(function(err) {
                    cb(err)
                })
            }, function(err) {
                if(err) {
                    console.log(err, err.message)
                    return res.status(500).send({message: err.message});
                }
                return res.status(200).send({message:'success'});
            })
        }
        else{
            return res.status(404).json({message: "No crypto pairs found"})
        }
    })
}

//function to add the process to the queue.
var createJobQueue= function(arg){
    var d= Q.defer()
    try{
        //we can use AWS queues instead of 'kue' package.
        
        queue.create('cryptopair_process', arg).attempts(3).removeOnComplete(true).save(function(err){
            if(err){
                console.log("Job could not be inserted in queue.");
                d.reject(err)
            }
            else{
                console.log('cryptoPair event created for: ',arg.pairName);
                d.resolve("event creation success")
            }
        });	
    }catch(e){
        console.log(e)
        d.reject(e)
    }
    return d.promise;
}

