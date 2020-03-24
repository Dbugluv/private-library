// var mysql = require('mysql');
//创建mysql实例
var settings = {
  connectionLimit : 50,
  queueWaitTimeout : 10000, // Same as acquireTimeout.
  pingCheckInterval : 10000, // The connection used in 10 seconds is reused without ping check.
  startConnections : 10, // 10 connections are created when the pool is started.
  minSpareConnections : 10, // 10 spare connections should be kept in the pool at all times.
  maxSpareConnections : 20, // No more than 20 spare connections.
  spareCheckInterval : 300000 // Check the spare connections every 5 minutes.
};

var mysql = {
  host: '127.0.0.1',
  user: 'root', //你的数据库账号
  password: 'dxy.5830830', //你的数据库密码
  database: 'plms',//你的数据库名
  port: '3306',
  connectionLimit: settings.connectionLimit,
  acquireTimeout: settings.queueWaitTimeout
}


module.exports = {
  mysql: mysql,
  // settings: settings
};
