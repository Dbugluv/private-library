// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbConfig = require('../db/DBConfig')
// var sqlConnection = require('../db/DBConfig')
var url = require("url");

var pool = mysql.createPool( dbConfig.config );
var router = express.Router();


var UserSQL = {
  insert: 'INSERT INTO userInfo(userName,password,userNumber) VALUES(?,?,?)', // 插入数据
  drop: 'DROP TABLE userInfo', // 删除表中所有的数据
  del: 'delete from userInfo where userId =',
  queryAll: 'SELECT * FROM userInfo', // 查找表中所有数据
  getUserById: 'SELECT * FROM userInfo WHERE userId =', // 查找符合条件的数据
};

var str = '';

//获取所有数据
router.get('/', function(req, res){
  // console.log('raeffae',dbConfig)
  pool.getConnection(function (err, connection) {
    connection.query(UserSQL.queryAll, function (err,result) {
      if(err){
        console.log('失败',err.message);
      }
      str = JSON.stringify(result);
      console.log(str);  //数据库查询结果返回到result中
    });
    setTimeout(function(){
  　　   connection.release();
  　　 },200)
  });
  res.status(200).send('success');

  //数据库连接、数据操作
   /*  dbConfig.sqlConnection(UserSQL.queryAll,[],function (err,result) {
      if(err){
        console.log('[SELECT ERROR]:',err.message);
      }
      str = JSON.stringify(result);
      console.log(str);  //数据库查询结果返回到result中
  });
  res.send(str); */
});

//获取单独信息
router.get('/getOne/:id', function(req,res) {
  var id = req.params.id
  pool.getConnection(function (err, connection) {
    connection.query(UserSQL.getUserById+id, function (err,result) {
      if(err){
        console.log('失败',err.message);
      }
      str = JSON.stringify(result);
      console.log(str);  //数据库查询结果返回到result中
    });
    setTimeout(function(){
  　　   connection.release();
  　　 },200)
  });
  res.status(200).send('success');
})

//增加
router.get('/add', function(req, res){
  //数据库连接、数据操作
  var params = req.query;
  var userNumber = params.userNumber;
  var userName = params.userName;
  var password = params.password;

  console.log('params: ',params)
  var sqlArr = [userName, password,userNumber];
  pool.getConnection(function (err, connection) {
    connection.query(UserSQL.insert, sqlArr, function (err,result) {
      if(err){
        console.log('添加失败',err.message);
      }
      var str = JSON.stringify(result);
      console.log(str);  //数据库查询结果返回到result中
    });
    setTimeout(function(){
　　   connection.release();
　　 },200)
  });
  res.status(200).send('success');
});

//删除某人信息
router.get('/del/:id', function(req, res){
  //数据库连接、数据操作
  console.log('id',req.params.id)
  pool.getConnection(function (err, connection) {
    connection.query(`${UserSQL.del}${req.params.id}`, function (err,result) {
      if(err){
        console.log('删除失败',err.message);
      }
      str = JSON.stringify(result);
      console.log(str);  //数据库查询结果返回到result中
    });
    setTimeout(function(){
　　   connection.release();
　　 },200)
  });
  res.status(200).send('success');
});

//更新用户信息
router.get("/update/:id",function(req,res,next){
  console.log('req.body: ',req.body,req.params.id)
  var id = req.params.id;
  var sql = "update userInfo set userName = '"+ 'dddddnew' +"' where userId = " + id;
  pool.getConnection(function (err, connection) { 
    connection.query(sql,function(err,result){
      if(err){
          res.send("修改失败 " + err);
      }else {
        str = JSON.stringify(result);
      }
      setTimeout(function(){
  　　   connection.release();
  　　 },200);
    });
    res.status(200).send('success');
  })
 
});

router.post('/update', function (req, res) {
  console.log('req.body: ',req.body)
  var id = req.body.id;
  var name = req.body.name;
  pool.getConnection(function (err, connection) { 
    connection.query("update userInfo set userName='" + name + "' where userId=" + id, function (err, rows) {
      if (err) {
        res.end('修改失败：' + err);
      } else {
        res.redirect('/users');
      }
    });
  });
});

module.exports = router;
