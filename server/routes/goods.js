var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var goods = require('../models/goods');
var user = require('../models/users')

mongoose.connect('mongodb://127.0.0.1:27017/mallApp');

mongoose.connection.on('connected',function(){
  console.log('success')
});

mongoose.connection.on('error',function(){
  console.log('error')
});

mongoose.connection.on('disconnected',function(){
  console.log('failed')
});

 router.get('/list',function(req,res,next){
  let page = parseInt(req.param('page'));
  let sort = req.param('sort');
  let pageSize = parseInt(req.param('pageSize'));
  let priceLevel = req.param('priceLevel');
  let skip = (page-1)*pageSize;
  let priceGt = ''; let priceLte = '';
  let params = {};
  if(priceLevel != 'all'){
    switch(priceLevel){
      case '0': priceGt = 0;priceLte = 100;break;
      case '1': priceGt = 100;priceLte = 500;break;
      case '2': priceGt = 500;priceLte = 1000;break;
      case '3': priceGt = 1000;priceLte = 5000;break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  let goodsModel = goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  
  goodsModel.exec(function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message
      });
    }else{
      res.json({
        status: '0',
        msg: '',
        result:{
          count: doc.length,
          list: doc
        }
      })
    }
  })
});


router.post("/addCart", function (req,res,next) {
  var userId = '100000077',productId = req.body.productId;
  var user = require('../models/users');
  user.findOne({userId:userId}, function (err,userDoc) {
    if(err){
        res.json({
            status:"1",
            msg:err.message
        })
    }else{
      
        console.log("userDoc:"+userDoc);
        if(userDoc){
          var goodsItem = '';
          userDoc.cartList.forEach(function (item) {
              if(item.productId == productId){
                goodsItem = item;
                item.productNum ++;
              }
          });
          if(goodsItem){
            userDoc.save(function (err2,doc2) {
              if(err2){
                res.json({
                  status:"1",
                  msg:err2.message
                })
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'suc'
                })
              }
            })
          }else{
            goods.findOne({productId:productId}, function (err1,doc) {
              if(err1){
                res.json({
                  status:"1",
                  msg:err1.message
                })
              }else{
                if(doc){
                  doc.productNum = 1;
                  doc.checked = 1;
                  userDoc.cartList.push(doc);
                  userDoc.save(function (err2,doc2) {
                    if(err2){
                      res.json({
                        status:"1",
                        msg:err2.message
                      })
                    }else{
                      res.json({
                        status:'0',
                        msg:'',
                        result:'suc'
                      })
                    }
                  })
                }
              }
            });
          }
        }
    }
  })
});



module.exports = router;
