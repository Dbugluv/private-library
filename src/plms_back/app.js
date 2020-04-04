var express = require('express');
var app = express();
var userInfoRouter = require('./userInfo');
var proxyTable = require('../../config/proxy');
var proxy = require('http-proxy-middleware');

// Object.keys(proxyTable).forEach(function(context) {
//   var options = proxyTable[context]
//   if (typeof options === 'string') {
//     options = {
//       target: options
//     }
//   }
//   app.use(proxy(options.filter || context, options));
// })

// app端设置跨域访问
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type'); 
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  res.header('Access-Control-Allow-Credentials', 'true'); //一定要设置这一句
  next();
});

app.use('/user',userInfoRouter);

app.listen(3000,function(){   //监听3000端口
  console.log("Server running at 3000 port");
});

