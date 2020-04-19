var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbConfig = require('../db/DBConfig')
var url = require("url");

var pool = mysql.createPool( dbConfig.config );
var router = express.Router();


var BookSQL = {
  insert: 'INSERT INTO books(bookName, author, location, bookCover, ownedLibId, brief) VALUES(?,?,?,?,?,?)', // 插入数据
  drop: 'DROP TABLE books', // 删除表中所有的数据
  del: 'delete from books where bookId =',
  queryAll: 'SELECT * FROM books', // 查找表中所有数据
  getBookById: 'SELECT * FROM books WHERE bookId =', // 查找符合条件的数据
  getBookByName: 'SELECT * FROM books WHERE bookName = '
};

var str = '';

//获取所有数据
router.get('/queryALl', function(req, res){
  pool.getConnection(function (err, connection) {
    connection.query(BookSQL.queryAll, function (err,result) {
      if(err){
        console.log('失败',err.message);
      }
      str = JSON.stringify(result);
      console.log(str);  //数据库查询结果返回到result中
    });
    
    setTimeout(function(){
      res.send(str);
  　　   connection.release();
  　　 },200)
  });
});

router.get('/getByName/:bookName', function(req, res){
  var bookName = req.query.bookName;
  console.log('node-> ',req.params)
  pool.getConnection(function (err, connection) {
    connection.query(BookSQL.getBookByName + bookName, function (err,result) {
      if(err){
        console.log('失败',err.message);
      }
      str = JSON.stringify(result);
      console.log(str);  //数据库查询结果返回到result中
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
    connection.query(BookSQL.getBookById + id, function (err,result) {
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
  var bookName = params.bookName;
  var author = params.author;
  var location = params.location;
  var bookCover = params.bookCover;
  var ownedLibId = params.ownedLibId;
  var brief = params.brief;
  // var buyTime = params.buyTime;
  var sqlSuccess;
  console.log('book-params: ',params)
  var sqlArr = [bookName, author, location, bookCover, ownedLibId, brief];
  pool.getConnection(function (err, connection) {
    connection.query(BookSQL.insert, sqlArr, function (err,result) {
      if(err){
        console.log('添加失败',err.message);
        res.send('fail');
      }
      var str = JSON.stringify(result);
      console.log(result.affectedRows);  //数据库查询结果返回到result中
      sqlSuccess = result.affectedRows;
      // res.send('ssqlsuccess' + sqlSuccess);
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
    connection.query(`${BookSQL.del}${req.params.id}`, function (err,result) {
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
  var sqlSuccess;
  var sql = "update bookInfo set bookName = " + "dddddnew" + " where bookId = " + id;
  pool.getConnection(function (err, connection) { 
    connection.query(sql,function(err,result){
      if(err){
          res.send("修改失败 " + err);
      }else {
        str = JSON.stringify(result);
        sqlSuccess = result.affectedRows;
        res.send('ssqlsuccess' + sqlSuccess);
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
    connection.query("update bookInfo set bookName='" + name + "' where bookId=" + id, function (err, rows) {
      if (err) {
        res.end('修改失败：' + err);
      } else {
        res.redirect('/users');
      }
    });
  });
});

module.exports = router;
