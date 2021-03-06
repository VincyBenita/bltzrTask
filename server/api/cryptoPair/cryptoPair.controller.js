'use strict';

var _ = require('lodash');
var Q = require('q');
const express = require("express");
const router = express.Router();
var CryptoPair = require('./cryptoPair.model')

//to add the crypto pair to be tracked
exports.addCryptoPair = function (req, res) {

    //check for crypto pair name
    if (!req.body.pairName) {
        return res.status(405).json({ message: "Invalid Input" })
    }
    var query= {
        pairName: req.body.pairName
    }
    CryptoPair.findOne(query, function (err, cryptoPair) {
        console.log(cryptoPair)
        if (err) { 
            console.log(err)
            return handleError(res, err); 
        }
        console.log(!cryptoPair)

        //if the crypto pair does not exist, then create a new one
        if (!(cryptoPair && cryptoPair.pairName)) {
            console.log("here")
            var newCryptoPair = new CryptoPair(req.body);
            console.log(newCryptoPair)
            newCryptoPair.save(function (err, user) {
                if (err) return validationError(res, err);
                res.status(201).json({ message: "New Crypto Pair added" });
            });
        }
        //if the crypto pair already exists, then update the status to true
        else if (cryptoPair && cryptoPair.pairName) {
            var updatedPair = cryptoPair
            updatedPair.status = true
            updatedPair.save(function (updateErr) {
                if (updateErr) {
                    return handleError(res, err)
                }
                return res.status(200).json({ message: "Crypto Pair status changed to track" })
            })
        }
        else {
            return res.status(500).json({ message: "conditions not met" })
        }
    });

}

//to update the status of the crypto pair to false
exports.removeTrackedPair = function (req, res) {
    if (!req.body.pairName) {
        return res.status(422).json({ message: "pair name not present" })
    }

    CryptoPair.findOneAndUpdate(req.body.pairName, { $set: { "status": false } }, { returnNewDocument: true }, function (err, pair) {
        if (err) {
            return res.status(500).json({ message: err.message })
        }
        if (!(pair && pair.pairName)) {
            return res.status(400).json({ message: "Crypto Pair not found" })
        }
        return res.status(200).json({ message: "removed tracked pair successfully" })
    })
}

var validationError = function (res, err) {
    console.log(err.message)
    return res.status(422).json(err);
};

function handleError(res, err) {
    return res.status(500).json(err);
};


