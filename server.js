var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
var blockchain     =         require('./blockchain');
var crypto         =         require('crypto');
const port         =         process.env.PORT || 3000;
//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.post('/sendtoblock',function(req,res){

  var from=req.body.user;
  var to=req.body.to;
  var amount=req.body.amount;
  var chequeID=req.body.chequeID;

  var authorization = req.headers.authorization;

  if( ("Bearer "+encodemd5(chequeID+"hellothisismysalt")) == authorization ){

    if(from == "" || to == "" || amount == "" || chequeID == ""){

        res.send(JSON.stringify({status: "failed",statusdetail:"Missing required params"}));

      } else {

        blockchain.addPayment(from,to,amount,chequeID);
        res.send(JSON.stringify({status: "success",statusdetail:"Successfully posted"}));

      }

  } else {

    res.send(JSON.stringify({status: "failed",statusdetail:"Authorization failed"}));

  }

});
app.listen(port,function(){
  console.log("Started on PORT "+port);
})

function encodemd5(value){
    var hash = crypto.createHash('md5').update(value).digest('hex');
    return hash;
}
