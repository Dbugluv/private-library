var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbConfig = require('../db/DBConfig')
var url = require("url");

var pool = mysql.createPool( dbConfig.config );
var router = express.Router();


var StatSQL = {
  getBookCount: 
  'select count(*) as count from books UNION SELECT COUNT(*) FROM librarys UNION SELECT COUNT(*) FROM books GROUP BY ownedLibId',
  getBookType: 'SELECT COUNT(*) as count FROM books GROUP BY bookType ',
  getBookProgress:'SELECT COUNT(*) as count FROM books WHERE progress = 0 UNION SELECT COUNT(*) FROM books WHERE progress > 0 AND progress < 30 UNION SELECT COUNT(*) FROM books WHERE progress >= 30 AND progress < 60 UNION SELECT COUNT(*) FROM books WHERE progress >= 60 AND progress < 100 UNION SELECT COUNT(*) FROM books WHERE progress =100'
};

var str = '';

router.get('/getBookCount', function(req, res){
  pool.getConnection(function (err, connection) {
    connection.query(StatSQL.getBookCount, function (err,result) {
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
  pool.getConnection(function (err, connection) {
    connection.query(StatSQL.getBookProgress, function (err,result) {
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
