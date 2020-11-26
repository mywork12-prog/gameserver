const express = require('express');
const router = express.Router();
const Counter = require('../schema/Counter');
const jwt = require('jsonwebtoken');
const verify = require('./auth');
const Bid = require('../schema/Gamesuma')
const Winner = require('../schema/winner')

let minu = 0;
let sec = 0;
let state = '';
let gameid = 0;
let win = 0;
function startTimer(duration, display) {
    var timer = duration,
        minutes, seconds;

       state =  setInterval(function() {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            minu = minutes
            sec = seconds
           if (--timer < 0) {
               timer = duration;
               gameid = Math.floor(Math.random() * 10000000000000000000);
               win = Math.floor(Math.random() * 12);
           }

        }, 1000);

}

router.get('/timerstart',(req,res)=>{
    var TwoMinutes = 60 * 2;
    startTimer(TwoMinutes);
    gameid = Math.floor(Math.random() * 10000000000000000000);
    res.status(200).json('timer:started')
})

router.get('/timer',(req,res)=>{
        res.status(200).json({timer:minu+':'+sec})

})
router.get('/timerstop',(req,res)=>{
    clearInterval(state);
    gameid = 0;
    minu= 0;
    sec=0;
    res.status(200).json('timer:stop')
})

router.get('/gameid',(req,res)=>{

    res.status(200).json({gameid:gameid})
})

router.get('/counter',verify,async (req,res)=>{
    try{
        const counters = await Counter.find();
        res.json(counters);
    }catch (e){
        console.log(e)
    }


})

router.post('/login',async (req,res)=>{
    if (req.body == '' ){
        return res.status(400).json('No data provided')
    }else{
        const user = {
            username: req.body.username,
            password: req.body.password
        };

        try{
            const logcounter = await Counter.find(user);

            if(logcounter == '') {
                return res.status(400).json({massage:'invalid username and password'});
            }
            const token = jwt.sign(user, process.env.SECRET_KEY);
            res.status(200).json({token:token,users:logcounter});
        }catch (e){
            console.log(e)
        }
    }

})


router.post('/counter',verify, async (req,res)=>{
    const counter =  new Counter({
        name:req.body.name,
        username:req.body.username,
        password:req.body.password,
        address:req.body.address,
        mobile:req.body.mobile,
        balance:req.body.balance
    })
    try{
       const savedcounter = await counter.save();
        res.json(savedcounter);

    }
    catch (error){
        console.log(error);
    }
})

router.delete('/counter/:id',verify, async (req,res)=>{
    try{
        if (!req.params.id){
            res.status(400).send('provide ID for data')
        }else {
            const deletecounter = await Counter.findByIdAndDelete(req.params.id);
            res.status(200).json(deletecounter);
        }
    }catch (error){
        console.log(error)
    }
})

router.patch('/counter/:id',verify,async (req,res)=>{
    try {
        if (!req.params.id){
            res.status(400).send('provide ID for data')
        }else {
            const updatecounter = await Counter.findByIdAndUpdate({_id:req.params.id},{ $set:{
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                address:req.body.address,
                mobile:req.body.mobile,
                balance:req.body.balance
            }});
            res.status(200).json(updatecounter);
        }
    }
    catch (e){
        console.log(e)
    }
})

router.get('/counter/:id',verify,async (req,res)=>{
    try{
        if (!req.params.id){
            res.status(400).send('provide ID for data')
        }else{
            const counterone = await Counter.findById(req.params.id);
            res.status(200).json(counterone);
        }
    }catch (e){
        console.log(e)
    }
})

router.patch('/counterdetail/:id',verify,async (req,res)=>{
    try{
        if(!req.params.id){
            res.status(400).send('provide ID for data')
        }else{
            const counterbyone = await Counter.findByIdAndUpdate({_id:req.params.id},{ $set:{
                    name:req.body.name,
                    address:req.body.address,
                    mobile:req.body.mobile
                }});
            res.status(200).json(counterbyone);
        }
    }catch (e){
        console.log(e)
    }
})

router.patch('/counter/balance/:id',verify,async (req,res)=>{
    try{
        if(!req.params.id){
            res.status(400).send('provide ID for data')
        }else{
            const counterbalance = await Counter.findByIdAndUpdate({_id:req.params.id},{$set:{
                    balance: req.body.balance
                }});
            res.status(200).json(counterbalance);
        }
    }catch (e){
        console.log(e)
    }
})



router.get('/winner',(req,res)=>{
    res.status(200).json({'winner':win})
})

router.post('/gamesdata',async (req,res)=>{
    const gamesuma = new Bid({
        gameid: req.body.gameid,
        counterid:req.body.counterid,
        cards:req.body.cards,
        date:req.body.date
    })
    try{
        const game = await gamesuma.save();
        res.status(200).json(game);
    }catch (e){
        console.log(e)
    }
})

router.get('/summary',verify, async (req,res)=>{
    try{
        const allbids = await Bid.find();
        res.status(200).json(allbids);
    }catch (e){
        console.log(e)
    }
})

router.get('/summary/:id',verify,async (req,res)=>{
    try{
        if(!req.params.id){
            res.status(400).send('provide ID for data')
        }else{
            const summarybyone = await Bid.findById({_id:req.params.id});
            res.status(200).json(summarybyone);
        }
    }catch (e){
        console.log(e)
    }
})



router.post('/winners',verify,async (req,res)=>{
    try{
        const addwinner = new Winner({
            gameid:req.body.gameid,
            date:req.body.date,
            time:req.body.time,
            card:req.body.card
        })
        const newwinner = await addwinner.save();
        res.status(200).json(newwinner)
    }catch (e){
        console.log(e)
    }
})

router.get('/winners',verify,async (req,res)=>{
    try{
        const allwinner = await Winner.find();
        res.status(200).json(allwinner);
    }catch (e){
        console.log(e)
    }
})

router.get('/winners/:date',async (req,res)=>{
    try{
        if(!req.params.date){
            res.status(400).send('provide ID for data')
        }else{
            const winnerbydate = await Winner.find({date:req.params.date});
            res.status(200).json(winnerbydate);
        }
    }catch (e){
        console.log(e)
    }
})



module.exports = router;