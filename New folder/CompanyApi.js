var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var moment = require('jalali-moment');
var multer = require('multer');

var ObjectId = require('mongodb').ObjectID;
const path = require("path");
const cryptoRandomString = require('crypto-random-string');
var http = require('http');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

var url = "mongodb://localhost:27017/";
var database = "mydb";
//var database = "food";


//var url = "mongodb://sarvapps_user:sj9074286@localhost:27017/sarvapps_db"; 
//var database = "sarvapps_db";

//var url = "mongodb://sarvapps_user:sj9074286@localhost:27017/sarvapps_food"; 
//var database = "sarvapps_food";

//var url = "mongodb://emdcctvc_user:sj9074286@localhost:27017/emdcctvc_db"; 
//var database = "emdcctvc_db"; 


router.post('/getPoseSales', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = {}
    dbo.collection("pose").find(condition).sort({ "_id": -1 }).toArray(function (err, result) {
      if (err) throw err;

      res.json({
        result: result,
      })

      db.close();
    });
  });

})

router.post('/setPoseSales', function (req, res, next) {
  //res.send("hello world")
  let TodayDate = moment().locale('fa').format('YYYY/M/D');
  let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
  if (req.body.edit) {
    res.json({
      result: [],
    })
    db.close();
    return;
  }
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let p = req.body;
    if (req.body._id) {
      p.updateDate = TodayDate;
      p.updateTime = TodayTime;
    } else {
      p.registerDate = TodayDate;
      p.registerTime = TodayTime;
    }
    let _id = req.body._id;
    if (req.body.edit)
      delete p._id

    if (req.body.edit) {
      if (req.body.del) {
        dbo.collection("pose").deleteOne({ _id: ObjectId(_id) }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        })
      } else {
        dbo.collection("pose").updateOne({ _id: ObjectId(_id) }, { $set: p }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        });
      }

      return;
    }
    dbo.collection("pose").insertOne(p, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({
        result: result,
      })
      db.close();
    });

  });
})

router.post('/setUserAction', function (req, res, next) {
  let TodayDate = moment().locale('fa').format('YYYY/M/D');

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let p = req.body;
    if (p.StartTime >= p.EndTime) {
      res.json({
        error: ["ساعت شروع باید از ساعت پایان بزرگتر باشد"],
      })
      db.close();
      return;
    }
    new Promise(function (resolve, reject) {
      let condition = { Date: req.body.Date, username: req.body.username, $or: [{ StartTime: p.StartTime }, { EndTime: p.EndTime }, { EndTime: p.StartTime }, { StartTime: p.EndTime }] }
      dbo.collection("work").find(condition).sort({ "EndTime": 1 }).toArray(function (err, result) {
        if (err) throw err;
        if ((!req.body.del && req.body._id && result.length > 1) || (!req.body._id && result.length > 0)) {
          res.json({
            error: ["ساعت وارد شده تکراری است"],
          })
          db.close();
        } else {
          resolve(true);

        }
      });
    }).then(function (value) {
      if (req.body._id) {
        let _id = p._id;
        delete p._id

        if (req.body.del) {
          dbo.collection("work").deleteOne({ _id: ObjectId(_id) }, function (err, result) {
            if (err) throw err;
            res.json({
              result: result,
            })
            db.close();
          })
        } else {
          dbo.collection("work").updateOne({ _id: ObjectId(_id) }, { $set: p }, function (err, result) {
            if (err) throw err;
            res.json({
              result: result,
            })
            db.close();
          });
        }

        return;
      }
      dbo.collection("work").insertOne(p, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
          result: result,
        })
        db.close();
      });
    }, function () {
      db.close();
    });;


  });
})


router.post('/getUserAction', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = { Date: req.body.Date, username: req.body.username }
    dbo.collection("work").find(condition).sort({ "EndTime": 1 }).toArray(function (err, result) {
      if (err) throw err;

      res.json({
        result: result,
      })

      db.close();
    });
  });

})

router.post('/getRequest', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition ={};
    if(!req.body.reqNumber)
       condition = { Sender: req.body.username }
    else
       condition = { /*Sender: req.body.username,*/number:parseInt(req.body.reqNumber) }

    var dbo = db.db(database);
    dbo.collection('request').aggregate([
      {

        $lookup: {
          from: "users",
          localField: "Sender",  
          foreignField: "username",
          as: "sender"
        }
      },
      {
        $match: condition
      },
      { $project: { "sender.password": 0, "sender.address": 0, "sender.company": 0, "sender.username": 0 } }
    ]).toArray(function (err, result) {
      if (err) throw err;

      res.json({
        result: result,
      })

      db.close();


    })
    
  });

})


router.post('/setRequest', function (req, res, next) {
  let TodayDate = moment().locale('fa').format('YYYY/M/D');

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let p = req.body;
    p.Date = TodayDate;
    p.Time = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();

    new Promise(function (resolve, reject) {
      dbo.collection("request").find({}).sort({ "number": 1 }).limit(1).toArray(function (err, result) {
        if(!result[0] || !result[0].number )
          p.number=100;
        else
          p.number = result[0].number+1;  
        if (err) throw err;
        resolve();
      });
    }).then(function (value) {
    

    if (req.body._id) {
      let _id = p._id;
      delete p._id
      if (req.body.del) {
        dbo.collection("request").deleteOne({ _id: ObjectId(_id) }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        })
      } else {
        delete p.Reciever;
        delete p.number;
        dbo.collection("request").updateOne({ _id: ObjectId(_id) }, { $set: p }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        });
      }

      return;
    }
    dbo.collection("request").insertOne(p, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({
        result: result,
      })
      db.close();
    });

  })



  });
})


module.exports = router;