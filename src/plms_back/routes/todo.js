var express = require('express');
var router = express.Router();
 
/* GET todo listing. */
router.get('/', function(req, res, next) {
  res.send({
    code: 1,
    msg: '成功',
    data: [{
      id: 0,
      name: 'Learning node.js on Monday'
	  },
	  {
		id: 1,
		name: 'Learning react.js on Tuesday'
	  },
	  {
		id: 2,
		name: 'Learning vue.js on Wednesday'
	  },
	  {
		id: 3,
		name: 'Learning angular.js on Thursday'
	  },
	  {
		id: 4,
		name: 'Learning express on Friday'
	  },
	  {
		id: 5,
		name: 'Learning koa on Saturday'
	  },
	  {
		id: 6,
		name: 'Learning react-native on Sunday'
	  }
    ]
  });  
});
 
module.exports = router;
 