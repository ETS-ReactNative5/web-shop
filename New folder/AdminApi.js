var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var moment = require('jalali-moment');
var multer = require('multer');
//var cron = require('node-cron');   
var QRCode = require('qrcode')


var ObjectId = require('mongodb').ObjectID;
const path = require("path");
const cryptoRandomString = require('crypto-random-string');
var http = require('http');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

var url = "mongodb://localhost:27017/";
//var database = "mydb";
var database = "food";

//var url = "mongodb://sarvapps_user:sj9074286@localhost:27017/sarvapps_db"; 
//var database = "sarvapps_db";

//var url = "mongodb://sarvapps_user:sj9074286@localhost:27017/sarvapps_food"; 
//var database = "sarvapps_food";

//var url = "mongodb://emdcctvc_user:sj9074286@localhost:27017/emdcctvc_db"; 
//var database = "emdcctvc_db"; 

moment.updateLocale('en', {
  relativeTime : {
      future: "in %s",
      past:   "%s ago",
      s: function (number, withoutSuffix, key, isFuture){
          return '00:' + (number<10 ? '0':'') + number + ' minutes';
      },
      m:  "01:00 minutes",
      mm: function (number, withoutSuffix, key, isFuture){
          return (number<10 ? '0':'') + number + ':00' + ' minutes';
      },
      h:  "an hour", 
      hh: "%d hours",
      d:  "a day",  
      dd: "%d days",
      M:  "a month",
      MM: "%d months",
      y:  "a year",
      yy: "%d years"
  }
})

//cron.schedule('*/50 * * * *', () => {
//  console.log('running a task every two minutes');
//});

function SendSms(text, mobileNo, settings) {
  var str = '';
  if (settings.ActiveSms == "smart") {
    var options = {
      host: 'api.smartsms.ir',
      path: '/sms/send?userId=' + settings.SmartUser + '&password=' + settings.SmartPass + '&message=' + encodeURIComponent(text) + '&recipient=' + mobileNo + '&originator=' + settings.SmartNumber + ''
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
function MergeResult(result, params) {
  let inCart = (params && params.inCart == 1) ? 1 : 0;
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
router.get('/', function (req, res, next) {
  res.send("hello world")

})
router.post('/get', function (req, res, next) {
  res.send("hello world")

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



router.post('/uploadFile', function (req, res, next) {
  const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
      if (req.body.ExtraFile && req.body.typeOfFile == "2")
        cb(null, "File-" + Date.now() + path.extname(file.originalname));
      else
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({
    storage: storage/*,
    limits: { fileSize: !req.body.ExtraFile ? 10000000 : 10000000000 },*/
  }).single("myImage");
  upload(req, res, (err) => {
    if (req.body.AddLogo) {
      var Jimp = require('jimp');
      const ORIGINAL_IMAGE = req.file.path;

      const LOGO = req.body.AddLogo;

      const LOGO_MARGIN_PERCENTAGE = 5;

      const FILENAME = req.file.path;

      const main = async () => {
        const [image, logo] = await Promise.all([
          Jimp.read(ORIGINAL_IMAGE),
          Jimp.read(LOGO)
        ]);

        logo.resize(image.bitmap.width / 7, Jimp.AUTO);

        const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
        const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

        const X = image.bitmap.width - logo.bitmap.width - xMargin;
        const Y = image.bitmap.height - logo.bitmap.height - yMargin;

        return image.composite(logo, X, Y, [
          {
            mode: Jimp.BLEND_SCREEN,
            opacitySource: 0.1,
            opacityDest: 1
          }
        ]);
      };

      main().then(image => image.write(FILENAME));
    }
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
        console.log(req.body.id);
        dbo.collection("product").update({ _id: ObjectId(req.body.id) }, { $set: pic }, function (err, result) {
          if (err) throw err;

          db.close();
        });
      });

    }

    if (req.body.PagePics && !req.body.ExtraFile) {

      var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        let pic = ''
        pic = { fileUploaded: req.file.path, name: req.body.name }
        console.log(pic)

        dbo.collection("pics").update({ name: req.body.name }, { $set: pic }, { upsert: true }, function (err, result) {
          if (err) throw err;

          db.close();
        });
      });

    }
    if (req.body.ShopId) {
      var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        let pic = ''
        if (req.body.SpecialPic)
          pic = { SpecialPic: req.file.path }
        else if (req.body.logoCopyRight)
          pic = { logoCopyRight: req.file.path }
        else
          pic = { logo: req.file.path }

        dbo.collection("shops").update({ _id: ObjectId(req.body.ShopId) }, { $set: pic }, function (err, result) {
          if (err) throw err;

          db.close();
        });
      });

    }
    if (req.body.BrandId) {
      var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        let pic = ''
        pic = { logo: req.file.path }

        dbo.collection("brands").update({ _id: ObjectId(req.body.BrandId) }, { $set: pic }, function (err, result) {
          if (err) throw err;

          db.close();
        });
      });

    }
    if (req.body.CatId) {
      var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        let pic = ''
        pic = { pic: req.file.path }

        dbo.collection("category").update({ _id: ObjectId(req.body.CatId) }, { $set: pic }, function (err, result) {
          if (err) throw err;

          db.close();
        });
      });

    }
    /*Now do where ever you want to do*/
    if (!err && req.file)
      return res.send(req.file.path).end();
  });
})
router.post('/checktoken', function (req, res, next) {
  jwt.verify(req.body.token, 'secretKey', (err, authData) => {
    if (err) {
      res.sendStatus(403)
    } else {
      console.log(authData)

      res.json({
        message: 1,
        authData
      })
    }

  })

})

router.post('/CreateShop', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body.edit == "0") {
      var promise1 = new Promise(function (resolve, reject) {
        dbo.collection("shops").insertOne({ "UserId": req.body.UserId, "name": req.body.name, "address": req.body.address, commission: 5, laon: false, cash: true, main: 0, type: req.body.type }, function (err, result) {
          if (err) throw err;
          resolve(result)
        });
      });
      promise1.then(function (res1) {
        dbo.collection("users").updateOne({ "_id": ObjectId(req.body.UserId) }, { $set: { "level": "2", "map": "فروشندگان", shopId: res1.insertedId } }, function (err, result) {
          if (err) throw err;
          res.json({
            result: res1,
          })
          db.close();
        });
      })

    } else {
      dbo.collection("shops").updateOne({ "_id": req.body.ShopId }, { $set: { "name": req.body.name, "address": req.body.address } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    }

  })

})

router.post('/ShopInformation', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body.edit == "1") {
      let set = {};
      if(req.body.editByAdmin == "1"){
        set = { name: req.body.name, address: req.body.address,  call: req.body.call, Sheba: req.body.Sheba,RaymandAcc:req.body.RaymandAcc, mobile: req.body.mobile, about: req.body.about, CreditCommission: req.body.CreditCommission,MehrCommission:req.body.MehrCommission,Opened:req.body.Opened,OpenedTime:req.body.OpenedTime,PrepareTime:req.body.PrepareTime,cats:req.body.cats,showInSite:req.body.showInSite,credit:req.body.credit,paymentType:req.body.paymentType,UserId:ObjectId(req.body.UserId) }
      }else{
        if (req.body.commission)
          set = { name: req.body.name, address: req.body.address,latitude:req.body.latitude,longitude: req.body.longitude, city: req.body.city, subCity: req.body.subCity, SelectedSubCities: req.body.SelectedSubCities, SendToCity: req.body.SendToCity, SendToNearCity: req.body.SendToNearCity, SendToState: req.body.SendToState, SendToCountry: req.body.SendToCountry, FreeInExpensive: req.body.FreeInExpensive, call: req.body.call, Sheba: req.body.Sheba,RaymandAcc:req.body.RaymandAcc, mobile: req.body.mobile, about: req.body.about, commission: req.body.commission, bankAcc: req.body.bankAcc, boxAcc: req.body.boxAcc, cash: req.body.cash, laon: req.body.laon, CreditCommission: req.body.CreditCommission,Opened:req.body.Opened,OpenedTime:req.body.OpenedTime,PrepareTime:req.body.PrepareTime }
        else
          set = { name: req.body.name, address: req.body.address,latitude:req.body.latitude,longitude: req.body.longitude, city: req.body.city, subCity: req.body.subCity, SelectedSubCities: req.body.SelectedSubCities, SendToCity: req.body.SendToCity, SendToNearCity: req.body.SendToNearCity, SendToState: req.body.SendToState, SendToCountry: req.body.SendToCountry, FreeInExpensive: req.body.FreeInExpensive, call: req.body.call, Sheba: req.body.Sheba,RaymandAcc:req.body.RaymandAcc, mobile: req.body.mobile, about: req.body.about, commission: req.body.commission, bankAcc: req.body.bankAcc, boxAcc: req.body.boxAcc, cash: req.body.cash, laon: req.body.laon, CreditCommission: req.body.CreditCommission,Opened:req.body.Opened,OpenedTime:req.body.OpenedTime,PrepareTime:req.body.PrepareTime }
      }
     
      if (typeof req.body.main != "undefined")
        set.main = req.body.main
      if (typeof req.body.AllowCredit != "undefined")
        set.AllowCredit = req.body.AllowCredit
      new Promise(function (resolve, reject) {

        if(!req.body.UserId && req.body.User_Name && req.body.editByAdmin == "1" && req.body.ShopId){
          if(!req.body.mobile || req.body.mobile == ''){
            resolve();
            return;
          }
          var username = req.body.mobile.charAt(0) == "0" ? req.body.mobile.substr(1) : req.body.mobile;
          
          dbo.collection("users").insertOne({ "username": username, "password": '12345678',shopId:ObjectId(req.body.ShopId), name: req.body.User_Name,map:'فروشندگان',  address: '', "status": "1", "level": "1", levelOfUser: "",RaymandUser:req.body.selectedRaymandAcc }, function (err, result2) {
            if (err) throw err;
            resolve(result2)
          });
        }else{
          resolve()
        }
        
      
    }).then(function (value) {
      if(value && value.insertedId)
        set.UserId = value.insertedId;
   
      dbo.collection("shops").update({ _id: ObjectId(req.body.ShopId) }, { $set: set }, { upsert: true }, function (err, result) {
        if (err) throw err;
        let ShopId = (result.result && result.result.upserted && result.result.upserted[0]) ?  result.result.upserted[0]._id : null;
        if(!req.body.UserId && req.body.User_Name && req.body.editByAdmin == "1" && !req.body.ShopId){
          if(!req.body.mobile || req.body.mobile == ''){
            resolve();
            return;
          }
          var username = req.body.mobile.charAt(0) == "0" ? req.body.mobile.substr(1) : req.body.mobile;
          
          dbo.collection("users").insertOne({ "username": username, "password": '12345678',shopId:ShopId, name: req.body.User_Name,map:'فروشندگان',  address: '', "status": "1", "level": "1", levelOfUser: "",RaymandUser:req.body.selectedRaymandAcc }, function (err, result2) {
            if (err) throw err;

            dbo.collection("shops").update({ _id: ShopId }, { $set: {UserId:result2.insertedId} }, function (err, result) {
              if (err) throw err;
              res.json({
                result: 1
              })

            })
            
          });
        }else{
          res.json({ 
            result: 1
          })
        }
        
      });
      
    })

    } else {
      if (req.body.ShopId) {
        var promise = new Promise(function (resolve, reject) {

          if(req.body.getQrCode){
            var opts = {
              errorCorrectionLevel: 'H',
              type: 'image/jpeg',
              quality: 1,
              margin: 1,
              color: {
                dark:"#010599FF",
                light:"#FFBF60FF"
              }
            }
            QRCode.toDataURL(req.body.ShopId, opts, function (err, url) {
              if (err) throw err
              resolve(url) 
            })
          }else{
            resolve() 

          }
          
            
        })
        promise.then(function (ress) {
          dbo.collection('shops').aggregate([
            {
      
              $lookup: {
                from: "users",
                localField: "UserId",
                foreignField: "_id",
                as: "users"
              }
            },
            {
              $match: { _id: ObjectId(req.body.ShopId) }
            }
          ]).toArray(function (err, result) {
            if (err) throw err;
            res.json({
              result: result,
              svg:ress
            })
            db.close();
      
      
          })
          /*
          dbo.collection("shops").find({ _id: ObjectId(req.body.ShopId) }).toArray(function (err, result) {
            if (err) throw err;
            res.json({
              result: result,
              svg:ress
            })

            db.close();
          });*/
        })
      } else {
        let condition = req.body.main ? { main: req.body.main } : {};
        dbo.collection('shops').aggregate([
          {
    
            $lookup: {
              from: "users",
              localField: "UserId",
              foreignField: "_id",
              as: "users"
            }
          },
          {
            $match: condition
          }
        ]).toArray(function (err, result) {
          if (err) throw err;
          res.json({
            result: result
          })
          db.close();
    
    
        })
        /*dbo.collection("shops").find(condition).toArray(function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })

          db.close();
        });*/
      }
    }

  });
})
router.post('/getuser', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let username = req.body.username;
  let password = req.body.password/* req.body.password*/;
  let GetAll = req.body.GetAll;
  let Conditions = { username: username, password: password, level: "1" };
  if (!username && !password && GetAll == 1)
    Conditions = { username: { $ne: 'sarv' } };
  if (req.body.userId)
    Conditions = { _id: ObjectId(req.body.userId) };  
  //req.body : post
  //req.query : get
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("users").find(Conditions).sort({ level: 1, levelOfUser: 1,RegisterDate:1 }).toArray(function (err, result) {
      if (err) throw err;
      jwt.sign({ username }, 'secretKey' /*, {expiresIn:'7d'}*/, (err, token) => {
        res.json({
          result: result,
          token
        })
      });
      db.close();
    });
  });
})
router.post('/getFactors', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    var promise = new Promise(function (resolve, reject) {
      let condition = (req.body.isMainShop == 1) ? {} : { SellerId: req.body.SellerId }
      dbo.collection('factor').aggregate([
        {

          $lookup: {
            from: "users",
            localField: "username",
            foreignField: "username",
            as: "userData"
          }
        },
        {
          $match: {
            products: { $elemMatch: condition }, status: req.body.Filter == "All" ? { $in: ["-2", "-1", "0", "1", "2", "3", "4", "5"] } : req.body.Filter
          }
        }
      ]).sort({ Date: -1 }).toArray(function (err, result) {
        // dbo.collection("factor").find({products :{ $elemMatch: { SellerId: req.body.SellerId } }}).sort( { Date: -1 } ).toArray(function(err, result) {
        if (err) throw err;
        let finalPrice = 0,
          finalCredit = 0;
        for (var i = 0; i < result.length; i++) {
          let price = 0;
          for (var j = 0; j < result[i].products.length; j++) {
            //db.getCollection('factor').updateMany({"products.6.SellerId":{$ne: ""}},{$set:{'products.6.SellerId':"5e845a2bd567ed129c1bc51c"}})
            if (req.body.SellerId == result[i].products[j].SellerId || req.body.isMainShop == 1) {
              price += parseInt(result[i].products[j].price);
              if (result[i].status == "1" || result[i].status == "2" || result[i].status == "3" || result[i].status == "4") {
                finalPrice += parseInt(result[i].products[j].price);
                finalCredit += result[i].products[j].credit ? parseInt(result[i].products[j].credit) : 0;
              }


            }
            else
              result[i].products[j].remove = "1";
            if((req.body.cancel == 1 && result[i].products[j].status != "-2") || (req.body.cancel == 2 && result[i].products[j].status != "-3")){
              result[i].products[j].remove = "1";
            }  
          }
          result[i].Amount = price
          result[i].products = result[i].products.filter(function (value, index, array) {
            return (value.remove != "1");
          });
          if(result[i].products.length == 0){
            result.splice(i,1);  
          }
        }
        resolve({ result: result, finalPrice: finalPrice, finalCredit: finalCredit })
      });
    });
    promise.then(function (res1) {
      fResult = {
        result: res1.result,
        finalPrice: res1.finalPrice,
        finalCredit: res1.finalCredit
      }
      res.json({
        result: fResult
      })
      return;
      dbo.collection("shops").find({ UserId: req.body.SellerId }).toArray(function (err, result) {
        if (err) throw err;
        fResult.finalPrice = fResult.finalPrice - ((fResult.finalPrice * (result[0] ? result[0].commission : 0)) / 100);
        res.json({
          result: fResult,
        })
        db.close();
      });

    });
  })
  /*dbo.collection("factor").find(Conditions).toArray(function(err, result) {
    if (err) throw err;
    res.json({
      result:result
    })   
    db.close(); 
  });*/
})
router.post('/GetCategory', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("category").find({}).sort({ name: 1 }).toArray(function (err, result) {
      if (err) throw err;

      res.json({
        result: result,
      })

      db.close();
    });
  });
})
router.post('/setCategory', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;
  let Category = req.body.Category;
  let Data = {}
  if (!req.body.id) {
    Data = { "name": Category, SellerId: req.body.SellerId, Parent: req.body.ParentCat, showInSite: req.body.showInSite };
    for (let code of req.body.CodeFile) {
      Data[code.Etitle] = req.body[code.Etitle];
    }
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("category").insert(Data, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
          result: result,
        })
        db.close();
      });
    });
  } else if (Category) {
    Data = { "name": Category, Parent: req.body.ParentCat, order: req.body.CategoryOrder,Commission:req.body.Commission||0, showInSite: req.body.showInSite, Spec: req.body.Spec };
    for (let code of req.body.CodeFile) { 
      Data[code.Etitle] = req.body[code.Etitle];
    }
    let id = ObjectId(req.body.id);
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("category").update({ _id: id }, { $set: Data }, function (err, result) {
        if (err) throw err;
        console.log(result);
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
        console.log(result);
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
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("cart").insert({ "PId": req.body.PId, "Number": req.body.Number, "UId": req.body.UId, "Price": req.body.Price, "Status": req.body.Status }, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
          result: result,
        })
        db.close();
      });
    });
  } else if (Type == "update") {
    let id = ObjectId(req.body.id);
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo.collection("category").update({ _id: id }, { $set: { "name": Category } }, function (err, result) {
        if (err) throw err;
        console.log(result);
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
        console.log(result);
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
  let number = parseInt(req.body.number);
  let Category = ObjectId(req.body.CategoryInProduct);
  let Immediate = req.body.Immediate;
  let ShowPriceAftLogin = req.body.ShowPriceAftLogin;
  let NoOff = req.body.NoOff;
  let SeveralShop = req.body.SeveralShop;
  let TypeOfSend = req.body.TypeOfSend;
  let fileUploaded = req.body.fileUploaded;
  let fileUploaded1 = req.body.fileUploaded1;
  let fileUploaded2 = req.body.fileUploaded2;
  let fileUploaded3 = req.body.fileUploaded3;
  let fileUploaded4 = req.body.fileUploaded4;
  let status = req.body.status;
  let HarajType = req.body.HarajType;
  let TodayDate = moment().locale('fa').format('YYYY/M/D');
  let HarajDate = req.body.HarajDate;
  let HarajDate_Latin = moment.from(HarajDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
  let ExpireDate = HarajDate;
  let PrepareTime = req.body.PrepareTime;
  let SelectedSize = req.body.SelectedSize;
  let SelectedColors = req.body.SelectedColors;
  let Tags = [];
  for(let i=0;i<req.body.Tags.length;i++) {
    Tags.push({_id:ObjectId(req.body.Tags[i]._id),title:req.body.Tags[i].title});
  }
  if (HarajType == "2") {
    ExpireDate = moment(HarajDate_Latin, "YYYY/MM/DD").add(6, 'days').locale('fa').format('YYYY/M/D');
  }
  let SellerId = ObjectId(req.body.SellerId);
  let product_id = "";
  let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
  if (set) {

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      var promise1 = new Promise(function (resolve, reject) {
        if (!SeveralShop) {
          dbo.collection("product").insert({ title: title, subTitle: subTitle, price: price, desc: desc, off: off, number: number, category_id: Category, fileUploaded: fileUploaded, fileUploaded1: fileUploaded1, fileUploaded2: fileUploaded2, fileUploaded3: fileUploaded3, fileUploaded4: fileUploaded4, status: status, TodayDate: TodayDate, TodayTime: TodayTime, ExpireDate: ExpireDate, HarajDate: HarajDate, HarajDate_Latin: HarajDate_Latin, HarajType: HarajType, SellerId: SellerId, Immediate: Immediate, ShowPriceAftLogin: ShowPriceAftLogin, TypeOfSend: TypeOfSend, NoOff: NoOff, PrepareTime: PrepareTime, Spec: req.body.Spec,Tags:Tags }, function (err, result) {
            if (err) throw err;
            resolve(result.ops[0]._id)
          });
        } else {
          dbo.collection("product").insert({ title: title, subTitle: subTitle, desc: desc, category_id: Category, fileUploaded: fileUploaded, fileUploaded1: fileUploaded1, fileUploaded2: fileUploaded2, fileUploaded3: fileUploaded3, fileUploaded4: fileUploaded4, SellerId: [SellerId], Spec: req.body.Spec,Tags:Tags }, function (err, result) {
            if (err) throw err;
            //,status: status,TodayDate:TodayDate,TodayTime:TodayTime,ExpireDate:ExpireDate,HarajDate:HarajDate,HarajDate_Latin:HarajDate_Latin,HarajType:HarajType,SellerId:SellerId,Immediate:Immediate,ShowPriceAftLogin:ShowPriceAftLogin,TypeOfSend:TypeOfSend,NoOff:NoOff
            dbo.collection("product_detail").insert({ product_id: result.ops[0]._id, price: price, off: off, number: number, status: status, TodayDate: TodayDate, TodayTime: TodayTime, ExpireDate: ExpireDate, HarajDate: HarajDate, HarajDate_Latin: HarajDate_Latin, HarajType: HarajType, SellerId: SellerId, Immediate: Immediate, ShowPriceAftLogin: ShowPriceAftLogin, TypeOfSend: TypeOfSend, NoOff: NoOff, PrepareTime: PrepareTime, SelectedSize: SelectedSize, SelectedColors: SelectedColors }, function (err, result000) {
              if (err) throw err;
              resolve(result.ops[0]._id)
            });
          });


        }



        // })
      });
      promise1.then(function (id) {
        dbo.collection("offs").insertMany([
          { product_id: ObjectId(id), level: "-1", formul: price },
          { product_id: ObjectId(id), level: "0", formul: '{"level":"-1","off":"0","opr":"+"}' },
          { product_id: ObjectId(id), level: "1", formul: '{"level":"-1","off":"0","opr":"+"}' },
          { product_id: ObjectId(id), level: "2", formul: '{"level":"-1","off":"0","opr":"+"}' },
          { product_id: ObjectId(id), level: "3", formul: '{"level":"-1","off":"0","opr":"+"}' },
          { product_id: ObjectId(id), level: "4", formul: '{"level":"-1","off":"0","opr":"+"}' },
          { product_id: ObjectId(id), level: "5", formul: '{"level":"-1","off":"0","opr":"+"}' },

        ], function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();

        });
      })

    })
  } else {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      var promise1 = new Promise(function (resolve, reject) {
        //dbo.collection("product").updateMany({HarajDate:{$ne: ""}},{$set:{HarajDate:HarajDate}},function(err){
        //  if (err) throw err;
        resolve()
        //})
      });
      promise1.then(function () {
        if (!SeveralShop) {
          dbo.collection("product").update({ _id: id }, { $set: { title: title, subTitle: subTitle, price: price, desc: desc, off: off, number: number, category_id: Category, status: status, TodayDate: TodayDate, TodayTime: TodayTime, ExpireDate: ExpireDate, HarajDate: HarajDate, HarajDate_Latin: HarajDate_Latin, HarajType: HarajType, Immediate: Immediate, ShowPriceAftLogin: ShowPriceAftLogin, TypeOfSend: TypeOfSend, NoOff: NoOff, PrepareTime: PrepareTime, Spec: req.body.Spec,Tags:Tags } }, function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json({
              result: result,
            })
            db.close();
          });
        } else {
          dbo.collection("product").update({ _id: id }, { $set: { title: title, subTitle: subTitle, desc: desc, category_id: Category, Spec: req.body.Spec,Tags:Tags }, $addToSet: { SellerId: SellerId } }, function (err, result) {
            if (err) throw err;
            dbo.collection("product_detail").update({ SellerId: SellerId, product_id: ObjectId(req.body.id) }, { $set: { price: price, off: off, number: number, status: status, TodayDate: TodayDate, TodayTime: TodayTime, ExpireDate: ExpireDate, HarajDate: HarajDate, HarajDate_Latin: HarajDate_Latin, HarajType: HarajType, Immediate: Immediate, ShowPriceAftLogin: ShowPriceAftLogin, TypeOfSend: TypeOfSend, NoOff: NoOff, PrepareTime: PrepareTime, SelectedSize: SelectedSize, SelectedColors: SelectedColors } }, { upsert: true }, function (err, result000) {
              res.json({
                result: result,
              })
              db.close();

            })

          });
        }

      })

    });
  }
})


router.post('/productTableAction', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;
  let id = ObjectId(req.body.id);
  let title = req.body.title;
  let subTitle = req.body.title2;
  let desc = req.body.desc;
  let price = req.body.price;
  let off = req.body.off;
  let status = req.body.status;
  let Type = req.body.act;
  let TodayDate = moment().locale('fa').format('YYYY/M/D');
  let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
  //req.body : post
  //req.query : get
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (Type == "edit") {
      dbo.collection("product").insert({ title: title, subTitle: subTitle, price: price, desc: desc, off: off, number: number, status: status, TodayDate: TodayDate, TodayTime: TodayTime }, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
          result: result,
        })
        db.close();
      });
    }
    if (Type == "delete") {
      var promise = new Promise(function (resolve, reject) {
        dbo.collection("product").deleteOne({ _id: id }, function (err, result) {
          if (err) throw err;
          resolve()
        })


      });
      promise.then(function (value) {
        dbo.collection("product_detail").deleteMany({ product_id: id }, function (err, result) {
          if (err) throw err;
          console.log(result);
          res.json({
            result: result,
          })
          db.close();
        })

      })

    }


  });
})
router.post('/changeFactorStatus', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let newStatus = req.body.newStatus;
  let statusDesc = req.body.statusDesc;
  let selectedId = req.body.selectedId;
  let selectedUsername = req.body.selectedUsername;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let NowDate = moment().locale('fa').format('YYYY/MM/DD HH:mm:SS');
    let ReciveDate = moment().locale('fa').format('YYYY/MM/DD');
    let LastChangeDate_num = moment().toDate().getTime();
    let set = newStatus != "4" ? { status: newStatus,LastChangeDate:NowDate,LastChangeDate_num:LastChangeDate_num} : { status: newStatus,LastChangeDate:NowDate,LastChangeDate_num:LastChangeDate_num,ReciveDate:ReciveDate }
    dbo.collection("factor").findOneAndUpdate({ _id: ObjectId(selectedId) }, { $set: set }, function (err, result) {
      if (err) throw err;
      let LastStatus = result.value.status;
      var promise = new Promise(function (resolve, reject) {

        dbo.collection("setting").find({}).toArray(function (err, result00) {
          if (err) throw err;
          resolve(result00[0])
        });

      });
      promise.then(function (result0) {

        let text = req.body.msg;
        if (text != "")
          SendSms(text, selectedUsername, result0);
        if (newStatus == "-1" || newStatus == "2" || newStatus == "4") {
          var opr = newStatus == "-1" ? 1 : 0;
          var bulk = dbo.collection("product_detail").initializeUnorderedBulkOp();
          result.value.products.forEach(function (doc) {

            bulk.find({ product_id: ObjectId(doc._id), Seller: doc.SellerId }).update({ $inc: { number: opr * doc.number }});
            if(newStatus == "2" || newStatus == "4"){
              doc.status = newStatus == "2" ? "2" : "3";

            }
          })
          bulk.execute();

          
        }
        if(newStatus == "2" || newStatus == "4"){
          let product_Status = newStatus == "2" ? "2" : "3";
          dbo.collection("factor").update({ _id: ObjectId(selectedId) }, { $set: { "products": result.value.products } }, function (err, resultFinal) {

            res.json({
              result: result
            })
          })
          return;
        }
        
        res.json({
          result: result
        })

        if (newStatus != "-1" && LastStatus != "-1")
          db.close();

      })

    });
  });
})
router.post('/changeProductFactorStatus', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let newStatus = req.body.newStatus;
  let statusDesc = req.body.statusDesc;
  let selectedFactorId = req.body.selectedFactorId;
  let SelectedProductId = req.body.SelectedProductId;
  let selectedUsername = req.body.selectedUsername;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);

    dbo.collection("factor").find({ _id: ObjectId(selectedFactorId) }).toArray(function (err, result) {
      if (err) throw err;
      var promise = new Promise(function (resolve, reject) {

        dbo.collection("setting").find({}).toArray(function (err, result00) {
          if (err) throw err;
          resolve(result00[0])
        });

      });
      promise.then(function (result0) {


        var opr = newStatus == "-1" ? 1 : -1;
        let productName = "";


        var bulk = dbo.collection("product_detail").initializeUnorderedBulkOp();
        let ExecuteBulk = 0;
        count = 0;
        result[0].products.forEach(function (doc) {
          if (doc._id == SelectedProductId) {
            if (newStatus == "-1") {
              ExecuteBulk = 1;
              bulk.find({ product_id: ObjectId(doc._id) }).update({ $inc: { number: 1 * doc.number } });

            }
            productName = doc.title;
            doc.status = newStatus;
            doc.LastChangeDate = moment().locale('fa').format('YYYY/MM/DD HH:mm:ss');
            doc.LastChangeDate_num = moment().toDate().getTime();

          }
          if(doc.status == "2") // آماده ارسال
            count++

        })
        
        if (ExecuteBulk)
          bulk.execute();
          if(count == result[0].products.length){
          
          }
        let set = count == result[0].products.length ? { "products": result[0].products,"status" : "2" } : { "products": result[0].products };  
        dbo.collection("factor").update({ _id: ObjectId(selectedFactorId) }, { $set: set }, function (err, resultFinal) {
          if (err) throw err;
          if (newStatus == "-1") {
            let text = "کاربر گرامی محصول " + productName + " از سفارش شما توسط فروشنده لغو شده است . در صورت تمایل به دریافت سفارش بدون این محصول به بخش محیط کاربری خود مراجعه کنید" + "\n" + result0.STitle
            SendSms(text, selectedUsername, result0)
          }
          res.json({
            result: result
          })
        });

      })

    });
  });
})

router.post('/EditFactor', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let type = req.body.type;
  let ProductId = req.body.ProductId;
  let FactorId = req.body.FactorId;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("factor").find({ _id: ObjectId(FactorId) }).toArray(function (err2, result) {
      if (err) throw err2;
      if (ProductId) {
        result[0].products.forEach(function (doc, index) {
          if (doc._id == ProductId) {
            if (type == "del") {
              result[0].products.splice(index, 1)
              dbo.collection("factor").update({ _id: ObjectId(FactorId) }, { $set: { "products": result[0].products } }, function (err, result) {
                if (err) throw err;
                res.json({
                  result: result
                })
              });
            }
            if (type == "edit") {
              delete req.body.product.edit;
              if (req.body.product.UnitPrice)
                req.body.product.price = req.body.product.UnitPrice * req.body.product.number;
              result[0].products[index] = req.body.product;
              dbo.collection("factor").update({ _id: ObjectId(FactorId) }, { $set: { "products": result[0].products } }, function (err, result) {
                if (err) throw err;
                res.json({
                  result: result
                })
              });
            }

          }
        })
      } else {
        if (type == "del") {
          dbo.collection("factor").deleteOne({ _id: ObjectId(FactorId) }, function (err, result) {
            if (err) throw err;
            res.json({
              result: result,
            })
            db.close();
          })
        }
      }


    });
  });
})


router.post('/DelProductPerShop', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let type = req.body.type;
  let ProductId = req.body.ProductId;
  let FactorId = req.body.FactorId;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);

    var promise = new Promise(function (resolve, reject) {

      dbo.collection("product_detail").deleteOne({ product_id: ObjectId(req.body.productId),SellerId:ObjectId(req.body.SellerId) }, function (err, result) {
        if (err) throw err;
        resolve();
      })

    });
    promise.then(function (result0) {
       debugger;
      dbo.collection("product").updateOne({ "_id": ObjectId(req.body.productId) }, {$pull:{ "SellerId": {$in: [ ObjectId(req.body.SellerId)] } }}, { upsert: true }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    })
    
  });
})



router.post('/getProducts', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;
  let type = req.body.type;
  let id = req.body.id;
  let limit = req.body.limit ? req.body.limit : 0;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (!req.body.getDetails) {
      if (!id) {
        if (req.body.SellerId == req.body.MainShopId) {
          dbo.collection("product").find({}).limit(limit).toArray(function (err, result) {
            if (err) throw err;
            res.json({
              result: result
            })

            db.close();
          });
        } else {
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
              $match: {
                "SellerId": ObjectId(req.body.SellerId),
              }
            }
          ]).sort( { number: -1 } ).toArray(function (err, result) {
            if (err) throw err;
            result = MergeResult(result)

            res.json({
              result: result
            })
            db.close();
          })
          /*dbo.collection('product').aggregate([
            {
              
              $lookup: {
                   from: "product_detail",
                   as: "product_detail",
                   pipeline: [
                    { $match: { SellerId:req.body.SellerId } }
                   ]
              }
            }
          ]).toArray(function(err, result) {
             if (err) throw err;
             res.json({
               result :result
             })
             db.close(); 
                    
    
            })*/
        }

      } else {
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
            $match: {
              _id: ObjectId(id),
            }
          }
        ]).toArray(function (err, result) {
          if (err) throw err;
          result = MergeResult(result)
          res.json({
            result: result
          })

          db.close();
        });
      }
    } else {
      dbo.collection("product_detail").find({ product_id: ObjectId(req.body.product_id), SellerId: ObjectId(req.body.SellerId) }).toArray(function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })

        db.close();
      });

    }


  });
})
router.post('/getCartPerId', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;
  let UId = req.body.UId;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);

    dbo.collection("cart").find({ UId: UId }).toArray(function (err, result) {
      if (err) throw err;

      /*  db.cart.aggregate([
          {
            $lookup:
              {
                from: "products",
                localField: "_id",
                foreignField: "PID",
                as: "inventory_docs"
              }
         }
       ])*/
      res.json({
        result: result,
      })

      db.close();
    });


  });
})

router.post('/EditAddress', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let TodayDate = moment().locale('fa').format('YYYY/MM/DD');
  let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    
      dbo.collection("users").updateOne({ "username": req.body.username }, { $set: { "address": req.body.address, "city": req.body.city,"subCity":req.body.subCity } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });   


  })

})


router.post('/ManageUsers', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  let TodayDate = moment().locale('fa').format('YYYY/MM/DD');
  let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body._id) {
      dbo.collection("users").deleteOne({ _id: ObjectId(req.body._id) }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,  
        })
        db.close();
      })
      return;
    }
    if (req.body.level != "0") {
      if (req.body.MyAccount == "1") {
        dbo.collection("users").updateOne({ "username": req.body.username }, { $set: { "password": req.body.pass, "name": req.body.name,RaymandUser:req.body.RaymandUser,RaymandAcc:req.body.RaymandAcc, "UpdateDate": TodayDate, "UpdateTime": TodayTime } }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result
          })
        });   

      } else {

        var promise = new Promise(function (resolve, reject) {

          dbo.collection("shops").find({ _id: ObjectId(req.body.ShopId) }).toArray(function (err, result) {
            if (err) throw err;
            resolve(result[0])
          });

        });
        promise.then(function (result0) {
          if (!result0) {
            if (err) throw err;
            return;
          }
          
          dbo.collection("users").updateOne({ "username": req.body.username }, {$set:{ "password": req.body.pass, "name": req.body.name, "status": req.body.status, "level": req.body.level, "map": req.body.map,RaymandUser:req.body.RaymandUser,RaymandAcc:req.body.RaymandAcc, "address": req.body.address, "credit": parseInt(req.body.credit), "mail": req.body.mail, "company": req.body.company, shopId: result0._id, "UpdateDate": TodayDate, "UpdateTime": TodayTime }}, { upsert: true }, function (err, result) {
            if (err) throw err;
            res.json({
              result: result
            })
          });
        })



      }

    } else {
      if (req.body.MyAccount == "1") {
        if (!req.body.newPassword) {
          if (req.body.inMap) {
            dbo.collection("users").updateOne({ "username": req.body.username }, { $set: { "address": req.body.address,latitude:req.body.latitude,longitude: req.body.longitude, "city": req.body.city,RaymandUser:req.body.RaymandUser,RaymandAcc:req.body.RaymandAcc, "subCity": req.body.subCity, "UpdateDate": TodayDate, "UpdateTime": TodayTime } }, function (err, result) {
              if (err) throw err;
              res.json({
                result: result
              })
            });
          } else {
            dbo.collection("users").updateOne({ "username": req.body.username }, { $set: { "name": req.body.name, "address": req.body.address,latitude:req.body.latitude,longitude: req.body.longitude,RaymandUser:req.body.RaymandUser,RaymandAcc:req.body.RaymandAcc, "levelOfUser": req.body.levelOfUser, "Off": req.body.Off, "mail": req.body.mail, "company": req.body.company,sheba:req.body.sheba, "UpdateDate": TodayDate, "UpdateTime": TodayTime } }, function (err, result) {
              if (err) throw err;
              res.json({
                result: result
              })
            });
          }


        } else {
          var promise = new Promise(function (resolve, reject) {

            dbo.collection("users").find({ "username": req.body.username }).toArray(function (err, result) {
              if (err) throw err;
              resolve(result[0])
            });

          });
          promise.then(function (result0) {
            if (!result0) {
              if (err) throw err;
              return;
            }
            if (result0.password != req.body.oldPassword) {
              res.json({
                result: [],
                err: "رمز عبور قبلی وارد شده نادرست است"
              })
              return
            }
            dbo.collection("users").updateOne({ "username": req.body.username }, { $set: { "password": req.body.newPassword, "UpdateDate": TodayDate, "UpdateTime": TodayTime } }, function (err, result) {
              if (err) throw err;
              res.json({
                result: result
              })
            });
          })

        }


      } else {
        var promise = new Promise(function (resolve, reject) {

          dbo.collection("setting").find({}).toArray(function (err, result) {
            if (err) throw err;
            resolve(result[0])
          });

        });
        promise.then(function (result0) {
          dbo.collection("users").updateOne({ "username": req.body.username }, {$set:{ "password": req.body.pass, "name": req.body.name, "shopId": req.body.ManagerShop, "status": req.body.levelOfUser > -1 ? req.body.status : "0", "level": req.body.level, "address": req.body.address, "credit": parseInt(req.body.credit), "mail": req.body.mail, "company": req.body.company, "levelOfUser": req.body.levelOfUser, "Off": req.body.Off, "UpdateDate": TodayDate, "UpdateTime": TodayTime }}, { upsert: true }, function (err, result) {
            if (err) throw err;
            var txt = null;
            if (req.body.levelOfUser > -1 && req.body.status == "1" && result0.ActiveSms != "none")
              txt = result0.UserChangeSmsText + "\n" + "وضعیت کاربری : فعال " + "\n" + result0.STitle
            if (txt)
              SendSms(txt, req.body.username, result0)
            res.json({
              result: result
            })
          });
        })

      }

    }

  })

})
router.post('/GetMaps', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    var promise = new Promise(function (resolve, reject) {
      dbo.collection("users").find({ _id: ObjectId(req.body.user_Id) }).toArray(function (err, result0) {
        if (err) throw err;
        resolve(result0)

      })

    });
    promise.then(function (result0) {
      let condition = { _id: { $ne: "1000" } };
      if (result0[0] && result0[0].username == "sarv")
        condition = {};
      if (req.body.sameUser && result0[0])
        condition = { "_id": result0[0].map };
      dbo.collection("maps").find(condition).toArray(function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
        db.close();

      });
    })


  })

})
router.post('/GetOffs', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (!req.body.product_id) {
      dbo.collection("offs").find({ product_id: null }).sort({ level: 1 }).toArray(function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    } else {
      var promise = new Promise(function (resolve, reject) {

        dbo.collection("offs").find({ product_id: null }).sort({ level: 1 }).toArray(function (err, result) {
          if (err) throw err;
          resolve(result)

        });
      });
      promise.then(function (result) {
        dbo.collection('product').aggregate([
          {

            $lookup: {
              from: "offs",
              localField: "_id",
              foreignField: "product_id",
              as: "offs"
            }
          },
          {
            $match: {
              "_id": ObjectId(req.body.product_id),
            }
          }
        ]).toArray(function (err, result2) {
          res.json({
            offs: result,
            result: result2
          })
        })
      })

    }


  })

})
router.post('/SetMaps', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body.edit == "0") {
      dbo.collection("maps").insert({ "_id": req.body.mapId, "components": req.body.components, firstForm: req.body.firstForm }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    } else {
      dbo.collection("maps").update({ "_id": req.body.mapId }, { $set: { "components": req.body.components, firstForm: req.body.firstForm } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    }

  })

})
router.post('/SetOffForLevel', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (!req.body.product_id) {
      dbo.collection("offs").update({ "level": req.body.levelOfUser }, { $set: { "off": req.body.off, "level": req.body.levelOfUser, "PriceOfLevel": req.body.PriceOfLevel, "formul": req.body.formul } }, { upsert: true }, function (err, result) {

        if (err) throw err;
        res.json({
          result: result
        })
      });
    } else {
      dbo.collection("offs").update({ "level": req.body.level, "product_id": ObjectId(req.body.product_id) }, { $set: { "level": req.body.level, "formul": req.body.formul, product_id: ObjectId(req.body.product_id) } }, { upsert: true }, function (err, result) {

        if (err) throw err;
        res.json({
          result: result
        })
      });
    }
  })

})
router.post('/setFile', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    let type = req.body.TypeOfFile == "1" ? "image" : "file"
    var dbo = db.db(database);
    dbo.collection("files").insert({ text: req.body.extraImageText, link: req.body.extraImageLink, type: type }, function (err, result) {

      if (err) throw err;
      res.json({
        result: result
      })
    });

  })
})
router.post('/showFiles', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    let type = req.body.TypeOfFile == "1" ? "image" : "file"
    var dbo = db.db(database);
    dbo.collection("files").find({ type: type }).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
    });

  })
})
router.post('/SetComponents', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (!req.body.selectedId) {
      dbo.collection("components").insert({ "CId": parseInt(req.body.ComponentId), "FName": req.body.FName, "LName": req.body.LName, "Url": req.body.Address, "Parent": req.body.Parent, IsTitle: req.body.IsTitle, Icon: req.body.Icon, IsReport: req.body.IsReport }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    } else {
      dbo.collection("components").update({ "_id": ObjectId(req.body.selectedId) }, { $set: { "CId": parseInt(req.body.ComponentId), "FName": req.body.FName, "LName": req.body.LName, "Url": req.body.Address, "Parent": req.body.Parent, IsTitle: req.body.IsTitle, Icon: req.body.Icon, IsReport: req.body.IsReport } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    }


  })

})
router.post('/GetComponents', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);

    dbo.collection("components").find({}).sort({ CId: -1 }).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
    });

  })

})
router.post('/getuserInformation', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = req.body.map ? {map: req.body.map } : {_id: ObjectId(req.body.user_id) }
    dbo.collection("users").find(condition).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
      db.close();
    })
  })

})

router.post('/SetGuarantee', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let mobile = req.body.mobile.length > 10 ? req.body.mobile.substring(1) : req.body.mobile;
    let TodayDate = moment().locale('fa').format('YYYY/M/D');
    let TodayTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
    if (!req.body.code) {
      let code = cryptoRandomString({ length: 6, characters: '12345678' });
      dbo.collection("guarantee").createIndex({ "code": 1 }, { unique: true })

      dbo.collection("guarantee").insert({ "mobile": mobile, "title": req.body.title, "desc": req.body.desc, "code": code, "statusCode": 1, "statusDesc": "دریافت شده", "date": TodayDate, "time": TodayTime }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    } else {
      let statusDesc = "";
      if (req.body.statusCode == "0")
        statusDesc = "لغو شده";
      if (req.body.statusCode == "1")
        statusDesc = "دریافت شده";
      if (req.body.statusCode == "2")
        statusDesc = "در حال تکمیل";
      if (req.body.statusCode == "3")
        statusDesc = "آماده تحویل";
      if (req.body.statusCode == "4")
        statusDesc = "تحویل شده";
      dbo.collection("guarantee").findOneAndUpdate({ code: req.body.code }, { $set: { "mobile": mobile, "title": req.body.title, "desc": req.body.desc, "statusCode": req.body.statusCode, "statusDesc": statusDesc, "date": TodayDate, "time": TodayTime } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    }
  })

})
router.post('/GetGuarantee', function (req, res, next) {
  let mobile = req.body.mobile.length > 10 ? req.body.mobile.substring(1) : req.body.mobile;

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);

    dbo.collection("guarantee").find({ $or: [{ mobile: mobile }, { code: mobile }] }).sort({ date: -1, time: -1 }).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
    });

  })

})
router.post('/GetBrands', function (req, res, next) {
  let forShowInSite = req.body.forShowInSite;

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
    dbo.collection("pics").find({}).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
    });

  })

})
router.post('/setPicsLink', function (req, res, next) {
  console.log(req.body.name)
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = { name: req.body.name }
    dbo.collection("pics").update(condition, { $set: { link: req.body.link } }, { upsert: true }, function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
      db.close();
    });

  })

})
router.post('/setPicsText', function (req, res, next) {
  console.log(req.body.name)
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = { name: req.body.name }
    dbo.collection("pics").update(condition, { $set: { text: req.body.text } }, { upsert: true }, function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
      db.close();
    });

  })

})
router.post('/SetBrands', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (!req.body.BrandId) {
      dbo.collection("brands").insert({ "name": req.body.name, "address": req.body.address, "showInSite": req.body.showInSite, logo: req.body.logo }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
      });


    } else {
      dbo.collection("brands").update({ "_id": ObjectId(req.body.BrandId) }, { $set: { "name": req.body.name, "address": req.body.address, "showInSite": req.body.showInSite } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    }

  })

})
router.post('/GetNavs', function (req, res, next) {
  let forShowInSite = req.body.forShowInSite;

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = {};
    dbo.collection("navs").find(condition).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
    });

  })

})
router.post('/SetNavs', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (!req.body.NavId) {
      dbo.collection("navs").insert({ "title": req.body.title, "link": req.body.link, "order": req.body.order }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
      });


    } else {
      dbo.collection("navs").update({ "_id": ObjectId(req.body.NavId) }, { $set: { "title": req.body.title, "link": req.body.link, "order": req.body.order } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    }

  })

})
router.post('/SetContentBlog', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (!req.body.BlogId) {
      dbo.collection("blogs").insert({ "title": req.body.title, "content": req.body.content, FixPage: req.body.FixPage }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
      });


    } else {
      dbo.collection("blogs").update({ "_id": ObjectId(req.body.BlogId) }, { $set: { "title": req.body.title, "content": req.body.content, FixPage: req.body.FixPage } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result
        })
      });
    }

  })

})

router.post('/getBlogs', function (req, res, next) {
  let forShowInSite = req.body.forShowInSite;
  let limit = req.body.limit ? req.body.limit : 0;

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = req.body.condition || {};
    if (req.body.BlogId)
      condition = { _id: ObjectId(req.body.BlogId) }
    dbo.collection("blogs").find(condition).limit(limit).toArray(function (err, result) {
      if (err) throw err;
      res.json({
        result: result
      })
    });

  })

})
router.post('/RemBlog', function (req, res, next) {
  let id = ObjectId(req.body.BlogId);
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("blogs").deleteOne({ _id: id }, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({
        result: result,
      })
      db.close();
    })
  })

})
router.post('/RemPics', function (req, res, next) {
  let id = ObjectId(req.body._id);
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    
    dbo.collection("pics").updateOne({ _id: ObjectId(req.body._id) }, { $set: { fileUploaded: null} }, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({
        result: result,
      })
      db.close();
    })
  })

})
router.post('/GetTableProduct', function (req, res, next) {


  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = { product_id: { $ne: '' } };
    dbo.collection('offs').aggregate([
      {

        $lookup: {
          from: "product",
          localField: "product_id",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $sort: { "product_id": 1, level: 1 }
      }
      ,
      {
        $match: {
          "level": { $ne: '' }
        }
      }
    ]).toArray(function (err, result) {

      if (err) throw err;
      res.json({
        result: result
      })
    });

  })

})

router.post('/SetTableProduct', function (req, res, next) {


  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    var set = {};
    if (req.body.price)
      set = { "formul": req.body.price }
    else
      set = { "formul": '{"off":"' + req.body.off + '","level":"' + req.body.relativeLevel + '","opr":"' + req.body.opr + '"}' }

    /*if(isNaN(req.body.relativeLevel) || req.body.opr == "" || req.body.off == "" || req.body.relativeLevel == "")
    {
    res.json({
         result :0,
    })
    return;
    }*/

    let promise = new Promise(function (resolve, reject) {
      console.log(req.body._id)
      dbo.collection("offs").findOneAndUpdate({ "_id": ObjectId(req.body._id) }, { $set: set }, function (err, result) {
        if (err) throw err;
        result.value.formul = '{"off":"' + req.body.off + '","level":"' + req.body.relativeLevel + '","opr":"' + req.body.opr + '"}';
        resolve(result)
      });

    });
    promise.then(function (result1) {
      if (!req.body.price && (!req.body.off || req.body.off == "undefined") && (!req.body.relativeLevel || req.body.relativeLevel == "undefined") && (!req.body.opr || req.body.opr == "undefined")) {
        res.json({
          result: 0,
        })
        return;
      }
      if (!result1.value) {
        res.json({
          result: 1,
        })
        return;
      }
      let id = result1.value.product_id;

      let formul = (result1.value.formul && !isNaN(result1.value.formul)) ? result1.value.formul : (result1.value.formul ? JSON.parse(result1.value.formul) : {});
      let f_level = "",
        f_off = "",
        f_opr = "";
      if (typeof formul == "object") {
        f_level = formul.level,
          f_off = formul.off,
          f_opr = formul.opr;
      }
      let resultA = [];
      dbo.collection("offs").find({ "product_id": ObjectId(id), level: { $ne: '' } }).sort({ level: 1 }).toArray(function (err, result) {
        if (err) throw err;

        let initPrice = 0;
        let TempFormul = null
        let loop = 1;
        let computedPrice = 0;
        f_offTemp = 0;
        //if(req.body.price)
        resultA = result;
        while (loop) {


          for (let i = 0; i < result.length; i++) {


            if (f_level == result[i].level && result[i].level != "") {

              if (!isNaN(result[i].formul)) {
                loop = 0;
                initPrice = parseInt(result[i].formul);
                TempFormul = null;

              } else {
                TempFormul = result[i].formul;
                if (!computedPrice)
                  computedPrice = result[i].computedPrice;
                loop++
              }
            }



          }
          if (loop > 0 && !TempFormul) {

            loop = 0;
          }
          if (loop > 8) {
            initPrice = 0;
            loop = 0;
          }
          if (TempFormul) {


            formul = JSON.parse(TempFormul);
            f_level = formul.level;
            f_offTemp = req.body.off;
            f_off = eval(parseInt(formul.off) + formul.opr + parseInt(f_off));
            f_opr = formul.opr;



          }
        }

        var price;
        if (computedPrice) {
          price = eval(parseInt(computedPrice) + req.body.opr + (((computedPrice * parseInt(f_offTemp)) / 100)))
        }
        else {
          price = (initPrice && f_opr != "undefined" && f_off != "undefined" && f_opr != "" && f_off != "" && f_level != "" && f_level != "undefined" && !isNaN(f_off) && !isNaN(f_level)) ? eval(parseInt(initPrice) + f_opr + (((initPrice * parseInt(f_off)) / 100))) : initPrice;
        }
        if (req.body.price)
          price = req.body.price;

        for (let i = 0; i < resultA.length; i++) {
          if (isNaN(resultA[i].formul)) {
            var f = JSON.parse(resultA[i].formul);
            if (f.level == "-1" && req.body.price)
              resultA[i].computedPrice = eval(parseInt(req.body.price) + f.opr + (((parseInt(req.body.price) * parseInt(f.off)) / 100)));
            else if (!req.body.price && resultA[i].level == req.body.level)
              resultA[i].computedPrice = price;
          }
        }
        for (let i = 0; i < resultA.length; i++) {
          if (isNaN(resultA[i].formul)) {
            var f = JSON.parse(resultA[i].formul);
            if (f.level != "-1") {
              for (let j = 0; j < resultA.length; j++) {
                if (resultA[j].level == f.level) {
                  if (JSON.parse(resultA[j].formul).level == "-1")
                    resultA[i].computedPrice = eval(parseInt(resultA[j].computedPrice) + f.opr + (((parseInt(resultA[j].computedPrice) * parseInt(f.off)) / 100)));
                }
              }

            }
          }
        }


        for (let i = 0; i < resultA.length; i++) {
          if (isNaN(resultA[i].formul)) {
            var f = JSON.parse(resultA[i].formul);
            if (f.level != "-1") {
              for (let j = 0; j < resultA.length; j++) {
                if (resultA[j].level == f.level) {
                  if (JSON.parse(resultA[j].formul).level != "-1") {



                    for (let k = 0; k < resultA.length; k++) {
                      if (resultA[k].level == JSON.parse(resultA[j].formul).level) {
                        if (JSON.parse(resultA[k].formul).level == "-1")
                          resultA[i].computedPrice = eval(parseInt(resultA[j].computedPrice) + f.opr + (((parseInt(resultA[j].computedPrice) * parseInt(f.off)) / 100)));
                        else {
                          resultA[i].computedPrice = "محاسبه مجدد"
                        }
                      }
                    }










                  }
                }
              }

            }
          }
        }

        if (resultA.length > 0) {
          var bulk = dbo.collection("offs").initializeUnorderedBulkOp();
          let DeepLvl = 0;
          resultA.forEach(function (doc) {
            if (isNaN(doc.formul) && doc.computedPrice /*&& JSON.parse(doc.formul) && JSON.parse(doc.formul).level=="-1"*/)
              bulk.find({ product_id: ObjectId(id), level: doc.level }).update({ $set: { computedPrice: doc.computedPrice } });
            // else if(isNaN(doc.formul) && doc.computedPrice && JSON.parse(doc.formul) && JSON.parse(doc.formul).level!="-1"){
            // for(var i=0;i<resultA.length;i++){
            // if(resultA[i].level == JSON.parse(doc.formul).level){
            //  f_level = JSON.parse(doc.formul).level;
            //  f_off = JSON.parse(doc.formul).off;
            //   f_opr = JSON.parse(doc.formul).opr;
            //bulk.find( { product_id: ObjectId(id),level:doc.level } ).update( { $set: {computedPrice: eval(parseInt(resultA[i].computedPrice)+f_opr+(((parseInt(resultA[i].computedPrice)*parseInt(f_off))/100)))} } );

            // if(JSON.parse(resultA[i].formul).level=="-1")
            //  bulk.find( { product_id: ObjectId(id),level:doc.level } ).update( { $set: {computedPrice: eval(parseInt(resultA[i].computedPrice)+f_opr+(((parseInt(resultA[i].computedPrice)*parseInt(f_off))/100)))} } );
            // else
            //{
            /*f_level = JSON.parse(resultA[i].formul).level;
            for(var j=0;j<resultA.length;j++){
              if(resultA[j].level == f_level){
                bulk.find( { product_id: ObjectId(id),level:doc.level } ).update( { $set: {computedPrice: eval(parseInt(resultA[j].computedPrice)+f_opr+(((parseInt(resultA[j].computedPrice)*parseInt(f_off))/100)))} } );

              }
            }*/
            //   bulk.find( { product_id: ObjectId(id),level:doc.level } ).update( { $set: {computedPrice: "محاسبه مجدد"} } );

            //   }
            //  }
            // } 



            //}  
          })
          bulk.execute();

        }
        dbo.collection("offs").update({ "_id": ObjectId(req.body._id) }, { $set: { "computedPrice": price } }, function (err, result2) {
          if (err) throw err;
          res.json({
            result: price,
          })
          db.close();
        });

      });
    })


  })

})
router.post('/getSettings', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("setting").find({}).toArray(function (err, result) {
      if (err) throw err;

      res.json({
        result: result,
      })

      db.close();
    });
  });
})
router.post('/setSettings', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection("setting").update({ _id: "1" }, { $set: req.body.updateQuery }, { upsert: true }, function (err, result) {
      if (err) throw err;
      res.json({
        result: result,
      })
      db.close();
    });
  });

})
router.post('/GetSpecifications', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = req.body.Spec == "All" ? {} : { _id: { $in: req.body.Spec } }
    dbo.collection("specifications").find(condition).sort({ "_id": -1 }).toArray(function (err, result) {
      if (err) throw err;

      res.json({
        result: result,
      })

      db.close();
    });
  });

})



router.post('/SetSpecifications', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body.InsertSpec) {
      
  
      dbo.collection("specifications").find({}).sort({ _id: -1 }).limit(1).toArray(function (err, result) {
        let _id = result.length >0 ? result[0]._id+1 : 1;
        dbo.collection("specifications").insert({ _id: _id, "title": req.body.title }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        });
      })
      
      
    } else if (req.body.DelSpec) {
      dbo.collection("specifications").deleteOne({ _id: parseInt(req.body._id) }, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
          result: result,
        })
        db.close();
      })
    }else if (req.body.EditSpec) {
      dbo.collection("specifications").updateOne({ _id: parseInt(req.body._id) }, { $set: { title: req.body.title} }, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
          result: result,
        })
        db.close();
      })
    }

  });

})
router.post('/setCatPeykSettings', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);

    dbo.collection("category").update({ "_id": ObjectId(req.body.CategoryId) }, { $set: { SendToCity: req.body.SendToCity, SendToNearCity: req.body.SendToNearCity, SendToState: req.body.SendToState, SendToCountry: req.body.SendToCountry, MergeableInPeyk: req.body.MergeableInPeyk, CumputeByNumberInPeyk: req.body.CumputeByNumberInPeyk } }, function (err, result) {
      if (err) throw err;
      res.json({
        result: result,
      })
      db.close();
    });

  });

})
router.post('/SetTransfer', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body._id && req.body.type != "edit") {
      dbo.collection("transferMoney").deleteOne({ _id: ObjectId(req.body._id) }, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json({
          result: result,
        })
        db.close();
      })
      return
    } else if (req.body._id && req.body.type == "edit") {
      dbo.collection("transferMoney").updateOne({ _id: ObjectId(req.body._id) }, { $set: { status: req.body.status, statusDesc: req.body.statusDesc } }, function (err, result) {
        if (err) throw err;
        res.json({
          result: result,
        })
        db.close();
      });
      return;
    }
    dbo.collection("transferMoney").insertOne({ "UserId": ObjectId(req.body.UserId), "SellerId": ObjectId(req.body.SellerId), "sheba": req.body.sheba, "price": req.body.price, "date": moment().locale('fa').format('YYYY/M/D'), status: req.body.status, statusDesc: req.body.statusDesc }, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({
        result: result,
      })
      db.close();
    });

  });
})
router.post('/GetTransfer', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;
  let condition = !req.body.condition ? (req.body.SellerId ? { SellerId: ObjectId(req.body.SellerId) } : { price: { $ne: null } }) : req.body.condition
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection('transferMoney').aggregate([
      {

        $lookup: {
          from: "users",
          localField: "UserId",
          foreignField: "_id",
          as: "user"
        }
      },
      {

        $lookup: {
          from: "shops",
          localField: "SellerId",
          foreignField: "_id",
          as: "shop"
        }
      },
      {
        $match: condition


      }
    ]).sort({ date: -1 }).limit(10).toArray(function (err, result) {

      if (err) throw err;

      res.json({
        result: result
      })
      db.close();

    });
  })
})
router.post('/GetFilters', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = {};
    if (req.body.number) {
      let number = req.body.number.toString();
      dbo.collection("reports").find({ number: number }).sort({ "FId": 1 }).toArray(function (err, result) {
        if (err) throw err;

        res.json({
          result: result,
        })

        db.close();
      });

    } else if (req.body._id) {
      let objectIdArray = req.body._id.map(s => ObjectId(s));

      dbo.collection("filters").find({ _id: { $in: objectIdArray } }).sort({ "FId": 1 }).toArray(function (err, result) {
        if (err) throw err;

        res.json({
          result: result,
        })

        db.close();
      });

    } else {
      dbo.collection("filters").find(condition).sort({ "FId": 1 }).toArray(function (err, result) {
        if (err) throw err;

        res.json({
          result: result,
        })

        db.close();
      });
    }

  });

})
router.post('/SetFilters', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body._id) {
      if (req.body.del) {
        dbo.collection("filters").deleteOne({ _id: ObjectId(req.body._id) }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        })
      } else {
        dbo.collection("filters").updateOne({ _id: ObjectId(req.body._id) }, { $set: { name: req.body.name, type: req.body.type, FId: req.body.FId, DbTableName: req.body.DbTableName, DBTableFieldLabel: req.body.DBTableFieldLabel, DBTableFieldValue: req.body.DBTableFieldValue, latinName: req.body.latinName } }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        });
      }

      return;
    }
    dbo.collection("filters").insertOne({ name: req.body.name, type: req.body.type, FId: req.body.FId, DbTableName: req.body.DbTableName, DBTableFieldLabel: req.body.DBTableFieldLabel, DBTableFieldValue: req.body.DBTableFieldValue, latinName: req.body.latinName }, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({
        result: result,
      })
      db.close();
    });

  });
})


router.post('/GetReports', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = {}
    dbo.collection("reports").find(condition).sort({ "_id": -1 }).toArray(function (err, result) {
      if (err) throw err;

      res.json({
        result: result,
      })

      db.close();
    });
  });

})

router.post('/GetTags', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = {}
    dbo.collection("tags").find({}).toArray(function (err, result) {
      if (err) throw err;

      res.json({
        result: result,
      })

      db.close();
    });
  });

})


router.post('/SetReports', function (req, res, next) {
  //res.send("hello world")

  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body._id) {
      if (req.body.del) {
        dbo.collection("reports").deleteOne({ _id: ObjectId(req.body._id) }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        })
      } else {
        dbo.collection("reports").updateOne({ _id: ObjectId(req.body._id) }, { $set: { name: req.body.name, number: req.body.number, Filters: req.body.Filters, method: req.body.method } }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        });
      }

      return;
    }
    dbo.collection("reports").insertOne({ name: req.body.name, number: req.body.number, Filters: req.body.Filters, method: req.body.method }, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({
        result: result,
      })
      db.close();
    });

  });
})


router.post('/SetTags', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    if (req.body._id) {
      if (req.body.del) {
        dbo.collection("tags").deleteOne({ _id: ObjectId(req.body._id) }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        })
      } else {
        dbo.collection("tags").updateOne({ _id: ObjectId(req.body._id) }, { $set: { title: req.body.title } }, function (err, result) {
          if (err) throw err;
          res.json({
            result: result,
          })
          db.close();
        });
      }

      return;
    }
    dbo.collection("tags").insertOne({ title: req.body.title }, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({
        result: result,
      })
      db.close();
    });

  });
})
router.post('/searchItems', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = {}
    if(!Array.isArray(req.body.name))
      condition[req.body.name] = new RegExp(req.body.title, "i");
    else{
      let preCondition= [];
      let temp={};

      for(let item of req.body.name){
        temp={};
        temp[item]=new RegExp(req.body.title, "i");
        preCondition.push(temp);
      }
      condition = {$or: preCondition};

    }

    dbo.collection(req.body.table).find(condition).limit(6).toArray(function (err, result) {
      res.json({
        result: result
      })
      db.close();
    })

  });
})

router.post('/GetCodes', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = {}
    if (req.body.search) {
      if (isNaN(req.body.search)) {
        condition = { $or: [{ title: new RegExp(req.body.search, "i") }, { Etitle: new RegExp(req.body.Etitle, "i") }] }
      } else {
        condition = { id: req.body.search }
      }

    }
    if (req.body.id) {
      if(typeof req.body.id === "object"){
        condition = {id: { $in: req.body.id }  }
      }else{
        condition = { id: req.body.id }

      }
    }
    dbo.collection("code_files").find(condition).sort({ "id": -1 }).limit(req.body.limit || 10).toArray(function (err, result) {
      if (err) throw err;

      res.json({
        result: result,
      })

      db.close();
    });
  });

})
router.post('/SetCodes', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let insertCodes = []
    let id = req.body.id;
    let title = req.body.title;
    let Etitle = req.body.Etitle;
    let PriceChange = req.body.PriceChange;
    let MultiSelect = req.body.MultiSelect;
    for (let i = 0; i < req.body.count; i++) {
      if (req.body["value_" + i])
        insertCodes.push({ value: req.body["value_" + i], desc: req.body["desc_" + i] })
    }
    dbo.collection("code_files").update({ id: id }, { $set: { id: id, title: title, Etitle: Etitle, values: insertCodes,PriceChange:PriceChange,MultiSelect:MultiSelect } }, { upsert: true }, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({
        result: result,  
      })
      db.close();
    });




  })

})

module.exports = router;