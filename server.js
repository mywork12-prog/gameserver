const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
const route = require('./routes/index')
const cors = require('cors')

// var corsOptions = {
//     origin: "http://localhost:3000"
// };

dotenv.config();
const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors())
app.use('/',route);

mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true,useUnifiedTopology: true,  useFindAndModify: false  },()=>{
console.log('Mongo db connected')
})

app.listen(process.env.PORT || 5000,()=>{
    console.log('server Listining at 4000');
})