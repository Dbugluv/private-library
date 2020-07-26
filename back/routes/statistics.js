var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbConfig = require('../db/DBConfig')
var url = require("url");

var pool = mysql.createPool( dbConfig.config );
var router = express.Router();


var StatSQL = {
  getBookCount: 
  'select count(*) as count from books where ownerId_b = ? UNION SELECT COUNT(*) FROM librarys where ownerId = ? UNION SELECT COUNT(*) FROM books where ownerId_b = ? GROUP BY ownedLibId',
  getBookType: 'SELECT COUNT(*) as count FROM books GROUP BY bookType ',
  // getBookProgress:'SELECT COUNT(*) as count FROM books WHERE progress = 0 AND ownerId_b =? UNION SELECT COUNT(*) FROM books WHERE progress > 0 AND progress < 30 AND ownerId_b =? UNION SELECT COUNT(*) FROM books WHERE progress >= 30 AND progress < 60 AND ownerId_b =? UNION SELECT COUNT(*) FROM books WHERE progress >= 60 AND progress < 100 AND ownerId_b =? UNION SELECT COUNT(*) FROM books WHERE progress =100 AND ownerId_b =?'
};

var str = '';

router.get('/getBookCount', function(req, res){
  var ownerId_b = req.query.ownerId_b;
  var ownerId = req.query.ownerId;
  console.log('ownerId_b',ownerId_b,'ownerId',ownerId)
  pool.getConnection(function (err, connection) {
    connection.query(StatSQL.getBookCount,[ownerId_b,ownerId,ownerId_b], function (err,result) {
      if(err){
        console.log('失败',err.message);
      }
      str = JSON.stringify(result);
      console.log('getBookCount', str);  //数据库查询结果返回到result中
    });
    setTimeout(function(){
　　   connection.release();
      res.send(str);
　　 },100)
  });
});

router.get('/getBookProgress', function(req, res){
  var ownerId_b = req.query.userId
  pool.getConnection(function (err, connection) {
    connection.query(StatSQL.getBookProgress,[ownerId_b,ownerId_b,ownerId_b,ownerId_b,ownerId_b], function (err,result) {
      if(err){
        console.log('getBookProgress失败',err.message);
      }
      str = JSON.stringify(result);
      console.log('getBookProgress', str);  //数据库查询结果返回到result中
    });
    setTimeout(function(){
　　   connection.release();
      res.send(str);
　　 },100)
  });
});

router.get('/getBookType', function(req, res){
  pool.getConnection(function (err, connection) {
    connection.query(StatSQL.getBookType, function (err,result) {
      if(err){
        console.log('失败',err.message);
      }
      str = JSON.stringify(result);
      console.log('getBookType',str);  //数据库查询结果返回到result中
    });
    setTimeout(function(){
      res.send(str);
　　   connection.release();
　　 },200)
  });
});

module.exports = router;
