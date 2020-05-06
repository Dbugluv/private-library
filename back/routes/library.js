var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbConfig = require('../db/DBConfig')
var pool = mysql.createPool( dbConfig.config );
var router = express.Router();


var LibrarySQL = {
  insert: 'INSERT INTO librarys(libName,libClass,libLocation) VALUES(?,?,?)', // 插入数据
  drop: 'DROP TABLE librarys', // 删除表中所有的数据
  del: 'delete from librarys where libId =',
  queryAll: 'SELECT * FROM librarys', // 查找表中所有数据
  getBookById: 'SELECT * FROM librarys WHERE libId =', // 查找符合条件的数据
};

var str = '';

router.get('/queryALl', function(req, res){
  pool.getConnection(function (err, connection) {
    connection.query(LibrarySQL.queryAll, function (err,result) {
      if(err){
        console.log('失败',err.message);
      }
      str = JSON.stringify(result);
      // console.log(str);  //数据库查询结果返回到result中
    });
    
    setTimeout(function(){
      res.send(str);
  　　   connection.release();
  　　 },200)
  });
});

//获取单独信息
router.get('/getOne/:id', function(req,res) {
  var id = req.params.id
  pool.getConnection(function (err, connection) {
    connection.query(LibrarySQL.getBookById + id, function (err,result) {
      if(err){
        console.log('获取单独信息失败',err.message);
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
  var libName = params.libName;
  var libClass = params.libClass;
  var libLocation = params.libLocation;
  console.log('book-params: ',params)
  var sqlArr = [libName, libClass, libLocation];
  pool.getConnection(function (err, connection) {
    connection.query(LibrarySQL.insert, sqlArr, function (err,result) {
      if(err){
        console.log('图书集添加失败',err.message);
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

//删除某本书信息
router.get('/del/:id', function(req, res){
  //数据库连接、数据操作
  console.log('id',req.params.id)
  pool.getConnection(function (err, connection) {
    connection.query(`${LibrarySQL.del}${req.params.id}`, function (err,result) {
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
  var sql = "update librarys set libName = " + "测试图书集" + " where libId = " + id;
  pool.getConnection(function (err, connection) { 
    connection.query(sql,function(err,result){
      if(err){
          res.send("更新用户信息失败 " + err);
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
    connection.query("update librarys set bookName='" + name + "' where bookId=" + id, function (err, rows) {
      if (err) {
        res.end('修改失败：' + err);
      } else {
        res.redirect('/users');
      }
    });
  });
});

module.exports = router;
