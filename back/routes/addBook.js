var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbConfig = require('../db/DBConfig')
var url = require("url");

var pool = mysql.createPool( dbConfig.config );
var router = express.Router();


var BookSQL = {
  insert: 'INSERT INTO books(bookName, author, location, bookCover, ownedLibId, brief, buyTime, bookType, progress, ownerId_b) VALUES(?,?,?,?,?,?,?,?,?,?)', // 插入数据
  drop: 'DROP TABLE books', // 删除表中所有的数据
  del: 'DELETE FROM books WHERE bookId = ?',
  queryAll: 'SELECT * FROM books', // 查找表中所有数据
  queryByUserId: 'SELECT * FROM books WHERE ownerId_b = ?', // 查找表中所有数据
  getBookById: 'SELECT * FROM books WHERE bookId = ?', // 查找符合条件的数据
  getBookByName: 'SELECT * FROM books WHERE bookName like ?',
  updateBrief: 'UPDATE books SET brief = ? WHERE bookId=?',
  updateExcerpt: 'UPDATE books SET excerpt = ? WHERE bookId=?',
  editBook: 'UPDATE books SET bookName = ? , author = ? ,location = ?, brief = ?, progress =? WHERE bookId=?',
  selectByCategory: 'SELECT * FROM books WHERE bookType = ? AND ownedLibId = ?',
  selectByLibs: 'SELECT * FROM books WHERE ownedLibId = ?'
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
      // console.log(str);  //数据库查询结果返回到result中
    });
    
    setTimeout(function(){
      res.send(str);
  　　   connection.release();
  　　 },200)
  });
});

// 按照图书种类以及所处图书集
router.get('/selectByCategory', function(req, res){
  var bookType = req.query.bookType;
  var ownedLibId = req.query.ownedLibId;
  console.log('selectByCategory->params ',req.query)
  pool.getConnection(function (err, connection) {
    connection.query(BookSQL.selectByCategory, [bookType, ownedLibId] , function (err,result) {
      if(err){
        console.log('根据图书类别查询失败',err.message);
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

// 按照所处图书集查询
router.get('/selectByLibs', function(req, res){
  var ownedLibId = req.query.ownedLibId;
  console.log('selectByCategory->params ',req.query)
  pool.getConnection(function (err, connection) {
    connection.query(BookSQL.selectByLibs, [ownedLibId] , function (err,result) {
      if(err){
        console.log('根据图书集查询失败',err.message);
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

router.get('/queryByUserId', function(req, res){
  var ownerId_b = req.query.ownerId_b;
  console.log('params:',ownerId_b)
  pool.getConnection(function (err, connection) {
    connection.query(BookSQL.queryByUserId,[ownerId_b], function (err,result) {
      if(err){
        console.log('失败',err.message);
      } else {
        setTimeout(function(){
          res.send(str);
    　　   connection.release();
    　　 },200)
      }
      str = JSON.stringify(result);
      console.log(str);  //数据库查询结果返回到result中
    });
  });
});

//搜索书籍
router.get('/getByName', function(req, res){
  var bookName = '%'+req.query.bookName + '%';
  console.log('getByName-> ',bookName)
  pool.getConnection(function (err, connection) {
    connection.query(BookSQL.getBookByName,[bookName], function (err,result) {
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
  var author = params.author || null;
  var location = params.location || null;
  var bookType = params.bookType || null;
  // var isLoan = params.isLoan;
  var bookCover = params.bookCover || null;
  var ownedLibId = params.ownedLibId;
  var brief = params.brief || null;
  var buyTime = params.buyTime || null;
  var progress = params.progress || null;
  var ownerId_b = params.userId;

  var sqlSuccess;
  console.log('book-params: ',params)
  var sqlArr = [bookName, author, location, bookCover, ownedLibId, brief, buyTime, bookType, progress, ownerId_b];
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
    if(!err){
      setTimeout(function(){
        res.status(200).send('success');
  　　   connection.release();
  　　 },200)
    }
  });
});

//删除某本书信息
router.get('/del', function(req, res){
  //数据库连接、数据操作
  console.log('id',req.query.bookId)
  pool.getConnection(function (err, connection) {
    connection.query(BookSQL.del,req.query.bookId, function (err,result) {
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
router.get("/updateBrief",function(req,res,next){
  var brief = req.query.brief;
  var id = req.query.bookId; // 需要修改的地方
  console.log('brief',brief,'id',id);
  pool.getConnection(function (err, connection) { 
    connection.query(BookSQL.updateBrief,[brief,id],function(err,result){
      if(err){
          res.send("修改失败 " + err);
      }else {
        str = JSON.stringify(result);
        // res.send(str);
      }
      setTimeout(function(){
        res.status(200).send('success');
  　　   connection.release();
  　　 },200);
    });
  })
});

router.get("/updateExcerpt",function(req,res,next){
  var excerpt = req.query.excerpt;
  var id = req.query.bookId; // 需要修改的地方
  console.log('excerpt',excerpt,'id',id);
  pool.getConnection(function (err, connection) { 
    connection.query(BookSQL.updateExcerpt,[excerpt,id],function(err,result){
      if(err){
          res.send("修改失败 " + err);
      }else {
        str = JSON.stringify(result);
        // res.send(str);
      }
      setTimeout(function(){
        res.status(200).send('success');
  　　   connection.release();
  　　 },200);
    });
  })
});

router.get("/updateBook",function(req,res,next){
  var params = req.query;
  console.log('update-paras:'+params)
  var bookId = req.query.bookId; // 需要修改的地方
  var bookName = params.bookName;
  var author = params.author || null;
  var location = params.location || null;
  // var bookType = params.bookType || null;
  // var isLoan = params.isLoan;
  // var bookCover = params.bookCover || null;
  // var ownedLibId = params.ownedLibId;
  var brief = params.brief || null;
  // var buyTime = params.buyTime || null;
  var progress = params.progress || null;
  // var loaner = params.loaner;
  console.log('eidebook:',params)
  var sqlArr = [bookName, author, location, brief, progress, bookId]
  pool.getConnection(function (err, connection) { 
    connection.query(BookSQL.editBook,sqlArr ,function(err,result){
      if(err){
          res.send("编辑失败 " + err);
      }else {
        str = JSON.stringify(result);
        // res.send(str);
      }
      setTimeout(function(){
        res.status(200).send('success');
  　　   connection.release();
  　　 },200);
    });
  })
});

// router.post('/update', function (req, res) {
//   console.log('req.body: ',req.body)
//   var id = req.body.id;
//   var name = req.body.name;
//   pool.getConnection(function (err, connection) { 
//     connection.query("update bookInfo set bookName='" + name + "' where bookId=" + id, function (err, rows) {
//       if (err) {
//         res.end('修改失败：' + err);
//       } else {
//         res.redirect('/users');
//       }
//     });
//   });
// });

module.exports = router;
