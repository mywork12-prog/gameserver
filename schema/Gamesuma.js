const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    gameid:{
        type:String,
        required:true
    },
    counterid:{
        type:String,
        required: true
    },
    cards:Array,
    date:{
        type:String,
        required:true
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
})

const bid = new mongoose.model('bids',bidSchema)

module.exports = bid;