'use strict'
const express = require('express');
const router = express.Router();
const models = require('../models/');
const Page = models.Page; 
const User = models.User;

router.get('/', function(req,res,next) {
	//res.send('Hit home page');
	//res.redirect('/');
	Page.find().exec()
		.then(function(pages) {
			res.render('index',{
				pages: pages
			})
		})
		.catch(next);
});

router.get('/lookup', function(req,res,next) {
	res.render('lookup');
});

router.get('/search', function(req,res,next) {
	let searchTagsArray = req.query.tags.split(' ');
	Page.findByTag(searchTagsArray)
		.then(function(pages) {
			res.render('index', {
				pages: pages
			});
		})
		.catch(next);
})

router.get('/similar/:urlTitle', function(req,res,next) {
	let urlTitle = req.params.urlTitle;
	console.log('getting the right page urlTitle', urlTitle);
	Page.findOne({urlTitle: req.params.urlTitle}).exec()
		.then(function(foundPage) {
			return foundPage.findSimilar();
		})
		.then(function(foundPages) {
			if(foundPages.length ===0) res.send('No Similar Page found');
			else res.render('index', {pages: foundPages});
		})
		.catch(next);
})

router.post('/', function(req,res,next) {
	
	let {name, email, title, content, status, tags} = req.body;
	let arrayTag = tags.split(' ');
	let person = {name, email};
	console.log('author info', person);

	User.findOrCreate(person)
		.then(function(user) {
			let page = new Page({
				title,
				content,
				tags: arrayTag,
				author: user._id
			});
			return page.save();
			}).then(function(newPage) {
				console.log('newPage route', newPage.route);
				res.redirect(newPage.route);			
			}).catch(next);
});

router.get('/add', function(req,res,next) {
	res.render('addpage');
});

router.get('/:urlTitle',function(req,res,next) {
	Page.findOne({urlTitle: req.params.urlTitle}).exec()
		.then(function(foundPage) {
			res.render('wikipage', {
				title: foundPage.title,
				content: foundPage.content,
				tags: foundPage.tags,
				urlTitle: foundPage.urlTitle
			})
		}).catch(next);
})


module.exports = router;