var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbConfig = require('./db/DBConfig')
var pool = mysql.createPool( dbConfig.mysql );


var UserSQL = {
  insert: 'INSERT INTO userInfo(userNumber,password) VALUES(?,?)', // 插入数据
  drop: 'DROP TABLE userInfo', // 删除表中所有的数据
  queryAll: 'SELECT * FROM userInfo', // 查找表中所有数据
  getUserById: 'SELECT * FROM userInfo WHERE userId =?', // 查找符合条件的数据
};

var str = '';

pool.getConnection(function (err, connection) {
  connection.query(UserSQL.queryAll, function (err,result) {
    if(err){
      console.log('[SELECT ERROR]:',err.message);
    }
    str = JSON.stringify(result);
    console.log(str);  //数据库查询结果返回到result中
  });
  setTimeout(function(){
　　   connection.release();
　　 },200)
});

router.get('/',function(req,res){
  res.send(str);
})
module.exports = router;
