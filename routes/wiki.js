'use strict'
var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	//res.send('Hit home page');
	//res.redirect('/');
	var pages = Page.findAll();
	pages.then(function(result){
		console.log(result);
		res.render('index',{
			pages: result
		});
	});
});

module.exports = router;