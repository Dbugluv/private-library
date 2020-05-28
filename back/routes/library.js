var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbConfig = require('../db/DBConfig')
var pool = mysql.createPool( dbConfig.config );
var router = express.Router();


var LibrarySQL = {
  insert: 'INSERT INTO librarys(libName,libClass,libLocation,ownerId) VALUES(?,?,?,?)', // 插入数据
  drop: 'DROP TABLE librarys', // 删除表中所有的数据
  del: 'delete from librarys where libId = ?',
  queryAll: 'SELECT * FROM librarys', // 查找表中所有数据
  getLibById: 'SELECT * FROM librarys WHERE libId =', // 查找符合条件的数据
  updateLib: 'UPDATE librarys SET libName = ? WHERE libId=?',
  queryByownerId: 'SELECT * FROM librarys WHERE ownerId = ?'
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

//返回用户下的图书集
router.get('/ownerLib', function(req, res){
  var ownerId = req.query.ownerId
  pool.getConnection(function (err, connection) {
    connection.query(LibrarySQL.queryByownerId, [ownerId], function (err,result) {
      if(err){
        console.log('返回用户下的图书集失败',err.message);
      }
      str = JSON.stringify(result);
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
    connection.query(LibrarySQL.getLibById + id, function (err,result) {
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
  var ownerId = params.ownerId
  console.log('book-params: ',params)
  var sqlArr = [libName, libClass, libLocation, ownerId];
  pool.getConnection(function (err, connection) {
    connection.query(LibrarySQL.insert, sqlArr, function (err,result) {
      if(err){
        console.log('图书集添加失败',err.message);
      } else {
        setTimeout(function(){
          res.status(200).send('success');
    　　   connection.release();
    　　 },200)
      }
      var str = JSON.stringify(result);
      console.log(str);  //数据库查询结果返回到result中
    });
  });
});


//更新信息
router.get("/update",function(req,res,next){
  var libId = req.query.libId;
  var libName = req.query.libName;
  pool.getConnection(function (err, connection) { 
    connection.query(LibrarySQL.updateLib,[libName,libId], function(err,result){
      if(err){
          res.send("更新信息失败 " + err);
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

//删除图书集
router.get('/delLib', function(req, res){
  var libId = req.query.libId
  pool.getConnection(function (err, connection) {
    connection.query(LibrarySQL.del, [libId], function (err,result) {
      if(err){
        console.log('删除图书集失败',err.message);
        res.send(err.message);
      } else  {
        setTimeout(function(){
          res.send(str);
    　　   connection.release();
    　　 },200)
      }
      str = JSON.stringify(result);
    });
  });
});

module.exports = router;
