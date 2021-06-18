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
//var database = "mydb";
var database = "food";


//var url = "mongodb://sarvapps_user:sj9074286@localhost:27017/sarvapps_db"; 
//var database = "sarvapps_db";

//var url = "mongodb://sarvapps_user:sj9074286@localhost:27017/sarvapps_food"; 
//var database = "sarvapps_food";

//var url = "mongodb://emdcctvc_user:sj9074286@localhost:27017/emdcctvc_db"; 
//var database = "emdcctvc_db"; 


router.post('/getSellerInfo', function (req, res, next) {

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

router.post('/GetCompanyAction', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = {
      $or: [{ name: req.body.name }, { username: req.body.username }], Date: {
        $gte: req.body.fromDate,
        $lte: req.body.UntilDate
      }
    }
    dbo.collection("work").find(condition).sort({ "Date": 1, "EndTime": 1 }).toArray(function (err, result) {
      if (err) throw err;
      let output = "";
      let sumTime = 0;
      let bestSumTime = 0;
      if (result && result.length > 0) {
        output += "<div style='padding:20px;display:flex;justify-content:space-between;background:#eee'><div >نام کاربر : " + result[0].name + " </div><div>از تاریخ : " + req.body.fromDate + "</div><div>تا تاریخ : " + req.body.UntilDate + "</div></div>"
        output += "<div style='display:flex;flex-wrap:wrap' class='table'>";
        output += "<div style='text-align:center;width:10%'>ردیف</div><div style='text-align:center;width:15%'>تاریخ</div><div style='text-align:center;width:15%'>ساعت شروع</div><div style='text-align:center;width:15%'>ساعت پایان</div><div style='text-align:center;width:30%'>توضیح</div><div style='text-align:center;width:15%'>نوع</div>";

        for (var i = 0; i < result.length; i++) {
          sumTime += (new Date("01/01/2007 " + result[i].EndTime).getTime() - new Date("01/01/2007 " + result[i].StartTime).getTime()) / 60000;
          if (result[i].type != "فاقد کار")
            bestSumTime += (new Date("01/01/2007 " + result[i].EndTime).getTime() - new Date("01/01/2007 " + result[i].StartTime).getTime()) / 60000;
          output += "<div style='text-align:center;width:10%'>" + (i + 1) + "</div><div style='text-align:center;width:15%'>" + result[i].Date + "</div><div style='text-align:center;width:15%'>" + result[i].StartTime + "</div><div style='text-align:center;width:15%'>" + result[i].EndTime + " </div><div style='text-align:center;width:30%'>" + result[i].desc + "</div><div style='text-align:center;width:15%'>" + result[i].type + "</div>";
        }

        output += "</div>"
      }
      output += "<div style='display:flex;flex-direction:column'>";
      output += "<div>جمع ساعت کارکرد روز : " + sumTime + " دقیقه (" + parseFloat(sumTime / 60).toFixed(1) + " ساعت)</div>";
      output += "<div>جمع ساعت کارکرد مفید روز : " + bestSumTime + " دقیقه (" + parseFloat(bestSumTime / 60).toFixed(1) + " ساعت)</div>";
      output += "</div>";
      res.json({
        result: output,
      })

      db.close();
    });
  });

})



router.post('/getPaykAmount', function (req, res, next) {


})
router.post('/getCombo', function (req, res, next) {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let condition = {}
    dbo.collection(req.body.DbTableName).find({}).sort({ "_id": -1 }).toArray(function (err, result) {
      if (err) throw err;

      res.json({
        result: result,
      })

      db.close();
    });
  });


})


router.post('/getShop', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let fromDate = req.body.fromDate;
    let UntilDate = req.body.UntilDate;
    dbo.collection("shops").find({ AllowCredit: req.body.AllowCredit }).toArray(function (err, result) {
      if (err) throw err;

      let output = "";
      output += "<table style='width:100%' ><tr style='margin-top:5px;background:#ffd8bd'><td style='width:70px;text-align:right'>ردیف</td><td style='text-align:right'>نام فروشگاه</td>";
      output += "<td style='text-align:right'>تلفن تماس</td><td style='text-align:right'>کمیسیون مهرکارت</td><td style='text-align:right'>استان</td><td style='text-align:right'>شهر</td><td style='text-align:right'>موبایل</td></tr>";
      if (result && result.length > 0) {

        for (var i = 0; i < result.length; i++) {
          let color = i % 2 ? '#eee' : '#fff';
          output += "<tr style='margin-top:5px;background:" + color + "' >";



          output += "<td style='width:70px;text-align:right' ><div >" + (i + 1) + "</td>";
          output += "<td style='text-align:right'>" + result[i].name + "</td> ";
          output += "<td style='text-align:right'>" + result[i].call + "</td> ";
          output += "<td style='text-align:right'>" + result[i].MehrCommission + "</td> ";
          output += "<td style='text-align:right'>" + result[i].city + "</td> ";
          output += "<td style='text-align:right'>" + result[i].subCity + "</td> ";
          output += "<td style='text-align:right'>" + result[i].mobile + "</td> ";


          output += "</tr>";





        }
        output += "</table>";

      }
      res.json({
        result: output
      })

      db.close();
    });
  });

})

router.post('/getMehrCarts', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let fromDate = req.body.fromDate;
    let UntilDate = req.body.UntilDate;
    dbo.collection('credit_payment').aggregate([
      {
        $lookup: {
          from: "users",
          localField: "username",
          foreignField: "username",
          as: "userData"
        }
      },
      {
        $lookup: {
          from: "shops",
          localField: "ShopId",
          foreignField: "_id",
          as: "Seller"
        }
      },
      {
        $match: {
          ShopId: req.body.ShopName_name ? ObjectId(req.body.ShopName_name) : { $ne: '---' },
          username: req.body.username ? req.body.username : { $ne: null },
          Date: {
            $gte: fromDate ? fromDate : "0000/0/0",
            $lte: UntilDate ? UntilDate : "2000/12/12",
          }
        }
      }
    ]).sort({  _id: -1 , Date_c: -1 }).toArray(function (err, result) {
      if (err) throw err;



      let output = "";
      output += "<table style='width:100%' ><tr style='margin-top:5px;background:#ffd8bd'><td style='width:70px;text-align:right'>ردیف</td><td style='text-align:right'>نام خریدار</td>";
      output += "<td style='text-align:right'>فروشگاه</td><td style='text-align:right'>مبلغ(تومان)</td><td style='text-align:right'>توضیح</td><td style='text-align:right'>روز</td><td style='text-align:right'>ساعت</td><td style='text-align:right'>وضعیت</td></tr>";
      if (result && result.length > 0) {

        for (var i = 0; i < result.length; i++) {
          let color = i % 2 ? '#eee' : '#fff';
          output += "<tr style='margin-top:5px;background:" + color + "' >";



          output += "<td style='width:70px;text-align:right' ><div >" + (i + 1) + "</td>";
          if (result[i].userData[0])
            output += "<td style='text-align:right'>" + result[i].userData[0].name + "</td> ";
          else
            output += "<td style='text-align:right'>" + result[i].username + "</td> ";
          if ((result[i].Seller && result[i].Seller[0]))
            output += "<td style='text-align:right'>" + result[i].Seller[0].name + "</td> ";
          else
            output += "<td style='text-align:right'>-</td> ";
          output += "<td style='text-align:right'>" + result[i].Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td> ";
          if(result[i].desc)
            output += "<td style='text-align:right'>" + result[i].desc + "</td> ";
          else
            output += "<td style='text-align:right'></td> ";
          output += "<td style='text-align:right'>" + result[i].Date + "</td> ";
          output += "<td style='text-align:right'>" + result[i].Time + "</td> ";
          if (result[i].type == 1)
            output += "<td style='text-align:right;color:green'>واریز</td> ";
          else
            output += "<td style='text-align:right;color:red'>برداشت</td> ";
          output += "</tr>";





        }
        output += "</table>";

      }
      res.json({
        result: output
      })

      db.close();
    });
  });

})

router.post('/getMehrShopCredit', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let fromDate = req.body.fromDate;
    let UntilDate = req.body.UntilDate;
    dbo.collection('credit_payment').aggregate([

      {
        $lookup: {
          from: "shops",
          localField: "ShopId",
          foreignField: "_id",
          as: "Seller"
        }
      },
      {
        $match: {
          ShopId: req.body.ShopName_name ? ObjectId(req.body.ShopName_name) : { $ne: null },
          Date_c: {
            $gte: fromDate ? Date.parse(fromDate) : Date.parse("1300/1/1"),
            $lte: UntilDate ? Date.parse(UntilDate) : Date.parse("2000/12/12"),
          }
        }
      }
    ]).sort({ _id: -1 , Date_c: -1 }).toArray(function (err, result) {
      if (err) throw err;
      let output = "";

      let ComputeCredit = 0
      let ress = [];
      let IdTemps = [];
      if (result && result.length > 0) {
        ComputeCredit = 0;
        for (var i = 0; i < result.length; i++) {
          let temp = [];
          for (var j = 0; j < result.length; j++) {
            if (result[i].ShopId.toString() == result[j].ShopId.toString() && IdTemps.indexOf(result[i].ShopId.toString()) == -1) {
              temp.push(result[j])
            }

          }
          IdTemps.push(result[i].ShopId.toString());
          if (temp.length > 0)
            ress.push(temp);

        }
      }
      output += "<table style='width:100%' ><tr style='margin-top:5px;background:#ffd8bd'><td style='width:70px;text-align:right'>ردیف</td>";
      output += "<td style='text-align:right'>فروشگاه</td><td style='text-align:right'>مبلغ(تومان)</td><td style='text-align:right'>سود مهرکارت</td><td style='text-align:right'>قابل پرداخت به فروشگاه</td></tr>";
      for (let i = 0; i < ress.length; i++) {
        for (let j = 0; j < ress[i].length; j++) {
          if (ress[i][j].type == 0 && ress[i][j].username == "system")
            ComputeCredit -= parseInt(ress[i][j].Amount);
          else
            ComputeCredit += parseInt(ress[i][j].Amount);

        }

        let color = i % 2 ? '#eee' : '#fff';
        output += "<tr style='margin-top:5px;background:" + color + "' >";


        output += "<td style='width:70px;text-align:right' ><div >" + (i + 1) + "</td>";
        output += "<td style='text-align:right'>" + ress[i][0].Seller[0].name + "</td> ";
        output += "<td style='text-align:right'>" + ComputeCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td> ";
        output += "<td style='text-align:right'>" + ((ComputeCredit * (ress[i][0].Seller[0].MehrCommission || 0)) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td> ";

        output += "<td style='text-align:right'>" + (ComputeCredit - ((ComputeCredit * (ress[i][0].Seller[0].MehrCommission || 0)) / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td> ";
        output += "</tr>";


  


      }
      output += "</table>";

      res.json({
        result: output
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
    condition[req.body.name] = new RegExp(req.body.title, "i");
    dbo.collection(req.body.table).find(condition).limit(6).toArray(function (err, result) {
      res.json({
        result: result
      })
      db.close();
    })

  });
})

router.post('/getShopFinancial', function (req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    let fromDate = req.body.fromDate;
    let UntilDate = req.body.UntilDate;

    let condition = { SellerId: req.body.ShopName }
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
          products: { $elemMatch: condition }, status: (!req.body.status || req.body.status == "") ? { $in: ["-2", "-1", "0", "1", "2", "3", "4", "5"] } : req.body.status,
          Day: {
            $gte: fromDate,
            $lte: UntilDate,
          }
        }
      }
    ]).sort({ Date: -1 }).toArray(function (err, result) {
      if (err) throw err;


      let finalPrice = 0,
        finalCredit = 0;
      for (var i = 0; i < result.length; i++) {
        let price = 0;
        for (var j = 0; j < result[i].products.length; j++) {
          if (req.body.ShopName == result[i].products[j].SellerName) {
            price += parseInt(result[i].products[j].price);
            if (result[i].status == "1" || result[i].status == "2" || result[i].status == "3" || result[i].status == "4") {
              finalPrice += parseInt(result[i].products[j].price);
              finalCredit += result[i].products[j].credit ? parseInt(result[i].products[j].credit) : 0;
            }


          }
          else
            result[i].products[j].remove = "1";
          if ((req.body.cancel == 1 && result[i].products[j].status != "-2") || (req.body.cancel == 2 && result[i].products[j].status != "-3")) {
            result[i].products[j].remove = "1";
          }
        }
        result[i].Amount = price
        result[i].products = result[i].products.filter(function (value, index, array) {
          return (value.remove != "1");
        });
        if (result[i].products.length == 0) {
          result.splice(i, 1);
        }

      }
      let output = "";
      if (result && result.length > 0) {
        output += "<div style='padding:20px;display:flex;justify-content:space-between;background:#eee'><div >نام فروشگاه : " + req.body.ShopName + " </div><div>از تاریخ : " + req.body.fromDate + "</div><div>تا تاریخ : " + req.body.UntilDate + "</div></div>"
        output += "<table style='width:100%' ><tr style='display:none;margin-top:5px'><td style='width:200px;text-align:right'>ردیف</td><td style='width:200px;text-align:right'>مبلغ فاکتور</td></tr>";

        for (var i = 0; i < result.length; i++) {
          output += "<tr style='margin-top:5px' >";
          output += "<td style='width:200px;text-align:right;border-bottom-width:0px;border-left-width:0px' ><div >ردیف : " + (i + 1) + "</td>"
            + "<td style='width:calc(100% - 200px);text-align:left;border-bottom-width:0px;border-right-width:0px'> مبلغ فاکتور :"
          if (result[i].finalAmount)
            output += result[i].finalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " تومان "
          else
            output += "0 تومان"
          output += "</td> ";
          output += "</tr>";
          output += "<tr><td colspan='3' style='border-top-width:0px'>"
          output += "<div style='text-align:right'> ";
          let Shop_Price = 0;
          for (var j = 0; j < result[i].products.length; j++) {
            output += "<div style='color:#ccc'>" + result[i].products[j].title + " (" + result[i].products[j].number + " عدد) </div>";
            if (result[i].products[j].Commission)
              output += "<div style='color:#ccc'>سود شرکت : " + result[i].products[j].Commission.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " تومان</div>";
            else
              output += "<div style='color:#ccc'>سود شرکت : 0 تومان</div>";
            Shop_Price += parseInt(result[i].products[j].price) - parseInt(result[i].products[j].Commission || 0);
          }
          output += "<div style='text-align:left;color:green'>قابل پرداخت به فروشگاه : " + Shop_Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " تومان</div>";
          output += "</div>";
          output += "</td></tr>"


        }
        output += "</table>";

      }
      res.json({
        result: output,
      })

      db.close();
    });
  });

})



module.exports = router;