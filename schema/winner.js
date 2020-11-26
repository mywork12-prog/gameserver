const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
    gameid:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    card:{
        type:String,
        required:true
    }
})

const winner = new mongoose.model('winners',winnerSchema);

module.exports = winner;