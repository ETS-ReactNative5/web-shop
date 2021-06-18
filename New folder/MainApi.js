var express = require('express');
var http = require('http');
const https = require('https')

var qs = require("querystring");
var router = express.Router();
var asyncLoop = require('node-async-loop');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var moment = require('jalali-moment');
var multer = require('multer');
var ObjectId = require('mongodb').ObjectID;
const path = require("path");
const AdminMobile="09139074286";
var siteUrl = "https://market.aniashop.ir/";
var serverUrl = "https://marketapi.sarvapps.ir/";
//var siteUrl = "https://food.aniashop.ir/";
//var serverUrl = "https://foodapi.sarvapps.ir/";

var url = "mongodb://localhost:27017/";
//var database = "mydb";
var database = "food";

//var url = "mongodb://sarvapps_user:sj9074286@localhost:27017/sarvapps_db"; 
//var database = "sarvapps_db";

//var url = "mongodb://sarvapps_user:sj9074286@localhost:27017/sarvapps_food"; 
//var database = "sarvapps_food";

//var url = "mongodb://emdcctvc_user:sj9074286@localhost:27017/emdcctvc_db"; 
//var database = "emdcctvc_db";    

var money = "تومان";
const cryptoRandomString = require('crypto-random-string');
const ZarinpalCheckout = require('zarinpal-checkout');
var setting = {};
function SendSms(text, mobileNo, settings) {             
  var str = '';
  if (settings.ActiveSms == "smart") {
    var options = {  
      host: 'api.smartsms.ir',  
      path: '/sms/send?userId=' + settings.SmartUser + '&password=' + settings.SmartPass + '&recipient=' + mobileNo + '&message=' + encodeURIComponent(text) +  '&originator=' + settings.SmartNumber + ''
    };

    callback = function (response) {

      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        // your code here if you want to use the results !
      });

      //return str;
    }

    var req = http.request(options, callback).end();

  } else if (settings.ActiveSms == "smsir") {
    var str = '';
  
    var options = {
      host: 'niksms.com',
      path: '/fa/publicapi/groupsms?username=' + settings.SmsIrUser + '&password=' + settings.SmsIrPass + '&message=' + encodeURIComponent(text) + '&numbers=' + mobileNo + '&sendernumber=' + settings.SmsIrNumber + ''
    };

    callback = function (response) {
  
      response.on('data', function (chunk) {
        str += chunk;
      });
  
      response.on('end', function () {
        /*res.json({
          result: str
        })*/
        // your code here if you want to use the results !
      });
  
      //return str;
    }  
    var req = http.request(options, callback).end();
    
  }

}

router.post('/cacheManager', function (req, res, next) {
  let chacheVersion=2;
  if(req.body.chacheVersion < chacheVersion){
    res.json({
      result: 1
    })

  }else{
    res.json({
      result: 0
    })
  }

})
router.post('/inax', function (req, res, next) {


  
  var data = {};
  if(req.body.method == "topup"){
     data = {
      "username": '1742f5bacc06f02722d37458da5c51b1',
      "password":'sj9074286',
      "order_id":req.body.order_id,
      "method": req.body.method,
      "operator": req.body.operator,
      "amount": req.body.amount,
      "mobile": req.body.mobile,
      "charge_type": req.body.charge_type,
      "pay_type": req.body.pay_type
    };
  }          
  else if(req.body.method == "internet"){

    data = {
      "username": '1742f5bacc06f02722d37458da5c51b1',
      "password":'sj9074286',
      "order_id":req.body.order_id,
      "method": req.body.method,
      "operator": req.body.operator,
      "internet_type": req.body.internet_type,
      "sim_type": req.body.sim_type,
      "product_id":req.body.product_id,
      "mobile": req.body.mobile,
    };

  }
  else if(req.body.method == "check_bill"){

    data = {
      "username": '1742f5bacc06f02722d37458da5c51b1',
      "password":'sj9074286',
      "method": req.body.method,
      "pay_id": req.body.pay_id,
      "bill_id": req.body.bill_id
    };
    
  }
  else if(req.body.method == "bill"){

    data = {
      "username": '1742f5bacc06f02722d37458da5c51b1',
      "password":'sj9074286',
      "method": req.body.method,
      "pay_id": req.body.pay_id,
      "bill_id": req.body.bill_id,
      "mobile": req.body.mobile
    };
    
  }
  else{
    data = {
      "username": '1742f5bacc06f02722d37458da5c51b1',
      "password":'sj9074286',
      "method": req.body.method,
    };

  }
  var options = {
    hostname: 'inax.ir',
    port: 443,
    path: '/webservice.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }   
  };
  var httpreq = https.request(options, function (response) {  
    var buffer = ""

    response.on("data", function (chunk) {
      buffer += chunk;
    });

    response.on("end", function (err) {
      debugger;
      res.json({
        result: JSON.parse(buffer)
      })
    });
  });
  httpreq.write(JSON.stringify(data));
  httpreq.end();

})
//const zarinpal = ZarinpalCheckout.create('59eb930a-a6c2-11e9-a80d-000c29344814', false);
router.get('/', function (req, res, next) {
  res.send("hello world")

})
router.post('/', function (req, res, next) {
  res.json({
    result: req.body
  })

})
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  var dbo = db.db(database);
  dbo.collection("product").dropIndexes()
  dbo.collection("product").createIndex(
    {
      title: "text",
      subTitle: "text"
    }
  )

});
router.post('/GetSmsToken', function (req, res, next) {
  var data = {
    "UserApiKey": setting.SmsIrUser,
    "SecretKey": setting.SmsIrPass
  };
  var options = {
    hostname: 'RestfulSms.com',
    port: 80,
    path: '/api/Token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }   
  };
  var httpreq = http.request(options, function (response) {
    var buffer = ""

    response.on("data", function (chunk) {
      buffer += chunk;
    });

    response.on("end", function (err) {

      res.json({
        result: JSON.parse(buffer)
      })
    });
  });
  httpreq.write(JSON.stringify(data));
  httpreq.end();

})
router.post('/sendsms_SmsIr', function (req, res, next) {
  var str = '';
  var MongoClient = require('mongodb').MongoClient;
  
  new Promise(function (resolve, reject) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
    dbo.collection("setting").find({}).toArray(function (err, result) {
      if (err) throw err;
      setting = {setting:result[0],req:req};
      resolve(setting)
      db.close();
    });
  }) 
  }).then(function (setting) {
    var options = {
      host: 'niksms.com',
      path: '/fa/publicapi/groupsms?username=' + setting.setting.SmsIrUser + '&password=' + setting.setting.SmsIrPass + '&message=' + encodeURIComponent(setting.req.body.text) + '&numbers=' + setting.req.body.mobileNo + '&sendernumber=' + setting.setting.SmsIrNumber + ''
    };

    callback = function (response) {
  
      response.on('data', function (chunk) {
        str += chunk;
      });
  
      response.on('end', function () {
        res.json({
          result: str
        })
        // your code here if you want to use the results !
      });
  
      //return str;
    }  
    var req = http.request(options, callback).end();

  })

  

})



router.post('/sendsms_smartSms', function (req, res, next) {




  var str = '';

  var options = {
    host: 'api.smartsms.ir',
    path: '/sms/send?userId=' + setting.SmartUser + '&password=' + setting.SmartPass + '&message=' + encodeURIComponent(req.body.text) + '&recipient=' + req.body.mobileNo + '&originator=' + setting.SmartNumber + ''
  };

  callback = function (response) {

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      res.json({
        result: str
      })
      // your code here if you want to use the results !
    });

    //return str;
  }

  var req = http.request(options, callback).end();

  // These just return undefined and empty


})
router.post('/sendsms3', function (req, res, next) {



  var options = {
    "method": "POST",
    "hostname": "rest.payamak-panel.com",
    "port": null,
    "path": "/api/SendSMS/SendSMS",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "986f8677-6806-fd9c-62bf-5b7594a44066",
      "content-type": "application/x-www-form-urlencoded"
    }
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
    });
  });

  req.write(qs.stringify({
    username: '09139074286',
    password: '8211',
    to: "test",
    from: '50004000074286',
    text: "9139074286",
    isflash: 'false'
  }));
  req.end();


})


function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader != 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next()
  } else {
    res.sendStatus(403)
  }

}
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myImage");
router.post('/uploadFile', function (req, res, next) {
  upload(req, res, (err) => {

    if (req.body.id) {
      var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        let pic = ''
        if (req.body.pic == "pic1")
          pic = { fileUploaded: req.file.path }
        if (req.body.pic == "pic2")
          pic = { fileUploaded1: req.file.path }
        if (req.body.pic == "pic3")
          pic = { fileUploaded2: req.file.path }
        if (req.body.pic == "pic4")
          pic = { fileUploaded3: req.file.path }
        if (req.body.pic == "pic5")
          pic = { fileUploaded4: req.file.path }
        dbo.collection("product").update({ _id: ObjectId(req.body.id) }, { $set: pic }, function (err, result) {
          if (err) throw err;

          db.close();
        });
      });

    }
    /*Now do where ever you want to do*/
    if (!err)
      return res.send(req.file.path).end();
  });
})

router.post('/checktoken', function (req, res, next) {
  jwt.verify(req.body.token, 'secretKey', (err, authData) => {
    if (err) {
      res.sendStatus(403)
    } else {
      res.json({
        message: 1,
        authData
      })
    }

  })

})
router.post('/GetComponentsList', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  var token = req.body.token;
  var user = null;
  var promise1 = new Promise(function (resolve, reject) {
    jwt.verify(token, 'secretKey', (err, authData) => {
      if (err) {
        res.sendStatus(403)
      } else {

        resolve(authData);
      }

    })
  });
  promise1.then(function (value) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      user = value.username;
      dbo.collection("users").find({ "username": value.username, "level": { $in: ["1", "2"] } }).toArray(function (err, result) {
        if (err) throw err;
        if(!result[0]){
          res.json({
            result: []
          })
          db.close();
          return;
        }
        var map = result[0].map;
        var promise2 = new Promise(function (resolve1, reject1) {
          dbo.collection("maps").find({ "_id": map }).toArray(function (err, result1) {
            if (err) throw err;

            resolve1(result1);
          });
        })
        promise2.then(function (value2) {
          if (!value2[0]) {
            res.json({
              result: []
            })
            db.close();

            return;
          }
          let Components = value2[0].components;
          let Condition = [];
          for (let i = 0; i < Components.length; i++)
            Condition[i] = {
              "CId": Components[i]
            };
          var promise3 = new Promise(function (resolve2, reject1) {
            dbo.collection("components").find({ $or: Condition }).sort({ IsTitle: -1, Parent: -1 }).toArray(function (err, result2) {
              if (err) throw err;
              resolve2(result2);
            });
          })
          promise3.then(function (value3) {
            res.json({
              result: value3,
              user: user
            })
          }, function () {
            db.close();
          });
        }, function () {
          db.close();
        });
      });
    })
    // expected output: "foo"
  }, function () {
    db.close();
  });

})
router.post('/getSettings', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("setting").find({}).toArray(function (err, result) {
      if (err) throw err;
      setting = result[0];
      res.json({
        result: result[0] ? { ActiveBank: result[0].ActiveBank, ActiveSms: result[0].ActiveSms, AccessAfterReg: result[0].AccessAfterReg, STitle: result[0].STitle, RegSmsText: result[0].RegSmsText, UserChangeSmsText: result[0].UserChangeSmsText, FactorChangeSmsText: result[0].FactorChangeSmsText, SeveralShop: result[0].SeveralShop, Template: result[0].Template, ProductBase: result[0].ProductBase, SaleFromMultiShops: result[0].SaleFromMultiShops,RegisterByMob:result[0].RegisterByMob,Raymand:result[0].Raymand } : {},
      })
      db.close();
    });
  })
})
router.post('/getuserInformation', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection('users').aggregate([
      {

        $lookup: {
          from: "offs",
          localField: "levelOfUser",
          foreignField: "level",
          as: "offs"
        }
      },
      {
        $match: {
          _id: ObjectId(req.body.user_id)
        }
      }
    ]).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
      db.close();


    })

  })

})
router.post('/getuser', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  var username = req.body.username.charAt(0) == "0" ? req.body.username.substr(1) : req.body.username;
  username = username.substr(username.length - 10, 10);
  let password = req.body.password;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);


    if (req.body.noPass) {

     

      var promise = new Promise(function (resolve, reject) {
      if(!req.body.RaymandUser){
        dbo.collection("users").find({ username: username, status: "1" }).toArray(function (err, result) {
          if (err) throw err;
          if (result[0] && result[0].username) {
            var p = {
              username: result[0].username, name: result[0].name, level: result[0].level, levelOfUser: result[0].levelOfUser,userId: result[0]._id,credit:result[0].credit
            }
            resolve(p)
            
          } else {
            resolve({error:1})
            
          }
        })
        return;
      }
      if(req.body.RaymandUser){
        dbo.collection("users").find({ username: username, status: "1",RaymandUser:req.body.RaymandUser }).toArray(function (err, result) {
          if (err) throw err;
          if (result[0] && result[0].username) {
            var p = {
              username: result[0].username, name: result[0].name, level: result[0].level, levelOfUser: result[0].levelOfUser,userId: result[0]._id,credit:result[0].credit
            }
            resolve(p)
            
          } else {
            dbo.collection("users").findOneAndUpdate({ username: username, status: "1" }, { $set: { RaymandUser:req.body.RaymandUser } }, function (err, result2) {
              if (result2.value && result2.value.username) {
                var p = {
                  username: result2.value.username, name: result2.value.name, level: result2.value.level, levelOfUser: result2.value.levelOfUser,userId: result2.value._id,credit:result2.value.credit
                }
                resolve(p)
                
              }else{
                resolve({error:1})
              }
            })
          }
        })
      }
    })
    promise.then(function (p) {
        var userId = p.userId,
        username = p.username,
        name = p.name,
        level = p.level,
        levelOfUser = p.levelOfUser,
        credit = p.credit;
        jwt.sign({ username, userId,  name, level, levelOfUser: levelOfUser,credit:credit }, 'secretKey', (err, token) => {

          res.json({
            result: p,
            token
          })
        });
      
    })
    return;
    }

    if (!password) {

      dbo.collection("users").find({ username: username, status: "1" }).toArray(function (err, result) {
        if (err) throw err;
        if (result[0] && result[0].username) {
          res.json({
            result: "yes"
          })
        } else {
          res.json({
            result: "no"
          })
        }
      })

      return
    }


    var promise = new Promise(function (resolve, reject) {
      dbo.collection("users").find({ username: username, password: password, status: "1" }).toArray(function (err, result1) {
        if (err) throw err;
        if (!result1[0]) {
          res.json({
            result: ["نام کاربری یا رمز عبور نادرست است"]
          })
          return;

        }

        userId = result1[0]._id;
        /*
        dbo.collection('cart').aggregate([
         {
           
           $lookup: {
                from: "product",
                localField: "product_id",
                foreignField: "_id",
                as: "products"
           }
         },
         {  
           $match : {
             "user_id" :  ObjectId(result1[0]._id),
             "status" : "0"
          }
         }
       ])*/
        dbo.collection('cart').aggregate([
          {

            $lookup: {
              from: "product",
              localField: "product_id",
              foreignField: "_id",
              as: "products"
            }
          },
          {

            $lookup: {
              from: "product_detail",
              localField: "product_id",
              foreignField: "product_id",
              as: "product_detail"
            }
          },
          {
            $match: {
              "user_id": ObjectId(result1[0]._id),
              "status": "0"
            }
          }
        ]).toArray(function (err, result) {
          if (err) throw err;
          result = MergeResult(result, { inCart: 1 })

          let CartNumber = 0;
          result.map((res, index) => {
            CartNumber += parseInt(res.number);

          })
          let name = result1[0].name;
          let level = result1[0].level;
          let shopId = result1[0].shopId;
          let levelOfUser = result1[0].levelOfUser;
          let credit = result1[0].credit || 0;
          var p = {
            username: username, shopId: shopId, name: name, level: level, levelOfUser: levelOfUser, res: res, result1: result1, userId: userId, CartNumber: CartNumber,credit:credit
          }
          resolve(p)


        })

        db.close();
      });




    })
    promise.then(function (p) {
      var userId = p.userId,
        username = p.username,
        name = p.name,
        level = p.level,
        shopId = p.shopId,
        levelOfUser = p.levelOfUser,
        credit = p.credit;


      if (p.levelOfUser) {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
          if (err) throw err;
          var dbo = db.db(database);
          dbo.collection("offs").find({ "level": p.levelOfUser, product_id: null }).toArray(function (err, result) {
            if (err) throw err;

            var offTemp = result[0].off || 0;
            if (offTemp == "" && result[0].formul) {
              var formul = JSON.parse(result[0].formul),
                f_level = formul.level,
                f_off = formul.off,
                f_opr = formul.opr;
              if (f_level == "") {

                res.json({
                  result: p.result1,
                  CartNumber: p.CartNumber,
                  off: offTemp, // formul of level
                  token
                })
              }
              var final_off = 0,
                final_off1 = 0;
              dbo.collection("offs").find({ "level": f_level, product_id: null }).toArray(function (err, resultFinal) {
                if (resultFinal[0].formul) {
                  var formul1 = JSON.parse(resultFinal[0].formul),
                    f_level1 = formul1.level,
                    f_off1 = formul1.off,
                    f_opr1 = formul1.opr;
                  dbo.collection("offs").find({ "level": f_level1, product_id: null }).toArray(function (err, resultFinal1) {
                    final_off1 = resultFinal1[0].off || "0";
                    var offTemp1 = eval(parseInt(final_off1) + f_opr1 + parseInt(f_off1));
                    offTemp = eval(parseInt(offTemp1) + f_opr + parseInt(f_off));
                    jwt.sign({ username, userId, shopId, name, level, levelOfUser: levelOfUser,credit:credit }, 'secretKey', (err, token) => {

                      res.json({
                        result: p.result1,
                        CartNumber: p.CartNumber,
                        off: offTemp, // formul of level
                        token
                      })
                    });
                  })
                } else {
                  final_off = resultFinal[0].off || "0";
                  offTemp = eval(parseInt(final_off) + f_opr + parseInt(f_off));
                  jwt.sign({ username, userId, shopId, name, level, levelOfUser: levelOfUser,credit:credit }, 'secretKey', (err, token) => {

                    res.json({
                      result: p.result1,
                      CartNumber: p.CartNumber,
                      off: offTemp, // formul of level
                      token
                    })
                  });
                }

              })

            } else {
              jwt.sign({ username, userId, shopId, name, level, levelOfUser: levelOfUser,credit:credit }, 'secretKey', (err, token) => {

                res.json({
                  result: p.result1,
                  CartNumber: p.CartNumber,
                  off: offTemp, // formul of level
                  token
                })
              });

            }


          });
        })
      } else {
        jwt.sign({ username, userId, shopId, name, level, levelOfUser: levelOfUser,credit:credit }, 'secretKey', (err, token) => {

          res.json({
            result: p.result1,
            CartNumber: p.CartNumber,
            off: 0,
            token
          })
        });
      }

    }, function () {
      db.close();
    });

  });
})

router.post('/GetCategory', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = req.body.condition || {};
    let type = req.body.type;
    if(req.body.MultiCats){
    var obj_ids = req.body.MultiCats.map(function (item) { return ObjectId(item) });
      dbo.collection("category").find({_id: { $in: obj_ids }}).toArray(function (err, result) {
        if (err) throw err;

        res.json({
          result: result,
        })

        db.close();
      });
      return;
    }
    if (!req.body.getSubCat) {
      dbo.collection("category").find(condition).toArray(function (err, result) {
        if (err) throw err;

        res.json({
          result: result,
        })

        db.close();
      });
    } else {
      if (!req.body.CatId) {
        dbo.collection("category").find(!req.body.condition ? { showInSite: true, Parent: { $ne: null }, pic: { $ne: null } } : req.body.condition.condition).toArray(function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        });
      } else {
        dbo.collection("category").find({ Parent: req.body.CatId }).toArray(function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        });
      }

    }

  });
}) 
router.post('/GetProductsPerCat', function (req, res, next) {
  //res.send("hello world")
  var MongoClient = require('mongodb').MongoClient;
  let id = req.body.id;
  let limit = req.body.limit || 1000;
  let skip = req.body.skip || 0;
  let TodayDate = moment().locale('fa').format('YYYY/MM/DD');
  let levelOfUser = req.body.levelOfUser;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (id) {
      var promise1 = new Promise(function (resolve, reject) {
        if (req.body.getSubs) {


          dbo.collection("category").find({ $or: [{ Parent: id }, { _id: ObjectId(id) }] }).toArray(function (err, result) {
            if (err) throw err;
            let ids = [];
            for (let i = 0; i < result.length; i++)
              ids.push(result[i]._id.toString())
            ids.push(id);
            resolve(ids);
          });
        }
        else {
          resolve(typeof id=="object" ? id : [id]);
        }

   

      });
      promise1.then(function (value) {
        var obj_ids = value.map(function (item) { return ObjectId(item) });

        dbo.collection('product').aggregate([

          {

            $lookup: {
              from: "product_detail",
              localField: "_id",
              foreignField: "product_id",
              as: "product_detail"
            }
          },
          {
            $lookup: {
              from: "shops",
              localField: "SellerId",
              foreignField: "_id",
              as: "Seller"
            }
          }, {
            $match: {
              category_id: { $in: obj_ids }
            }
          }
        ]).sort({ number: -1 }).skip(skip)/*.limit(limit)*/.toArray(function (err, result) {
          if (err) throw err;
          result = MergeResult(result);
          try{
              
          
          result = result.filter(function (a) {
            return a.product_detail ? (req.body.Exist ? a.product_detail[0].number > 0 : a.product_detail[0].number > -1) : (req.body.Exist ? a.number > 0 : a.number > -1);
          });
          if (req.body.Exist) {
            result.sort(function (a, b) {
              return b.product_detail ? b.product_detail[0].number - a.product_detail[0].number : b.number - a.number;
            });
          }
          if (req.body.Sort == 4) {
            result.sort(function (a, b) {
              return b.product_detail ? (parseInt(b.product_detail[0].PrepareTime) - parseInt(a.product_detail[0].PrepareTime)) : (parseInt(b.PrepareTime) - parseInt(a.PrepareTime));
            });
          }
          if (req.body.Sort == 3) {
            result.sort(function (a, b) {
              return b.product_detail ? (parseInt(b.product_detail[0].price) - parseInt(a.product_detail[0].price)) : (parseInt(b.price) - parseInt(a.price));
            });
          }
          if (req.body.Sort == 2) {
            result.sort(function (a, b) {
              return a.product_detail ? (parseInt(a.product_detail[0].price) - parseInt(b.product_detail[0].price)) : (parseInt(a.price) - parseInt(b.price));
            });
          }
          if (req.body.Sort == 1) {
            result.sort(function (a, b) {
              return a.product_detail ? ( parseInt(a.product_detail[0].TodayDate) - parseInt(b.product_detail[0].TodayDate)) : ( parseInt(a.TodayDate) - parseInt(b.TodayDate));
            });
          }



          result = result.splice(0, limit)
          }catch(e){
              
          }
          computeOff(result, levelOfUser, res);
        })

      }, function () {

        db.close();
      });

    } else {

      let TodayDate = moment().locale('fa').format('YYYY/MM/DD');
      if (req.body.type == "Haraj_Day") {
        dbo.collection('product_detail').aggregate([

          {

            $lookup: {
              from: "product",
              localField: "product_id",
              foreignField: "_id",
              as: "product"
            }
          }, {
            $match: {
              HarajDate: TodayDate,
              $where: "this.HarajDate === this.ExpireDate"

            }
          }
        ]).limit(5).toArray(function (err, result) {
          if (err) throw err;
          result = MergeResult(result)
          computeOff(result, levelOfUser, res, { TodayDate: TodayDate });
        })

      } if (req.body.type == "Haraj_Week") {
        dbo.collection('product_detail').aggregate([

          {

            $lookup: {
              from: "product",
              localField: "product_id",
              foreignField: "_id",
              as: "product"
            }
          }, {
            $match: {
              ExpireDate: { $gte: TodayDate },
              $where: "this.HarajDate !== this.ExpireDate"

            }
          }
        ]).limit(5).toArray(function (err, result) {
          if (err) throw err;
          result = MergeResult(result);
          computeOff(result, levelOfUser, res, { TodayDate: TodayDate });
        })

      } else {
        dbo.collection('product_detail').aggregate([

          {

            $lookup: {
              from: "product",
              localField: "product_id",
              foreignField: "_id",
              as: "product"
            }
          }, {
            $match: {
              ExpireDate: { $gte: TodayDate }

            }
          }
        ]).sort({ number: -1 }).limit(5).toArray(function (err, result) {
          if (err) throw err;
          result = MergeResult(result)
          computeOff(result, levelOfUser, res, { TodayDate: TodayDate });
        })

      }


      /*
      dbo.collection("product").find({HarajDate: TodayDate}).toArray(function(err, result) {
        if (err) throw err;
         
               res.json({
                 result :result,
                 TodayDate : TodayDate
               })
         
        db.close(); 
      });*/

    }

  });
})

router.post('/GetProductsPerTag', function (req, res, next) {
  //res.send("hello world")
  var MongoClient = require('mongodb').MongoClient;
  let tag = req.body.tag;
  let levelOfUser = req.body.levelOfUser;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection('product').aggregate([

      {

        $lookup: {
          from: "product_detail",
          localField: "_id",
          foreignField: "product_id",
          as: "product_detail"
        }
      },{
        $lookup: {
          from: "shops",
          localField: "SellerId",
          foreignField: "_id",
          as: "Seller"
        }
      },
       {
        $match: {
          Tags: { $elemMatch: {_id:ObjectId(tag)} }
        }
      }
    ]).sort({ number: -1 }).toArray(function (err, result) {
      if (err) throw err;
      result = MergeResult(result);
      try{
        result = result.filter(function (a) {
          return a.product_detail ? (req.body.Exist ? a.product_detail[0].number > 0 : a.product_detail[0].number > -1) : (req.body.Exist ? a.number > 0 : a.number > -1);
        });

      }catch(e){

      }
      computeOff(result, levelOfUser, res);
    })

   


  });
})

router.post('/GetProductsPerShop', function (req, res, next) {
  //res.send("hello world")
  var MongoClient = require('mongodb').MongoClient;
  let id = req.body.id;
  let limit = req.body.limit || 1000;
  let skip = req.body.skip || 0;
  let levelOfUser = req.body.levelOfUser;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    
    new Promise(function (resolve, reject) {
      dbo.collection("shops").find({ "_id": ObjectId(id) }).toArray(function (err, result) {
        if (err) throw err;
        dbo.collection("users").find({ _id: ObjectId(req.body.UId) }).toArray(function (err, resultUser) {
          if (err) throw err;
          resolve({shop:result,user:resultUser});

        })
      })

    }).then(function (value) {
      

      dbo.collection('product_detail').aggregate([

        {
  
          $lookup: {
            from: "product",
            localField: "product_id",
            foreignField: "_id",
            as: "product" 
          }
        }, {
          $match: {
            "SellerId": ObjectId(id)
  
          }
        }
      ]).sort({ number: -1 }).skip(skip)/*.limit(limit)*/.toArray(function (err, result) {
        if (err) throw err;
        result = MergeResult(result);
        result = result.filter(function (a) {
          return req.body.Exist ? a.number > 0 : a.number > -1;
        });
        if (req.body.Exist) {
          result.sort(function (a, b) {
            return b.number - a.number;
          });
        }
        if (req.body.Sort == 4) {
          result.sort(function (a, b) {
            return parseInt(b.PrepareTime) - parseInt(a.PrepareTime);
          });
        }
        if (req.body.Sort == 3) {
          result.sort(function (a, b) {
            return parseInt(b.price) - parseInt(a.price);
          });
        }
        if (req.body.Sort == 2) {
          result.sort(function (a, b) {
            return parseInt(a.price) - parseInt(b.price);
          });
        }
        if (req.body.Sort == 1) {
          result.sort(function (a, b) {
            return parseInt(a.TodayDate) - parseInt(b.TodayDate);
          });
        }



        result = result.splice(0, limit);
        computeOff(result, levelOfUser, res,{shop:value.shop,user:value.user,Time : moment().locale('fa').format('HH:mm'),WeekDay:moment().locale('fa').weekday()});
      })


    })
  });  
})


router.post('/GetNewPass', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    var username = req.body.username.charAt(0) == "0" ? req.body.username.substr(1) : req.body.username;

    var promise1 = new Promise(function (resolve, reject) {
      dbo.collection("users").find({ "username": username }).toArray(function (err, result) {
        if (err) throw err;
        if (result[0] && result[0].status == "1") {
          let newpass = cryptoRandomString({ length: 4, characters: '1234567890' });
          resolve(newpass);
        } else {
          reject();
        }
      })
    });
    promise1.then(function (value) {
      dbo.collection("users").update({ "username": username }, { $set: { "password": value } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: value
        })
      });
    }, function () {
      res.json({
        result: "شماره موبایل ثبت شده در سیستم وجود ندارد"
      })
      db.close();
    });


  })

})
router.post('/Register', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    var username = req.body.username.charAt(0) == "0" ? req.body.username.substr(1) : req.body.username;
    if (req.body.Step == "1") {


      let SecurityCode = cryptoRandomString({ length: 4, characters: '1234567890' });
      var promise1 = new Promise(function (resolve, reject) {
        dbo.collection("users").find({ "username": username }).toArray(function (err, result) {
          if (err) throw err;
          /*res.json({
              result :result,
              msg :"شماره موبایل وارد شده قبلا در سیستم ثبت شده است",
            })*/
          if (result[0] && result[0].status == "1") {
            res.json({
              result: result,
              msg: "شماره موبایل وارد شده قبلا در سیستم ثبت شده است",
            })
            reject();
          } else {

            resolve('foo');
          }
        })
      });
      promise1.then(function (value) {
        dbo.collection("users").update({ "username": username }, { "username": username, "password": req.body.password, name: req.body.name, company: req.body.company, mail: req.body.mail, address: req.body.address, "status": req.body.AccessAfterReg ? SecurityCode : "0", "level": "0", levelOfUser: "-1" }, { upsert: true }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
            SecurityCode: SecurityCode
          })
        });
        // expected output: "foo"
      }, function () {
        db.close();
      });


    }


    if (req.body.Step == "2") {
      var promise1 = new Promise(function (resolve, reject) {
        dbo.collection("users").find({ username: username }).toArray(function (err, result2) {
          let SecCode = result2[0] ? result2[0].status : null;
          if (SecCode != req.body.SecurityCode) {
            res.json({
              result: result2,
              msg: "کد امنیتی صحیح نیست",
            })
            db.close();
            return;
          }
          resolve();
        })

      });
      promise1.then(function (value) {
        let TodayDate = moment().locale('fa').format('YYYY/MM/DD');
        let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
        dbo.collection("users").updateOne({ "username": username, "status": req.body.SecurityCode }, { $set: { "password": req.body.password, "status": "1", "level": "0", levelOfUser: "", "RegisterDate": TodayDate, "RegisterTime": TodayTime } }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result
          })

        })
        db.close();
      }, function () {
        db.close();
      });

    }
    if (req.body.Step == "3") {

      dbo.collection("users").find({ username: username, password: req.body.password, level: "0" }).toArray(function (err, result1) {

        let usernameTemp = result1[0].username,
          userId = result1[0]._id;
        jwt.sign({ usernameTemp, userId }, 'secretKey' /*, {expiresIn:'2h'}*/, (err, token) => {

          res.json({
            result: result1,
            token
          })
        });

      })
      db.close();
    }

  })
})

router.post('/autoRegister', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  var username = req.body.username.charAt(0) == "0" ? req.body.username.substr(1) : req.body.username;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    var promise = new Promise(function (resolve, reject) {
      dbo.collection("users").insertOne({ "username": username, "password": req.body.password, name: req.body.name,  address: req.body.address, "status": "1", "level": "0", levelOfUser: "",RaymandUser:req.body.RaymandUser }, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    })
    promise.then(function (value) {
      dbo.collection("users").find({ username: username}).toArray(function (err, result1) {

        let usernameTemp = result1[0].username,
          userId = result1[0]._id;
        jwt.sign({ usernameTemp, userId }, 'secretKey' /*, {expiresIn:'2h'}*/, (err, token) => {

          res.json({
            result: result1,
            token
          })
        });

      })

    })

  })
})

router.post('/setCategory', function (req, res, next) {
  //res.send("hello world")
  var MongoClient = require('mongodb').MongoClient;
  let Category = req.body.Category;
  if (!req.body.id) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("category").insert({ "name": Category }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      });
    });
  } else if (Category) {
    let id = ObjectId(req.body.id);
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("category").update({ _id: id }, { $set: { "name": Category } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      });
    });
    /*
    MongoClient.connect(url, { useNewUrlParser: true },  function(err, db) {
    if (err) throw err;
    var dbo = db.db(database);

    dbo.collection("products").update({_id: id},{$set:{title: title,subTitle: subTitle,price: price,desc: desc,off: off,number: number,status: status,TodayDate:TodayDate,TodayTime:TodayTime}},function(err,result){
      if (err) throw err;
      res.json({
              result :result,
            })
      db.close(); 
    });
  });*/
  } else {
    let id = ObjectId(req.body.id);
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("category").deleteOne({ _id: id }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      })
    })
  }
})
router.post('/ManageCart', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;
  let Type = req.body.Type;
  if (Type == "insert") {
    if (req.body.IsSeveralShop) {
      MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        var promise = new Promise(function (resolve, reject) {

          dbo.collection("cart").find({ "product_detail_id": ObjectId(req.body.PDId), "user_id": ObjectId(req.body.UId), "status": "0" }).toArray(function (err, result) {
            if (err) throw err;
            resolve(result)
          });

        })
        promise.then(function (value) {
          let prevNumber = value[0] ? value[0].number : 0;

          dbo.collection("cart").update({ "product_detail_id": ObjectId(req.body.PDId), "user_id": ObjectId(req.body.UId), "status": "0" }, { "product_id": ObjectId(req.body.PId), "number": parseInt(prevNumber) + parseInt(req.body.Number), "user_id": ObjectId(req.body.UId), "price": req.body.Price, "status": req.body.Status, "Color": req.body.Color, "Size": req.body.Size, SellerId: ObjectId(req.body.SellerId), "product_detail_id": ObjectId(req.body.PDId),category_id:ObjectId(req.body.category_id), PeykInfo: req.body.PeykInfo }, { upsert: true }, function (err, result) {
            if (err) throw err;
            res.json({
              result: result,
            })
            db.close();
          });

        }, function () {
          db.close();
        });
      });
    } else {

      MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        var promise = new Promise(function (resolve, reject) {
          dbo.collection("cart").find({ "product_id": ObjectId(req.body.PId), "user_id": ObjectId(req.body.UId), "status": "0" }).toArray(function (err, result) {
            if (err) throw err;
            resolve(result)
          });
        })
        promise.then(function (value) {
          let prevNumber = value[0] ? value[0].number : 0;
          dbo.collection("cart").update({ "product_id": ObjectId(req.body.PId), "user_id": ObjectId(req.body.UId), "status": "0" }, { "product_id": ObjectId(req.body.PId), "number": parseInt(prevNumber) + parseInt(req.body.Number), "user_id": ObjectId(req.body.UId),category_id:ObjectId(req.body.category_id), "price": req.body.Price, "status": req.body.Status, SellerId: ObjectId(req.body.SellerId), PeykInfo: req.body.PeykInfo }, { upsert: true }, function (err, result) {
            if (err) throw err;
            res.json({
              result: result,
            })
            db.close();
          });

        }, function () {
          db.close();
        });
      });
    }

  } else if (Type == "update") {
    let id = ObjectId(req.body.id);
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("category").update({ _id: id }, { $set: { "name": Category } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      });
    });
  } else {
    let id = ObjectId(req.body.id);
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("category").deleteOne({ _id: id }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      })
    })
  }
})
router.post('/setOrUpdateProduct', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let id = ObjectId(req.body.id);
  let set = req.body.set;
  let title = req.body.title;
  let subTitle = req.body.title2;
  let desc = req.body.desc;
  let price = req.body.price;
  let off = parseInt(req.body.off);
  let number = req.body.number;
  let Category = ObjectId(req.body.CategoryInProduct);
  let fileUploaded = req.body.fileUploaded;
  let fileUploaded1 = req.body.fileUploaded1;
  let fileUploaded2 = req.body.fileUploaded2;
  let fileUploaded3 = req.body.fileUploaded3;
  let fileUploaded4 = req.body.fileUploaded4;
  let status = req.body.status;
  let TodayDate = moment().locale('fa').format('YYYY/MM/DD');
  let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
  if (set) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("product").insert({ title: title, subTitle: subTitle, price: price, desc: desc, off: off, number: number, category_id: Category, fileUploaded: fileUploaded, fileUploaded1: fileUploaded1, fileUploaded2: fileUploaded2, fileUploaded3: fileUploaded3, fileUploaded4: fileUploaded4, status: status, TodayDate: TodayDate, TodayTime: TodayTime }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      });
    });
  } else {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("product").update({ _id: id }, { $set: { title: title, subTitle: subTitle, price: price, desc: desc, off: off, number: number, category_id: Category, status: status, TodayDate: TodayDate, TodayTime: TodayTime } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      });
    });
  }
})


router.post('/modifyComment', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("product_comment").update({ _id: ObjectId(req.body._id) }, { $set: { status: req.body.status } }, function (err, result) {
      if (err) throw err;
      res.json({
        result: result,
      })
      db.close();
    });
  });
});
router.post('/getComment', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body.ProductId) {
      let limit = req.body.limit || 5,
        skip = req.body.skip || 0;
      var promise1 = new Promise(function (resolve, reject) {


        dbo.collection('product_comment').aggregate([

          {

            $lookup: {
              from: "users",
              localField: "UserId",
              foreignField: "_id",
              as: "user"
            }
          }, {
            $match: {
              ProductId: ObjectId(req.body.ProductId), status: 1
            }
          },
          { $project: { "user.password": 0, "user.address": 0, "user.company": 0, "user.username": 0 } }
        ]
        ).skip(skip).limit(limit).toArray(function (err, result) {
          if (err) throw err;
          resolve(result);

        })


        /*dbo.collection("product_comment").find({ProductId: ObjectId(req.body.ProductId),status:1}).skip(skip).limit(limit).toArray(function(err, result) {
          if (err) throw err;
           resolve(result);
            
          db.close(); 
        });*/
      });
      promise1.then(function (value) {
        res.json({
          result: value
        })
        /* var obj_ids = ids.map(function(id) { return ObjectId(id); });
         dbo.collection("shops").find({UserId: {$in: ids}}).toArray(function(err, result) {
           if (err) throw err;
             res.json({
                   result :result
                 })  
             
           db.close(); 
         });*/

      }, function () {
        db.close();
      });

    } else {
      let limit = req.body.limit || 5,
        skip = req.body.skip || 0;
      var promise1 = new Promise(function (resolve, reject) {
        dbo.collection("product_comment").find({ status: req.body.status }).skip(skip).limit(limit).toArray(function (err, result) {
          if (err) throw err;
          resolve(result);

          db.close();
        });
      });
      promise1.then(function (value) {
        res.json({
          result: value
        })
        /* var obj_ids = ids.map(function(id) { return ObjectId(id); });
         dbo.collection("shops").find({UserId: {$in: ids}}).toArray(function(err, result) {
           if (err) throw err;
             res.json({
                   result :result
                 })  
             
           db.close(); 
         });*/

      }, function () {
        db.close();
      });
    }
  })
})
router.post('/setOrUpdateComment', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let set = req.body.set;
  let SellerId = ObjectId(req.body.SellerId);
  let UserId = ObjectId(req.body.UserId);
  let ProductId = ObjectId(req.body.ProductId);
  let CommentText = req.body.CommentText;
  let TodayDate = moment().locale('fa').format('YYYY/MM/DD');
  let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
  if (set) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("product_comment").insert({ SellerId: SellerId, UserId: UserId, ProductId: ProductId, CommentText: CommentText, status: 0, date: TodayDate + " " + TodayTime }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      });
    });
  } else {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("product").update({ _id: id }, { $set: { title: title, subTitle: subTitle, price: price, desc: desc, off: off, number: number, category_id: Category, status: status, TodayDate: TodayDate, TodayTime: TodayTime } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      });
    });
  }
})
router.post('/productTableAction', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  let id = ObjectId(req.body.id);
  let title = req.body.title;
  let subTitle = req.body.title2;
  let desc = req.body.desc;
  let price = req.body.price;
  let off = parseInt(req.body.off);
  let status = req.body.status;
  let Type = req.body.act;
  let TodayDate = moment().locale('fa').format('YYYY/MM/DD');
  let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
  //req.body : post
  //req.query : get
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (Type == "edit") {
      dbo.collection("product").insert({ title: title, subTitle: subTitle, price: price, desc: desc, off: off, number: number, status: status, TodayDate: TodayDate, TodayTime: TodayTime }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      });
    }
    if (Type == "delete") {
      dbo.collection("product").deleteOne({ _id: id }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      })
    }


  });
})
router.post('/getShops', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  let type = req.body.type;
  let id = req.body.id;
  let limit = req.body.limit ? req.body.limit : 10;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body.type == "best") {

      var promise1 = new Promise(function (resolve, reject) {
        dbo.collection("factor").find({ refId: { $ne: null } }).toArray(function (err, result) {
          if (err) throw err;
          var res1 = [];
          for (let i = 0; i < result.length; i++)
            res1.push(result[i].products)
          if (result) {
            var best = [];
            var ids = [];
            for (var j = 0; j < res1.length; j++) {
              var temp = res1[j][0].SellerId;
              if (ids.indexOf(temp) == -1) {
                var Count = 0;
                for (let i = 0; i < res1.length; i++) {
                  if (temp == res1[i][0].SellerId)
                    Count += parseInt(res1[i][0].number);

                }
                best.push({
                  id: temp,
                  count: Count
                })
              }
              ids.push(temp);


            }


            best.sort(function (a, b) {
              return b.count - a.count;
            })

            resolve(best);
          } else {
            reject();
          }
        })
      });
      promise1.then(function (value) {
        var ids = [];
        var C = value.length < limit ? value.length : limit;
        for (var i = 0; i < C; i++)
          ids.push(value[i].id)
        var obj_ids = ids.map(function (id) { return ObjectId(id); });
        dbo.collection("shops").find({ UserId: { $in: ids } }).toArray(function (err, result) {
          if (err) throw err;
          res.json({
            result: result
          })

          db.close();
        });

      }, function () {
        db.close();
      });
    }else{
      let condition = req.body.condition ? req.body.condition : {};
      //let condition = {};
      dbo.collection("shops").find(condition).limit(4).toArray(function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })

        db.close();  
      });
    }

  })
})
function roundPrice(price) {
  price = parseInt(price).toString();
  let C = "500";
  let S = 3;
  if (price.length <= 4) {
    C = "100";
    S = 2;
  }
  if (price.length <= 4) {
    C = "100";
    S = 2;
  }
  let A = price.substr(price.length - S, S)
  if (A == C || A == "000" || A == "00")
    return price;
  if (parseInt(A) > parseInt(C)) {
    let B = parseInt(A) - parseInt(C);
    return (parseInt(price) - B + parseInt(C)).toString();
  } else {
    let B = parseInt(C) - parseInt(A);
    return (parseInt(price) + B).toString();
  }


}
function MergeResult(result, params) {
  let inCart = (params && params.inCart == 1) ? 1 : 0;
  //result.sort((a,b) => (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0))

  for (let i = 0; i < result.length; i++) {
    if (result[i].product_detail && result[i].product_detail.length > 0) {
      if (!inCart) {
        result[i].ExpireDate = result[i].product_detail[0].ExpireDate;
        result[i].HarajDate = result[i].product_detail[0].HarajDate;
        result[i].HarajDate_Latin = result[i].product_detail[0].HarajDate_Latin;
        result[i].HarajType = result[i].product_detail[0].HarajType;
        result[i].Immediate = result[i].product_detail[0].Immediate;
        result[i].NoOff = result[i].product_detail[0].NoOff;
        result[i].PrepareTime = result[i].product_detail[0].PrepareTime;
        result[i].SellerId = result[i].product_detail[0].SellerId;
        result[i].ShowPriceAftLogin = result[i].product_detail[0].ShowPriceAftLogin;
        result[i].TodayDate = result[i].product_detail[0].TodayDate;
        result[i].TodayTime = result[i].product_detail[0].TodayTime;
        result[i].TypeOfSend = result[i].product_detail[0].TypeOfSend;
        result[i].number = result[i].product_detail[0].number;
        result[i].off = result[i].product_detail[0].off;
        result[i].price = result[i].product_detail[0].price;
        result[i].SelectedSize = result[i].product_detail[0].SelectedSize;
        result[i].SelectedColors = result[i].product_detail[0].SelectedColors;
      } else {
        for (let j = 0; j < result[i].products.length; j++) {
          result[i].products[j].ExpireDate = result[i].product_detail[j].ExpireDate;
          result[i].products[j].HarajDate = result[i].product_detail[j].HarajDate;
          result[i].products[j].HarajDate_Latin = result[i].product_detail[j].HarajDate_Latin;
          result[i].products[j].HarajType = result[i].product_detail[j].HarajType;
          result[i].products[j].Immediate = result[i].product_detail[j].Immediate;
          result[i].products[j].NoOff = result[i].product_detail[j].NoOff;
          result[i].products[j].PrepareTime = result[i].product_detail[j].PrepareTime;
          result[i].products[j].SellerId = result[i].product_detail[j].SellerId;
          result[i].products[j].ShowPriceAftLogin = result[i].product_detail[j].ShowPriceAftLogin;
          result[i].products[j].TodayDate = result[i].product_detail[j].TodayDate;
          result[i].products[j].TodayTime = result[i].product_detail[j].TodayTime;
          result[i].products[j].TypeOfSend = result[i].product_detail[j].TypeOfSend;
          result[i].products[j].number = result[i].product_detail[j].number;
          result[i].products[j].off = result[i].product_detail[j].off;
          result[i].products[j].price = result[i].product_detail[j].price;
          result[i].products[j].SelectedSize = result[i].product_detail[j].SelectedSize;
          result[i].products[j].SelectedColors = result[i].product_detail[j].SelectedColors;


          // result[i].products[j].product_id = result[i].product_detail[j]._id;

        }
      }

    }
    if (result[i].product && result[i].product.length > 0) {
      //result[i]._id = result[i].product[0]._id;
      result[i].title = result[i].product[0].title;
      result[i].subTitle = result[i].product[0].subTitle;
      result[i].Spec = result[i].product[0].Spec;
      result[i].Tags = result[i].product[0].Tags;
      result[i].desc = result[i].product[0].desc;
      result[i].category_id = result[i].product[0].category_id;
      result[i].fileUploaded = result[i].product[0].fileUploaded;
      result[i].fileUploaded1 = result[i].product[0].fileUploaded1;
      result[i].fileUploaded2 = result[i].product[0].fileUploaded2;
      result[i].fileUploaded3 = result[i].product[0].fileUploaded3;
      result[i].fileUploaded4 = result[i].product[0].fileUploaded4;
      //result[i].SellerId = result[i].product[0].SellerId;

    }
  }
  return result
}
function computeOff(result, levelOfUser, res, extra, inPayment) {
  var MongoClient = require('mongodb').MongoClient;
  /* res.json({   
           result :ress
         }) 
 return;*/
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);

    let ress = [];
    let Array = result;

    asyncLoop(Array, function (item, next) {
      let item1 = {};
      if (!item) {
        next();
        return;
      }
      if (inPayment && item.products)
        item1 = item.products[0];
      else
        item1 = item;
      if (!item1) {
        res.json({
          result: ress
        })
        return;
      }
      let id = item1._id;
      dbo.collection("offs").findOne({ "level": levelOfUser, product_id: id }, function (err, resultNew) {
        if (err) throw err;
        /*res.json({     
           result :resultNew[0].computedPrice
         }) 
         return;*/

        if (resultNew && resultNew.computedPrice) {
          item1.price = roundPrice(resultNew.computedPrice);
          if (!inPayment)
            ress.push(item1);
          else {
            item.products = [item1];
            ress.push(item);
          }
          next();
        }
        else if (resultNew && resultNew.formul) {
          if (!isNaN(resultNew.formul)) {
            item1.price = roundPrice(resultNew.formul);
            if (!inPayment)
              ress.push(item1);
            else {
              item.products = [item1];
              ress.push(item);
            }
            next();
          }
          else {


            var formul = JSON.parse(resultNew.formul),
              f_level = formul.level,
              f_off = formul.off,
              f_opr = formul.opr;
            if (f_level == levelOfUser) {
              item1.price = 0;

              item.products = [item1];
              ress.push(item);

              next();
            }
            dbo.collection("offs").findOne({ "level": f_level, product_id: id }, function (err, resultFinal) {

              if (resultFinal && resultFinal.formul && isNaN(resultFinal.formul)) {
                var formul1 = JSON.parse(resultFinal.formul),
                  f_level1 = formul1.level,
                  f_off1 = formul1.off,
                  f_opr1 = formul1.opr;
                dbo.collection("offs").findOne({ "level": f_level1, product_id: id }, function (err, resultFinal1) {
                  item1.price = roundPrice(eval(resultFinal1.formul + f_opr + (parseInt(resultFinal1.formul) * parseInt(f_off)) / 100))
                  if (!inPayment)
                    ress.push(item1);
                  else {
                    item.products = [item1];
                    ress.push(item);
                  }
                  next();
                })
              } else {
                if (resultFinal && resultFinal.formul)
                  item1.price = roundPrice(eval(resultFinal.formul + f_opr + (parseInt(resultFinal.formul) * parseInt(f_off)) / 100))
                if (!inPayment)
                  ress.push(item1);
                else {
                  item.products = [item1];
                  ress.push(item);
                }
                next();
              }

            })
          }
        } else {
          if (!inPayment)
            ress.push(item1);
          else {
            item.products = [item1];
            ress.push(item);
          }
          next();
        }




      });
    }, function (err) {
      if (err) {
        console.error('Error: ' + err.message);
        return;
      }
      /*if(inPayment){
        result[0].products=ress
        ress=result;
      }*/
      if (extra)
        res.json({
          result: ress,
          extra
        })
      else
        res.json({
          result: ress
        })

    });



  })

}
router.post('/getProducts', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  let type = req.body.type;
  let id = req.body.id;
  let limit = req.body.limit ? req.body.limit : 0;
  let levelOfUser = req.body.levelOfUser;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    var promiseFirst = new Promise(function (resolve, reject) {

      dbo.collection("setting").find({}).toArray(function (err, result) {
        if (err) throw err;
        resolve(result[0].SeveralShop);
      });
    })
    promiseFirst.then(function (IsSeveralShop) {
      if (type == "bestselling") {

        var promise1 = new Promise(function (resolve, reject) {
          dbo.collection("factor").find({ refId: { $ne: null } }).toArray(function (err, result) {
            if (err) throw err;
            var res1 = [];
            for (let i = 0; i < result.length; i++)
              res1.push(result[i].products)
            if (result) {
              var best = [];
              var ids = [];
              for (var j = 0; j < res1.length; j++) {
                var temp = res1[j][0]._id;
                if (ids.indexOf(temp) == -1) {
                  var Count = 0;
                  for (let i = 0; i < res1.length; i++) {
                    if (temp == res1[i][0]._id)
                      Count += parseInt(res1[i][0].number);

                  }
                  best.push({
                    id: temp,
                    count: Count
                  })
                }
                ids.push(temp);


              }


              best.sort(function (a, b) {
                return b.count - a.count;
              })

              resolve(best);
            } else {
              reject();
            }
          })
        });
        promise1.then(function (value) {
          var ids = [];
          var C = value.length < limit ? value.length : limit;
          for (var i = 0; i < C; i++)
            ids.push(value[i].id)
          var obj_ids = ids.map(function (id) { return ObjectId(id); });
          /*dbo.collection("product").find({_id: {$in: obj_ids}}).toArray(function(err, result) {
            if (err) throw err;
              computeOff(result,levelOfUser,res);
          });*/
          dbo.collection('product').aggregate([

            {

              $lookup: {
                from: "product_detail",
                localField: "_id",
                foreignField: "product_id",
                as: "product_detail"
              }
            }, {
              $match: {
                "_id": { $in: obj_ids }
              }
            }
          ]).sort({ number: -1 }).toArray(function (err, result) {
            if (err) throw err;
            result = MergeResult(result)
            computeOff(result, levelOfUser, res);
          })

        }, function () {
          db.close();
        });
        return;
      }
      if (type == "special") {
        if (!IsSeveralShop) {
          dbo.collection("product").find({ "status": "2" }).limit(10).toArray(function (err, result) {
            if (err) throw err;
            computeOff(result, levelOfUser, res);

          });
          return;
        }

        dbo.collection('product_detail').aggregate([

          {

            $lookup: {
              from: "product",
              localField: "product_id",
              foreignField: "_id",
              as: "product"
            }
          }, {
            $match: {
              "status": "2"
            }
          }
        ]).limit(10).sort({ number: -1 }).toArray(function (err, result) {
          if (err) throw err;
          result = MergeResult(result)
          computeOff(result, levelOfUser, res);
        })
        return;
      }

      if (type == "random") {
        dbo.collection('product').aggregate([
          {
            $lookup: {
              from: "product_detail",
              localField: "_id",
              foreignField: "product_id",
              as: "product_detail"
            }
          }, {
            $match: { fileUploaded: { $ne: "" } },

          }, {
            $sample: { size: limit }

          }
        ]).sort({ number: -1 }).toArray(function (err, result) {
          if (err) throw err;
          //result.map(function(val){console.log(val)})

          result = MergeResult(result)
          computeOff(result, levelOfUser, res);
        })

        /*dbo.collection('product').aggregate(
          [
              { $match: {fileUploaded:{$ne:""}} },
              { $sample: { size: limit } } 
          ]
      ).toArray(function(err, result) {
          computeOff(result,levelOfUser,res);
        })*/
        return;
      }
      if (type == 2) {
        dbo.collection('product').aggregate([

          {

            $lookup: {
              from: "product_detail",
              localField: "_id",
              foreignField: "product_id",
              as: "product_detail"
            }
          }, {
            $match: {
              "status": "2"
            }
          }
        ]).limit(1).sort({ number: -1 }).toArray(function (err, result) {
          if (err) throw err;
          result = MergeResult(result)
          computeOff(result, levelOfUser, res, { money: money });
        })

        /*dbo.collection("product").find({"status":"2"}).limit(1).toArray(function(err, result) {
          if (err) throw err;
          computeOff(result,levelOfUser,res,{money:money});
        });*/
        return;
      }
      if (type == "bestOff") {

        /*dbo.collection("product").find({off:{$ne: 0}}).sort( { off: -1 } ).limit(limit).toArray(function(err, result) {
          if (err) throw err;
          computeOff(result,levelOfUser,res);
        });*/
        dbo.collection('product').aggregate([

          {

            $lookup: {
              from: "product_detail",
              localField: "_id",
              foreignField: "product_id",
              as: "product_detail"
            }
          }, {
            $match: {
              "off": { $ne: 0 }
            }
          }
        ]).sort({ off: -1 }).limit(limit).toArray(function (err, result) {
          if (err) throw err;
          result = MergeResult(result)
          computeOff(result, levelOfUser, res);
        })
        return;
      }
      if (type == "new") {
        dbo.collection('product').aggregate([

          {

            $lookup: {
              from: "product_detail",
              localField: "_id",
              foreignField: "product_id",
              as: "product_detail"
            }
          }, {
            $match: {
              fileUploaded: { $ne: "" }
            }
          }
        ]).sort({ _id: -1 }).limit(limit).toArray(function (err, result) {
          if (err) throw err;
          result = MergeResult(result)
          computeOff(result, levelOfUser, res);
        })
        /*dbo.collection("product").find({fileUploaded:{$ne:""}}).sort( { _id: -1 } ).limit(limit).toArray(function(err, result) {
          if (err) throw err;
          computeOff(result,levelOfUser,res);
        });*/
        return;
      }
      if (!id) {
        if (limit != 0) {
          dbo.collection('product').aggregate([

            {

              $lookup: {
                from: "product_detail",
                localField: "_id",
                foreignField: "product_id",
                as: "product_detail"
              }
            }, {
              $match: {}
            }
          ]).sort({ number: -1 }).limit(limit).toArray(function (err, result) {
            if (err) throw err;
            result = MergeResult(result)
            computeOff(result, levelOfUser, res);
          })
          /*
            dbo.collection("product").find({}).limit(limit).toArray(function(err, result) {
              if (err) throw err;
              computeOff(result,levelOfUser,res);
            });*/
        } else {
          let TodayDate = moment().locale('fa').format('YYYY/MM/DD');

          if (type == "Haraj_Day") {
            if (!IsSeveralShop) {
              dbo.collection("product").find({ HarajDate: TodayDate, $where: "this.HarajDate === this.ExpireDate" }).limit(5).toArray(function (err, result) {
                if (err) throw err;
                computeOff(result, levelOfUser, res, { TodayDate: TodayDate });
              })
              return;
            }
            dbo.collection('product_detail').aggregate([

              {

                $lookup: {
                  from: "product",
                  localField: "product_id",
                  foreignField: "_id",
                  as: "product"
                }
              }, {
                $match: {
                  HarajDate: TodayDate,
                  $where: "this.HarajDate === this.ExpireDate"

                }
              }
            ]).limit(5).toArray(function (err, result) {
              if (err) throw err;
              result = MergeResult(result)
              computeOff(result, levelOfUser, res, { TodayDate: TodayDate });
            })

          } else if (type == "Haraj_Week") {
            if (!IsSeveralShop) {
              dbo.collection("product").find({ ExpireDate: { $gte: TodayDate }, $where: "this.HarajDate !== this.ExpireDate" }).limit(5).toArray(function (err, result) {
                if (err) throw err;
                computeOff(result, levelOfUser, res, { TodayDate: TodayDate });
              });
              return;
            }
            dbo.collection('product_detail').aggregate([

              {

                $lookup: {
                  from: "product",
                  localField: "product_id",
                  foreignField: "_id",
                  as: "product"
                }
              }, {
                $match: {
                  ExpireDate: { $gte: TodayDate },
                  $where: "this.HarajDate !== this.ExpireDate"

                }
              }
            ]).limit(5).toArray(function (err, result) {
              if (err) throw err;
              result = MergeResult(result)
              computeOff(result, levelOfUser, res, { TodayDate: TodayDate });
            })

          } else {
            if (!IsSeveralShop) {
              dbo.collection("product").find({ ExpireDate: { $gte: TodayDate } }).sort({ number: -1 }).limit(5).toArray(function (err, result) {
                if (err) throw err;
                computeOff(result, levelOfUser, res, { TodayDate: TodayDate });

              });
              return;
            }
            dbo.collection('product_detail').aggregate([

              {

                $lookup: {
                  from: "product",
                  localField: "product_id",
                  foreignField: "_id",
                  as: "product"
                }
              }, {
                $match: {
                  ExpireDate: { $gte: TodayDate }

                }
              }
            ]).sort({ number: -1 }).limit(5).toArray(function (err, result) {
              if (err) throw err;
              result = MergeResult(result)
              computeOff(result, levelOfUser, res, { TodayDate: TodayDate });
            })
          }

        }
      } else if (id) {
        if (!IsSeveralShop) {
          var promise = new Promise(function (resolve, reject) {
            dbo.collection('product').aggregate([

              {

                $lookup: {
                  from: "product_point",
                  localField: "_id",
                  foreignField: "product_id",
                  as: "points"
                }
              }, {
                $match: {
                  "_id": ObjectId(id)
                }
              }
            ]).sort({ number: -1 }).toArray(function (err, result) {
              dbo.collection("product_point").find({ user_id: req.body.UId, product_id: ObjectId(id) }).toArray(function (err, result1) {
                if (err) throw err;
                dbo.collection("users").find({ _id: ObjectId(req.body.UId) }).toArray(function (err, resultUser) {
                  if (err) throw err;
                  resolve({ res: result, rating: result1, user: resultUser })
                })
              })

            })

          })
          promise.then(function (value) {
            if (!value.res[0]) {
              computeOff(value.res, levelOfUser, res, { raiting: value.rating, IsSeveralShop: IsSeveralShop });
          
            } else {
              dbo.collection("shops").find({ _id: ObjectId(value.res[0].SellerId) }).toArray(function (err, result) {
                if (err) throw err;
                dbo.collection('product').aggregate([

                  {

                    $lookup: {
                      from: "category",
                      localField: "category_id",
                      foreignField: "_id",
                      as: "category"
                    }
                  }
                  , {
                    $match: {
                      "_id": value.res[0] && value.res[0].product && value.res[0].product.length > 0 ? value.res[0].product[0]._id : value.res[0]._id

                    }
                  }
                ]).sort({ number: -1 }).toArray(function (err, resultCat) {
                  if (value.user && value.user.length > 0) {
                    computeOff(value.res, levelOfUser, res, {  Time : moment().locale('fa').format('HH:mm'),WeekDay:moment().locale('fa').weekday(),user: { city: value.user ? value.user[0].city : '', subCity: value.user ? value.user[0].subCity : '' }, category: resultCat.length > 0 ? resultCat[0].category : [], raiting: value.rating, Seller: result, IsSeveralShop: IsSeveralShop });


                  } else {
                    computeOff(value.res, levelOfUser, res, {  Time : moment().locale('fa').format('HH:mm'),WeekDay:moment().locale('fa').weekday(),category: resultCat.length > 0 ? resultCat[0].category : [], raiting: value.rating, Seller: result, IsSeveralShop: IsSeveralShop });

                  }

                })
                /*res.json({
                      result :value.res,
                      raiting:value.rating,
                      Seller:result
                    })  
                
              db.close(); */
              });
            }

          }, function () {
            db.close();
          });
          return;
        }
        var promise = new Promise(function (resolve, reject) {
          dbo.collection('product_detail').aggregate([

            {

              $lookup: {
                from: "product",
                localField: "product_id",
                foreignField: "_id",
                as: "product"
              }
            },
            {

              $lookup: {
                from: "product_point",
                localField: "_id",
                foreignField: "product_id",
                as: "points"
              }
            }
            , {
              $match: {
                "_id": ObjectId(id)

              }
            }
          ]).sort({ number: -1 }).toArray(function (err, result) {
            if (err) throw err;
            result = MergeResult(result)
            dbo.collection("product_point").find({ user_id: req.body.UId, product_id: ObjectId(id) }).toArray(function (err, result1) {
              if (err) throw err;
              dbo.collection("users").find({ _id: ObjectId(req.body.UId) }).toArray(function (err, resultUser) {
                if (err) throw err;
                resolve({ res: result, rating: result1, user: resultUser })
              })
            })

          })

        })
        promise.then(function (value) {
          if (!value.res[0]) {
            computeOff(value.res, levelOfUser, res, { user: value.user, raiting: value.rating, IsSeveralShop: 1 });

          } else {
            dbo.collection("shops").find({ _id: ObjectId(value.res[0].SellerId) }).toArray(function (err, result) {
              if (err) throw err;
              dbo.collection('product').aggregate([

                {

                  $lookup: {
                    from: "category",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category"
                  }
                }
                , {
                  $match: {
                    "_id": value.res[0].product[0]._id

                  }
                }
              ]).sort({ number: -1 }).toArray(function (err, resultCat) {
                computeOff(value.res, levelOfUser, res, { Time : moment().locale('fa').format('HH:mm'),WeekDay:moment().locale('fa').weekday(),user: { city: (value.user && value.user.length > 0) ? value.user[0].city : '', subCity: (value.user && value.user.length > 0) ? value.user[0].subCity : '' }, category: resultCat.length > 0 ? resultCat[0].category : [], raiting: value.rating, Seller: result, IsSeveralShop: 1 });
              })
            });
          }

        }, function () {
          db.close();
        });

      }

    })

  });
})
router.post('/getCartPerId', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  let UId = req.body.UId;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);

    dbo.collection('cart').aggregate([
      {

        $lookup: {
          from: "product_detail",
          localField: "product_detail_id",
          foreignField: "_id",
          as: "product_detail"
        }
      },
      {

        $lookup: {
          from: "product",
          localField: "product_id",
          foreignField: "_id",
          as: "products"
        }
      },
      {
        $lookup: {
          from: "shops",
          localField: "SellerId",
          foreignField: "_id",
          as: "Seller"
        }
      },
      {
        $lookup: {
          from: "category",
          localField: "category_id",
          foreignField: "_id",
          as: "Category"
        }
      },
      {
        $match: {
          "user_id": ObjectId(UId),
          "status": "0"
        }
      }
    ]).toArray(function (err, result) {
      if (err) throw err;
      result = MergeResult(result, { inCart: 1 })
      computeOff(result, req.body.levelOfUser, res, null, 1);

    })
  })
})
router.post('/changeCart', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  let PDId = req.body.product_id;
  let user_id = req.body.user_id;
  let type = req.body.type;
  let num = req.body.number;


  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    var promise = new Promise(function (resolve, reject) {
      dbo.collection("setting").find({}).toArray(function (err, result) {
        if (err) throw err;

        resolve(result[0].SeveralShop)

      });
    });
    promise.then(function (value) {
      let set = !req.body.newPrice ? { number: num } : { price: req.body.newPrice,number: num }
      if (value) {
        
        if (num == "0") {
          dbo.collection("cart").deleteOne({ product_detail_id: ObjectId(PDId) }, function (err, result) {
            if (err) throw err;
            res.json({
              result: result,
            })
            db.close();

          })
          return;
        }
        dbo.collection("cart").update({ product_detail_id: ObjectId(PDId), user_id: ObjectId(user_id), status: "0" }, { $set: set }, function (err, result) {
          if (err) throw err;

          res.json({
            result: result,
          })
          db.close();
        });
      } else {
        if (num == "0") {
          dbo.collection("cart").deleteOne({ product_id: ObjectId(PDId) }, function (err, result) {
            if (err) throw err;
            res.json({
              result: result,
            })
            db.close();

          })
          return;
        }
        dbo.collection("cart").update({ product_id: ObjectId(PDId), user_id: ObjectId(user_id), status: "0" }, { $set: set }, function (err, result) {
          if (err) throw err;

          res.json({
            result: result,
          })
          db.close();
        });
      }

    })

  })


})
router.post('/payment', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    userId = req.body.userId;
    let username = "";
    var promise1 = new Promise(function (resolve, reject) {
      dbo.collection("users").find({ _id: ObjectId(userId) }).toArray(function (err, result) {
        if (err) throw err;
        if (result[0] && result[0].username) {
          resolve(result[0]);
        } else {
          reject();
        }
      })
    });
    promise1.then(function (value) {
      const zarinpal = ZarinpalCheckout.create(setting.ZarinpalCode, false);
      let finallAmount = parseInt(req.body.finallAmount).toString();

      let NowDate = moment().locale('fa').format('YYYY/MM/DD HH:mm:SS');
      let Day = moment().locale('fa').format('YYYY/MM/DD');
      let Time = moment().locale('fa').format('HH:mm:SS');
      debugger;
      if (req.body.needPay) {
        let username = value.username,
          address = value.address;

        dbo.collection("factor").insertOne({ user_id: req.body.userId, username: username, address: address, refId: null, paykAmount: req.body.paykAmount, Amount: req.body.Amount, finallAmount: finallAmount, Credit: req.body.Credit, products: req.body.products_id, status: "0", Date: NowDate, Day: Day, Time: Time }, function (err, result) {
          if (err) throw err;
          zarinpal.PaymentRequest({
            Amount: parseInt(finallAmount), // In Tomans
            CallbackURL: siteUrl + '#/invoice?_id=' + result.ops[0]._id + '&userId=' + req.body.userId + '&Amount=' + req.body.finallAmount + '&Credit=' + req.body.Credit + '&InMobileApp=' + req.body.InMobileApp + '',
            Description: siteUrl,
            Email: 'saeedjafarimail@gmail.com',
            Mobile: username
          }).then(response => {
            if (response.status === 100) {
              dbo.collection("payment").insert({ refId: null, Date: NowDate, paykAmount: req.body.paykAmount, amount: req.body.Amount, finallAmount: finallAmount, Credit: req.body.Credit, desc: 'خرید محصول از سایت', factorId: result.ops[0]._id, username: username }, function (err, result) {
                if (err) throw err;
                res.json({
                  result: response.url
                })
                db.close();
              });
            }
          }).catch(err => {
            console.error(err);
          });
          /*
            var data = {
              BrName: '',
              BrCode: 1280,
              AccNo: 11579,
              Amount: "10,000",
              Des: 2,
              Info: 2
            };
            var options = {
              hostname: 'r-bank.ir',
              port: 80,
              path: '/PaymentGW',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            };
            var httpreq = http.request(options, function (response) {
              var buffer = ""
          
              response.on("data", function (chunk) {
                  buffer += chunk;
              }); 
          
              response.on("end", function (err) {
          
                  res.json({
                      result:buffer
                  })
              }); 
            });
            httpreq.write(JSON.stringify(data));
            httpreq.end();*/

        });
      } else {
        let refId = cryptoRandomString({ length: 8, characters: '123456789' });
        let OrderId = cryptoRandomString({ length: 8, characters: '1234567890' });
        dbo.collection("factor").insertOne({ user_id: req.body.userId, username: value, refId: refId,OrderId:OrderId, paykAmount: req.body.paykAmount, Amount: req.body.Amount, finallAmount: finallAmount, products: req.body.products_id, status: "1", Date: NowDate, Day: Day, Time: Time }, function (err, result) {
          if (err) throw err;
          dbo.collection("cart").deleteMany({ user_id: ObjectId(req.body.userId) }, function (err3, result3) {
            if (err) throw err;

            res.json({
              result: value,
              refId: refId
            })

          })
        })

      }
    }, function () {
      db.close();
    });

  })

})


router.post('/payment2', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let userId = req.body.userId;
    let CatId = req.body.CatId;
    let username = "";
    var promise1 = new Promise(function (resolve, reject) {
      dbo.collection("users").find({ _id: ObjectId(userId) }).toArray(function (err, result) {
        if (err) throw err;
        if (result[0] && result[0].username) {
          resolve(result[0]);
        } else {
          reject();
        }
      })
    });
    promise1.then(function (value) {
      let username = value.username,
        address = value.address;
      let name = value.name;  
      let NowDate = moment().locale('fa').format('YYYY/MM/DD HH:mm:SS');
      let Day = moment().locale('fa').format('YYYY/MM/DD');
      let Time = moment().locale('fa').format('HH:mm:SS');
      let finalAmount = parseInt(req.body.finalAmount).toString() + "0";

      if (req.body.needPay) {
        let OrderId = cryptoRandomString({ length: 8, characters: '1234567890' });
        let InMobileApp = req.body.InMobileApp == "1" ? "1" : "0";
        new Promise(function (resolve, reject) {
          let CatIds = [];

          for (const p of req.body.products_id) {
            CatIds.push(ObjectId(p.CatId));
          }
          dbo.collection("category").find({ _id: { $in: CatIds } }).toArray(function (err, result) {
            if (err) throw err;
            for (const p of req.body.products_id) {
              for (let i = 0; i < result.length > 0; i++) {
                if (p.CatId == result[i]._id.toString()) {
                  p.Commission = result[i].Commission ? (parseInt(result[i].Commission) * ((parseInt(p.price))+parseInt(p.credit||0))) / 100 : 0;

                }
              }  

            }
            let param = { NowDate, finalAmount, OrderId, InMobileApp, address, username };
            resolve(param);

          })
        }).then(function (value) {

          dbo.collection("factor").insertOne({ user_id: req.body.userId, username: value.username, address: value.address, refId: null, paykAmount: req.body.paykAmount, finalAmount: req.body.finalAmount, Amount: req.body.Amount, Credit: req.body.Credit, products: req.body.products_id, status: "0", Date: value.NowDate, OrderId: value.OrderId, InMobileApp: InMobileApp, Day: Day, Time: Time }, function (err, result0) {
            if (err) throw err;
            let pin = setting.ParsianPin,
                terminal = setting.ParsianTerminal;
            var soap = require('soap');
            let inMobileApp = req.body.InMobileApp == "1" ? "1" : "0";
            var urlParsian = 'https://pec.shaparak.ir/NewIPGServices/Sale/SaleService.asmx?WSDL';
            let Amount = req.body.Amount;

            var requestData = { requestData: { "LoginAccount": pin, "Amount": value.finalAmount,"SaleFromMultiShops":req.body.SaleFromMultiShops, "OrderId": value.OrderId, "CallBackUrl": serverUrl+"MainApi/verification2" } };

            soap.createClient(urlParsian, function (err, client) {
              client.SalePaymentRequest(requestData, function (err, result) {
                dbo.collection("payment").insert({ refId: null, Date: NowDate, paykAmount: req.body.paykAmount, amount: req.body.Amount, finalAmount: req.body.finalAmount, Credit: req.body.Credit, desc: 'خرید محصول از سایت', factorId: result0.ops[0]._id, username: username }, function (err, result2) {
                  if (err) throw err;
                  res.json({
                    result: result
                  })
                  db.close();  
                });

              });
            });



          });

        })


      } else {
        let refId = cryptoRandomString({ length: 8, characters: '123456789' });
        let OrderId = cryptoRandomString({ length: 8, characters: '123456789' });
        new Promise(function (resolve, reject) {
          let CatIds = [];

          for (const p of req.body.products_id) {
            CatIds.push(ObjectId(p.CatId));
          }
          dbo.collection("category").find({ _id: { $in: CatIds } }).toArray(function (err, result) {
            if (err) throw err;
            for (const p of req.body.products_id) {
              for (let i = 0; i < result.length > 0; i++) {
                if (p.CatId == result[i]._id.toString()) {
                  p.Commission = result[i].Commission ? (parseInt(result[i].Commission) * ((parseInt(p.price))+parseInt(p.credit||0))) / 100 : 0;

                }
              }  

            }
            let param = { };
            resolve(param);

          })
        }).then(function (value) {
          
        dbo.collection("factor").insertOne({ user_id: req.body.userId, username: username, refId: refId,OrderId:OrderId, paykAmount: req.body.paykAmount, Amount: req.body.Amount, finalAmount: req.body.finalAmount, Credit: req.body.Credit, products: req.body.products_id, status: "1", Date: NowDate, Day: Day, Time: Time,InPlace:!req.body.InRaymand ? 1 : 0 ,InRaymand:req.body.InRaymand }, function (err, result) {
          if (err) throw err;
          
          var promise2 = new Promise(function (resolve2, reject2) {
            let table = req.body.SeveralShop ? "product_detail" : "product"
            var bulk = dbo.collection(table).initializeUnorderedBulkOp();
            req.body.products_id.forEach(function (doc) {
              if(table == "product_detail")
                bulk.find({ product_id: ObjectId(doc._id), SellerId: ObjectId(doc.SellerId) }).update({ $inc: { number: -1 * doc.number } });
              else
                bulk.find({ _id: ObjectId(doc._id)}).update({ $inc: { number: -1 * doc.number } });
    
            })
            bulk.execute();
            resolve2({});
          })
          promise2.then(function (Param2) {
          dbo.collection("cart").deleteMany({ user_id: ObjectId(req.body.userId) }, function (err3, result3) {
            if (err) throw err;
            new Promise(function (resolve, reject) {

              dbo.collection("setting").find({}).toArray(function (err, result00) {
                if (err) throw err;
                resolve(result00[0])
              });
      
            }).then(function (result0) {
              let text="";
              if(req.body.SaleFromMultiShops){
                for(let i=0; i< req.body.products_id.length  ; i++){
                  if(req.body.products_id[i].SellerMobile){
                    text = "فروشنده محترم سفارش شماره "+refId+" با وضعیت پرداخت در محل ثبت شد" + "\n نام خریدار : " + name + "\n" + "لیست سفارش : " + "\n" 
                               + req.body.products_id[i].title + "(" + req.body.products_id[i].number + "عدد" + ")" + "\n" +  result0.STitle
                    SendSms(text, req.body.products_id[i].SellerMobile, result0);
                  }
                
                }
              }else{
                text="فروشنده محترم سفارش شماره "+refId+" با وضعیت پرداخت در محل ثبت شد" + "\n نام خریدار : " + name + "\n" + "لیست سفارش : " + "\n" ;
                for(let i=0; i< req.body.products_id.length  ; i++){
                  text+= req.body.products_id[i].title + "(" + req.body.products_id[i].number + "عدد" + ")" + "\n" 
                }
                text += result0.STitle;
                if(req.body.products_id[0].SellerMobile){
                  SendSms(text, req.body.products_id[0].SellerMobile, result0);
                }
              }
              if(AdminMobile && AdminMobile !="")
                SendSms(text, "09139074286", result0);
              dbo.collection("users").findOneAndUpdate({ _id: ObjectId(req.body.userId) }, { $inc: { credit: -1 * req.body.Credit||0 } }, function (err, resultUser) {
                res.json({
                  result: username,  
                  refId: refId,
                  credit:resultUser.value.credit
                })

              })
              
              
            })
          })
        })
        })

      })

      }
    }, function () {
      db.close();
    });

  })

})
router.post('/getCreditPayment', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection('credit_payment').aggregate([

      {

        $lookup: {
          from: "shops",
          localField: "ShopId",
          foreignField: "_id",
          as: "shop"
        }
      }, {
        $match: {username:req.body.username}
      }
    ]).limit(req.body.limit||1000).sort({Date: -1, Time: -1}).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
      db.close();

    })
    
  })
})


router.post('/extraPayment', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let TodayDate = moment().locale('fa').format('YYYY/M/D');
    let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
    if(!req.body.edit){
      dbo.collection("extra_payment").insertOne({ username: req.body.username, RaymandAcc: req.body.RaymandAcc  , RaymandId: req.body.RaymandId,Amount:req.body.Amount,Time:TodayTime,Date:TodayDate,Date_c:Date.parse(TodayDate),type:req.body.type,desc:req.body.desc,status:req.body.status, RefId:null }, function (err, result) {
        if (err) throw err;
        res.json({
          result:1
      })
      });
    }else{
      dbo.collection("extra_payment").updateOne({ "username": req.body.username, "status": 0 , RefId:null  }, { $set: { "status": req.body.status,EditTime:TodayTime,EditDate:TodayDate,EditDate_c:Date.parse(TodayDate),RefId:req.body.RefId } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })

      })
    }
    
  })
})



router.post('/setCredit', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let TodayDate = moment().locale('fa').format('YYYY/M/D');
    let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
    let ShopName = "تراکنش سیستمی";
    if(req.body.Step != 2) {
      debugger;
      new Promise(function (resolve, reject) {

        dbo.collection("users").find({username:req.body.username}).toArray(function (err, result) {
          if (err) throw err;
          resolve(result[0])
        });
      
      }).then(function (result) {
        if(result.credit < req.body.Amount){
            res.json({
                error:1,
                message:'موجودی شما کافی نیست'
            })
            return;
        }else{
          dbo.collection("shops").find({_id:ObjectId(req.body.ShopId)}).toArray(function (err, result) {
            if (err) throw err;
            ShopName = "فروشگاه : "+result[0].name;
            let Comm = result[0].CreditCommission ? ((((parseInt(result[0].CreditCommission))*parseInt(req.body.Amount))/100)): 0;
            res.json({
              result:Comm
            })
          });
        }
      })
    }else{
      let type = req.body.payType ? 1 : 0;
      if(parseInt(req.body.Amount) <= 0 ){
        res.json({
          result:0
        })  
        return;
      }
      new Promise(function (resolve, reject) {
        dbo.collection("credit_payment").insertOne({ username: req.body.username, ShopId: req.body.ShopId ?  ObjectId(req.body.ShopId) : null , Amount: req.body.Amount, commission: req.body.commission,Date:TodayDate,Time:TodayTime,Date_c:Date.parse(TodayDate),type:type,desc:req.body.desc,cleared:0 }, function (err, result) {
          if (err) throw err;
          resolve()
        });
      }).then(function () {

          if(req.body.username != "system"){
            dbo.collection("users").findOneAndUpdate({ "username": req.body.username}, { $inc: { credit: (type ? 1 : -1) * parseInt(req.body.Amount) } }, function (err, result) {
              if (err) throw err;
              dbo.collection("setting").find({}).toArray(function (err, result00) {
                if (err) throw err;
                let lastCredit = type ? parseInt(result.value.credit||0) + parseInt(req.body.Amount) : parseInt(result.value.credit||0) - parseInt(req.body.Amount)
                let text = type ? 'واریز اعتبار مهرکارت \n مبلغ : '+req.body.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' تومان \n موجودی : '+lastCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' تومان'  : 'برداشت از اعتبار مهرکارت \n مبلغ : '+req.body.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' تومان \n موجودی : '+lastCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' تومان  \n '+ShopName+''
                SendSms(text, req.body.username, result00[0]);
                
                res.json({
                  result:lastCredit
                })  
  
              });
              
            });
          }else{
            dbo.collection("shops").findOneAndUpdate({ "_id": ObjectId(req.body.ShopId)}, { $inc: { credit: (type ? 1 : -1) * parseInt(req.body.Amount) } }, function (err, result) {
              if (err) throw err;
              dbo.collection("setting").find({}).toArray(function (err, result00) {
                if (err) throw err;
                let lastCredit = type ? parseInt(result.value.credit||0) + parseInt(req.body.Amount) : parseInt(result.value.credit||0) - parseInt(req.body.Amount)
                let text = type ? 'واریز اعتبار مهرکارت \n مبلغ : '+req.body.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' تومان \n موجودی : '+lastCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' تومان'  : 'برداشت از اعتبار مهرکارت \n مبلغ : '+req.body.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' تومان \n موجودی : '+lastCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' تومان  \n '+ShopName+''
                SendSms(text, result.value.mobile, result00[0]);
                
                res.json({
                  result:lastCredit
                })  
  
              });
                
            });
          }
          
      })
    }
  })
})
router.post('/verification2', function (req, res, next) {
  try {


    let pin = setting ? setting.ParsianPin : null,
      terminal = setting ? setting.ParsianTerminal : null;
    var soap = require('soap');
    var urlParsian = 'https://pec.shaparak.ir/NewIPGServices/Confirm/ConfirmService.asmx?WSDL';
    var requestData = { requestData: { "LoginAccount": pin, "Token": req.body.Token } };
    var MongoClient = require('mongodb').MongoClient;
    let InMobileApp = "0";
    let Credit = 0;
    if (setting && req.body.status == "0") {


      soap.createClient(urlParsian, function (err, client) {
        client.ConfirmPayment(requestData, function (err, result) {
          let EndResult = result ? result.ConfirmPaymentResult : null;
          if (EndResult && EndResult.Status == 0 && EndResult.RRN > 0 && EndResult.Token > 0) {
            var RefId = EndResult.RRN;

            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
              if (err) throw err;
              var dbo = db.db(database);
              var promise = new Promise(function (resolve, reject) {
                dbo.collection("factor").findOneAndUpdate({ OrderId: req.body.OrderId }, { $set: { refId: RefId, status: "1" } }, function (err, result) {
                  if (err) throw err;

                  InMobileApp = result.value.InMobileApp == "1" ? "1" : "0";
                  Credit = result.value.Credit || 0;

                  dbo.collection("cart").deleteMany({ user_id: ObjectId(result.value.user_id) }, function (err3, result3) {
                    if (err) throw err;

                    dbo.collection("payment").update({ factorId: ObjectId(result.value._id) }, { $set: { refId: RefId } }, function (err2, result2) {
                      if (err2) throw err2;
                      var p = {
                        RefId: RefId, _id: result.value._id, InMobileApp: InMobileApp, Credit: Credit, User_Id: result.value.user_id,products:result.value.products
                      }

                      resolve(p);
                      db.close();
                    });

                  })


                });
              })
              promise.then(function (Param) {

                MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                  if (err) throw err;
                  var dbo = db.db(database);
                  dbo.collection("factor").find({ _id: ObjectId(Param._id) }).toArray(function (err, result) {
                    if (err) throw err2;
                    let ids = [];
                    var promise2 = new Promise(function (resolve2, reject2) {
                      let CreditAmount = 0;
                      var bulk = dbo.collection("product_detail").initializeUnorderedBulkOp();
                      result[0].products.forEach(function (doc) {
                        CreditAmount += doc.credit ? parseInt(doc.credit) : 0;
                        bulk.find({ product_id: ObjectId(doc._id), SellerId: ObjectId(doc.SellerId) }).update({ $inc: { number: -1 * doc.number } });
                      })
                      bulk.execute();
                      var p = {
                        CreditAmount: CreditAmount, User_Id: Param.User_Id, RefId: Param.RefId,products:result[0].products
                      }
                      resolve2(p);
                    })
                    promise2.then(function (Param2) {
                      dbo.collection("users").findOneAndUpdate({ _id: ObjectId(Param2.User_Id) }, { $inc: { credit: -1 * Param2.CreditAmount } }, function (err, resultUser) {
                        if (err) throw err;
                        //+'&credit='+result[0].credit
                        new Promise(function (resolve, reject) {

                          dbo.collection("setting").find({}).toArray(function (err, result00) {
                            if (err) throw err;
                            resolve(result00[0])
                          });
                  
                        }).then(function (result0) {

                          let text="";
                          if(req.body.SaleFromMultiShops){
                            for(let i=0; i< Param2.products.length  ; i++){
                                text = "فروشنده محترم سفارش شماره "+Param2.RefId+" با وضعیت پرداخت در محل ثبت شد"  + "\n" + "لیست سفارش : " + "\n" 
                                           + Param2.products[i].title + "(" + Param2.products[i].number + "عدد" + ")" + "\n" +  result0.STitle
                                SendSms(text, Param2.products[i].SellerMobile, result0);
                            }
                          }else{
                            text="فروشنده محترم سفارش شماره "+Param2.RefId+" با وضعیت پرداخت در محل ثبت شد" +  "\n" + "لیست سفارش : " + "\n" ;
                            for(let i=0; i< Param2.products.length  ; i++){
                              text+= Param2.products[i].title + "(" + Param2.products[i].number + "عدد" + ")" + "\n" 
                            }
                            text += result0.STitle;
                            SendSms(text, Param2.products[0].SellerMobile, result0);
                          }
                          if(AdminMobile && AdminMobile !="")
                            SendSms(text, "09139074286", result0);


                          
                          res.writeHead(301,
                            { Location: siteUrl + '#/invoice?refId=' + Param2.RefId + '&InMobileApp=' + InMobileApp + '&userId=' + Param2.User_Id }
                          );
                          res.end();
                            
                          
                          //db.close();
                        })
                        
                      })


                    })
                  });
                })


              });
            })
          } else {
            res.writeHead(301,
              { Location: siteUrl + '#/invoice?refId=-1' }
            );
            res.end();
          }

        })

      })
    }
    else {
      res.writeHead(301,
        { Location: siteUrl + '#/invoice?refId=-1' }
      );
      res.end();
    }
  } catch (e) {
    res.writeHead(301,
      { Location: siteUrl + '#/invoice?refId=-1' + e.message }
    );
    res.end();
  }
})
router.post('/verification', function (req, res, next) {
  const zarinpal = ZarinpalCheckout.create(setting.ZarinpalCode, false);

  zarinpal.PaymentVerification({
    Amount: req.body.Amount, // In Tomans
    Authority: req.body.Authority,
    userId: req.body.userId
  }).then(response => {
    if (response.status === -21) {
      res.json({
        result: "Empty"
      })
    } else {
      var RefId = response.RefID;
      var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        var promise = new Promise(function (resolve, reject) {
          dbo.collection("factor").update({ _id: ObjectId(req.body._id) }, { $set: { refId: RefId, status: "1" } }, function (err, result) {
            if (err) throw err;
            dbo.collection("cart").deleteMany({ user_id: ObjectId(req.body.userId) }, function (err3, result3) {
              if (err) throw err;
              dbo.collection("payment").update({ factorId: ObjectId(req.body._id) }, { $set: { refId: RefId } }, function (err2, result2) {
                if (err2) throw err2;

                /*res.json({
                  result:RefId
                })*/
                resolve(response.RefID);
                db.close();
              });

            })


          });
        })
        promise.then(function (RefId) {
          MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db(database);
            dbo.collection("factor").find({ _id: ObjectId(req.body._id) }).toArray(function (err, result) {
              if (err) throw err2;
              let ids = [];

              /*
              var bulk = dbo.collection("product").initializeUnorderedBulkOp();

              result[0].products.forEach(function(doc){
                bulk.find( { _id: ObjectId(doc._id) } ).update( { $inc: {number: -1*doc.number} } );
              })
              bulk.execute();
              */
              var bulk = dbo.collection("product_detail").initializeUnorderedBulkOp();

              result[0].products.forEach(function (doc) {
                bulk.find({ product_id: ObjectId(doc._id), Seller: doc.SellerId }).update({ $inc: { number: -1 * doc.number } });
              })
              bulk.execute();
              // پیدا کردن تمام خریدهای یوزر و محاسبه ی سطح کاربری بر اساس میزان خرید و آپدیت جدول یوزر
              res.json({
                result: RefId
              })
              db.close();
            });
          })


        });
      })

    }
  }).catch(err => {
    console.error(err);
  });

})
router.post('/searchItems', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let Conditions = { "title": { $regex: req.body.title, $options: 'i' } };
  let levelOfUser = req.body.levelOfUser;
  let finalResult = [];
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    try {
      dbo.collection('product').aggregate([

        {

          $lookup: {
            from: "product_detail",
            localField: "_id",
            foreignField: "product_id",
            as: "product_detail"
          }
        }, {
          $match: ((!req.body.Main && !req.body.SellerId) || req.body.Main) ? {
            $or: [{ title: new RegExp(req.body.title, "i") }, { subTitle: new RegExp(req.body.title, "i") }]
          } : {
              $or: [{ title: new RegExp(req.body.title, "i") }, { subTitle: new RegExp(req.body.title, "i") }],
              $and: [{ SellerId: { $in: [ObjectId(req.body.SellerId)] } }]

            }
            
        }
      ]).limit(6).toArray(function (err, result) {
        if (err) throw err;
        /*{Tags: { $elemMatch: {title:new RegExp(req.body.title, "i")} }}*/
        result = MergeResult(result);
        finalResult = result;
        dbo.collection("category").find({ name: new RegExp(req.body.title, "i") }).limit(2).toArray(function (err, result2) {
          finalResult = finalResult.concat(result2)
          dbo.collection("tags").find({ title: new RegExp(req.body.title, "i") }).limit(2).toArray(function (err, result3) {
            finalResult = finalResult.concat(result3)
            res.json({
              result: finalResult
            })
            db.close();
          })


          

        })

      })
    } catch (e) {
      res.json({
        result: []
      })
    }

  });
})
router.post('/searchTags', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    try {
      dbo.collection("tags").find({title: new RegExp(req.body.title, "i")}).toArray(function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
        db.close();
      })
    } catch (e) {
      res.json({
        result: []
      })
    }
  });
})
router.post('/getFactors', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let Conditions;
  if (req.body.Stat)
    Conditions = { user_id: req.body.user_id, status: { $in: req.body.Stat } };
  else
    Conditions = { user_id: req.body.user_id };
  if (req.body.refId)
    Conditions = { refId: req.body.refId };
  if (req.body.Cancel) {
    Conditions = { status: "4" };

  }
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("factor").find(Conditions).toArray(function (err, result) {
      if (err) throw err;
      if (req.body.Cancel) {
        let ress = [];
        for (let r of result) {
          if (!r.ReciveDate)
            continue;
          let LastTime = moment.from(r.ReciveDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');

          let Time = moment(LastTime).fromNow(true);

          if (Time.indexOf("minutes") > -1 || Time.indexOf("hour") > -1 || Time.indexOf("a day") > -1 || Time.indexOf("2 days") > -1 || Time.indexOf("3 days") > -1 || Time.indexOf("4 days") > -1 || Time.indexOf("5 days") > -1 || Time.indexOf("6 days") > -1) {
            ress.push(r);
          }
        }
        res.json({
          result: ress
        })
        db.close();
        return;

      }

      res.json({
        result: result
      })
      db.close();
    });
  });
})
router.post('/getPayment', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  var promise = new Promise(function (resolve, reject) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("users").find({ _id: ObjectId(req.body.user_id) }).toArray(function (err, result) {

        if (err) throw err;
        if (result[0])
          resolve(result[0].username);
        db.close();
      });
    });
  })
  promise.then(function (username) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      let limit = req.body.limit || 100;
      if (req.body.OkPayment == "1") {
        dbo.collection("payment").find({ username: username, refId: { $ne: null } }).toArray(function (err, result) {
          if (err) throw err;
          res.json({
            result: result
          })
          db.close();
        });
      } else {
        dbo.collection("payment").find({ username: username, refId: null }).limit(limit).toArray(function (err, result) {
          if (err) throw err;
          res.json({
            result: result
          })
          db.close();
        });
      }
    });

  })

})
router.post('/GetBrands', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = req.body.showInSite ? { showInSite: req.body.showInSite } : {};
    dbo.collection("brands").find(condition).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
    });

  })

})
router.post('/getPics', function (req, res, next) {
  let forShowInSite = req.body.forShowInSite;

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = req.body.condition ? req.body.condition : {};
    dbo.collection("pics").find(condition).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
    });

  })

})
router.post('/SetPoint', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("product_point").update({ "user_id": ObjectId(req.body.userId), "product_id": ObjectId(req.body.productId) }, { "user_id": ObjectId(req.body.userId), "product_id": ObjectId(req.body.productId), point: req.body.rating }, { upsert: true }, function (err, result) {

      if (err) throw err;
      res.json({
        result: result
      })
    });

  })

})
router.post('/getSimilarProducts', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    var promise = new Promise(function (resolve, reject) {
      dbo.collection('product_detail').aggregate([

        {

          $lookup: {
            from: "product",
            localField: "product_id",
            foreignField: "_id",
            as: "product"
          }
        },
        {

          $lookup: {
            from: "shops",
            localField: "SellerId",
            foreignField: "_id",
            as: "Seller"
          }
        }, {
          $match: {
            "product_id": ObjectId(req.body.ProductId),
            "SellerId": { $ne: ObjectId(req.body.SellerId) },
            "number": { $ne: 0 }

          }
        }
      ]).toArray(function (err, result) {
        if (err) throw err;
        result = MergeResult(result)
        resolve({ res: result })
        /*dbo.collection("product_point").find({ user_id: req.body.UId,product_id:ObjectId(req.body.ProductId)} ).toArray(function(err, result1) {
          if (err) throw err;
          resolve({res:result,rating:result1})

          }); */
      })

    })
    promise.then(function (value) {
      //if(!value.res[0]){
      computeOff(value.res, req.body.levelOfUser, res, { raiting: value.rating });

      /*}else{
        let ids=[];
        for(let i=0;i<value.res.length;i++)
          ids.push(value.res[i].SellerId)
       //   ids.push(ObjectId(value.res[i].SellerId))
      dbo.collection("shops").find({_id: ObjectId(value.res[0].SellerId)}).toArray(function(err, result) {
        if (err) throw err;
          computeOff(value.res,levelOfUser,res,{raiting:value.rating,Seller:result});
      }); 
     
      
    
    }*/

    }, function () {
      db.close();
    });
    /*dbo.collection('product_detail').aggregate([
      
      {
        
        $lookup: {
             from: "product",
             localField: "product_id",
             foreignField: "_id",
             as: "product"
        }
      },{
        $match : {
          "product_id":ObjectId(req.body.ProductId),
          "SellerId":{$ne: req.body.SellerId},
          "number":{$ne:0}
       }
      }
    ]).limit(10).toArray(function(err, result) {
      if (err) throw err;
      result = MergeResult(result)
      computeOff(result,req.body.levelOfUser,res);
    })*/


  })

})

router.post('/CancelProduct', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let newStatus = "-2";
  let statusDesc = "درخواست مرجوعی توسط کاربر";
  let Factor_id = req.body.Factor_id;
  let Product_Id = req.body.Product_Id;
  let selectedUsername = req.body.username;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);

    dbo.collection("factor").find({ _id: ObjectId(Factor_id) }).toArray(function (err, result) {
      if (err) throw err;
      var promise = new Promise(function (resolve, reject) {

        dbo.collection("setting").find({}).toArray(function (err, result00) {
          if (err) throw err;
          resolve(result00[0])
        });

      });
      promise.then(function (result0) {


        let productName = "";


        var bulk = dbo.collection("product_detail").initializeUnorderedBulkOp();
        let ExecuteBulk = 0;
        result[0].products.forEach(function (doc) {
          if (doc._id == Product_Id) {
            productName = doc.title;
            doc.status = newStatus;
          }

        })
        if (ExecuteBulk)
          bulk.execute();

        dbo.collection("factor").update({ _id: ObjectId(Factor_id) }, { $set: { "products": result[0].products } }, function (err, resultFinal) {
          if (err) throw err;
          let text = "کاربر گرامی درخواست مرجوعی محصول  " + "\n" + productName + "\n" + "در سیستم ثبت شد . نتیجه درخواست پس از بررسی به اطلاع شما خواهد رسید" + "\n" + result0.STitle
          SendSms(text, selectedUsername, result0)
          res.json({
            result: result
          })
        });

      })

    });
  });
})

module.exports = router;