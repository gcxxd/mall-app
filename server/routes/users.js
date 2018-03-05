var express = require('express');
var util=require('./../util/util');
var user =require('../models/users');
var router = express.Router();

/* GET users listing. */
router.post('/login', function(req, res, next) {
  var param = {
    userName : req.body.userName,
    userPwd : req.body.userPwd
  }
  user.findOne(param,function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message
      })
    }else{
      if(doc){
        res.cookie('userId',doc.userId,{
          path: '/',
          maxAge: 1000*60*60
        });
       res.cookie("userName",doc.userName,{
                path:'/',
                maxAge:1000*60*60
              });
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName,
            userPwd: doc.userPwd
          }
        })
      }
    }
  });
});

//登出

router.post('/logout',function(req,res,next){
  res.cookie('userId','',{
    path:'/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

//校验
router.get('/checkLogin',function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    })
  }else{
    res.json({
      status: '1',
      msg: '',
      result: ''
    });
  }
});

router.get('/cartList',function(req,res,next){
  var userId = req.cookies.userId;
  user.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: doc.cartList
      })
    }
  })
})

//购物车删除
router.post('/cartListDel', function(req,res,next){
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  user.update({userId:userId},{$pull:{'cartList':{'productId':productId}}},function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      })
    }
  });
})

//购物车修改
router.post('/cartEdit',function(req,res,next){
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum =req.body.productNum;
  var checked =req.body.checked;
  user.update({'userId':userId,'cartList.productId':productId},{
    'cartList.$.productNum':productNum,
    "cartList.$.checked":checked
  },function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      })
    }
  });
});

router.post('/editCheckAll',function(req,res,next){
  var userId = req.cookies.userId;
  var checkAll =req.body.checkAll?'1':'0';
  user.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      if(doc){
        doc.cartList.forEach((item)=>{
          item.checked = checkAll; 
        })
      }
      user.save(function(error,doc){
        if(error){
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        }else{
          res.json({
            status: '0',
            msg: '',
            result: 'success'
          })
        }
      })
    }
  })
})

//查询用户地址接口
router.get('/addressList',function(req,res,next){
  var userId = req.cookies.userId;
  user.findOne({userId:userId},function(err,doc){
    if(err){
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        }else{
          res.json({
            status: '0',
            msg: '',
            result: doc.addressList
          })
        }
  })
})

//设置默认
router.post('/setDefault',function(req,res,next){
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status: '1003',
      msg: err.message,
      result: ''
    })
  }
  user.findOne({userId:userId},function(err,doc){
    if(err){
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        }else{
          var addressList = doc.addressList;
          addressList.forEach((item)=>{
            if(item.addressId == addressId){
              item.isDefault = true;
            }else{
              item.isDefault = false;
            }
          })
          doc.save(function(error,doc1){
            if(error){
              res.json({
                status: '1',
                msg: err.message,
                result: ''
              })
            }else{
              res.json({
                status: '0',
                msg: '',
                result: ''
              })
            }
          })
          
        }
  })
})

//删除地址
router.post('/delAddress',function(req,res,next){
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  user.update({'userId':userId},{
    $pull:{
      'addressList':{
        'addressId': addressId
      }
    }
  },function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      })
    }
  })
});

//订单
router.post('/payMent',function(req,res,next){
  var userId = req.cookies.userId;
  var orderTotal = req.body.orderTotal;
  var addressId = req.body.addressId;
  user.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      var address = '',goodList=[];
      doc.addressList.forEach((item)=>{
        if(addressId == item.addressId){
          address = item;
        }
      });
      doc.cartList.filter((item)=>{
        if(item.checked == '1'){
          goodList.push(item);
        }
      });

      var platForm = '666';
      var r = Math.floor(Math.random()*10);
      var r1 = Math.floor(Math.random()*10);

      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platForm+r+sysDate+r1;
      var order= {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList:goodList,
        orderStatus:'1',
        createDate: createDate
      };
      doc.orderList.push(order);
      doc.save(function(error,doc1){
            if(error){
              res.json({
                status: '1',
                msg: err.message,
                result: ''
              })
            }else{
              res.json({
                status: '0',
                msg: '',
                result: {
                  order: orderId,
                  orderTotal: orderTotal
                }
              })
            }
      })
    }
  })
})

//订单成功
router.get('/orderDetail',function(req,res,next){
  var userId = req.cookies.userId;
  var orderId = req.param("orderId");
  user.findOne({
    userId:userId
  },function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      var orderList = doc.orderList;
      if(orderList.length>0){
        var orderTotal = 0;
        orderList.forEach((item)=>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal;
          }
        });
       if(orderTotal>0){
          res.json({
          status: '0',
          msg: '',
          result: {
            orderId: orderId,
            orderTotal: orderTotal
          }
        })
       }
      }else{
        res.json({
        status: '120',
        msg: '',
        result: ''
      })
      }
    }
  })
})

//购物车数量
router.get('/getCartCount',function(req,res,next){
  if(req.cookies && req.cookies.userId){
     var userId = req.cookies.userId;
     user.findOne({userId:userId},function(err,doc){
      if(err){
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          }else{
            var cartList = doc.cartList;
            let cartCount = 0;
            cartList.map(function(item){
              cartCount+=parseInt(item.productNum);
            });
            res.json({
              status: '0',
              msg: '',
              result: cartCount
            })
          }
    })
  }
})
module.exports = router;
