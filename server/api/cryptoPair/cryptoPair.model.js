let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let cryptoPairSchema = new Schema({

    pairName: {
        type: String,
        required: true
    },
    status: {type: Boolean, default: true},
    created: {type: Date, default: Date.now},
});

module.exports = mongoose.model('cryptoPair', cryptoPairSchema);
