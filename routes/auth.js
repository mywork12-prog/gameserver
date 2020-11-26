const jwt = require('jsonwebtoken');

 const verify = function (req,res,next){

     try{
         const head = req.header('Authorization');
         if (!head){
             res.status(401).send('Access Denied')
         }
         let token = head.split( " ")[1];
         if (!token) {
             return res.status(401).send('Token not Provided');
         }
         let get = jwt.verify(token,process.env.SECRET_KEY)
         if (!get) res.status(401).send('token not matched,Provide Valid token');
         next()
     }catch (e){
        console.log(e)
     }
}

module.exports = verify;
