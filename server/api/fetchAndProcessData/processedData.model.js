let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let processedDataSchema = new Schema({
    pairName: {
        type: String,
        required: true
    },
    avgPrice: {type: Number},
    hourlyAvgPrice: {},
    created: {type: Date, default: Date.now},
});

module.exports = mongoose.model('processedData', processedDataSchema);
