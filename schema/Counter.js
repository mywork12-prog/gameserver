const mongoose  = require('mongoose')


const counterSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        password:{
            type: String,
            required:true
        },
        address:{
            type: String,
            required:true
        },
        mobile:{
            type: String,
            required:true
        },
        balance:{
            type: String,
            required:true
        }

})

const Counter = new mongoose.model('counters',counterSchema)

module.exports = Counter;