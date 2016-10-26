'use strict'
const express = require('express');
const router = express.Router();
const models = require('../models/');
const Page = models.Page; 
const User = models.User;

router.get('/', function(req,res,next) {
	//res.send('Hit home page');
	//res.redirect('/');
	res.redirect('/');
});

router.post('/', function(req,res,next) {
	let {name, email, title, content, status} = req.body;

	console.log('what is page', Page)

	let page = new Page({
		title,
		content
	});
	page.save().then(function(newPage) {
		console.log('newPage route', newPage.route);
		res.redirect(newPage.route);
	}).then(null,next);
});

router.get('/add', function(req,res,next) {
	res.render('addpage');
});

router.get('/:urlTitle',function(req,res,next) {
	Page.findOne({urlTitle: req.params.urlTitle}).exec()
		.then(function(foundPage) {
			res.render('wikipage', {
				title: foundPage.title,
				content: foundPage.content
			})
		}).catch(next);
})


module.exports = router;