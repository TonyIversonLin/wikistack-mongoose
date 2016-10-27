'use strict'
const express = require('express');
const router = express.Router();
const models = require('../models/');
const Page = models.Page; 
const User = models.User;

router.get('/', function(req, res, next) {
	User.find().exec()
		.then(function (users) {
			res.render('users', {
				users: users
			})
		})
		.catch(next);
})

router.get('/:id', function(req, res, next) {
	let userPromise = User.findById(req.params.id).exec();
  let pagesPromise = Page.find({ author: req.params.id }).exec();
  Promise.all([userPromise, pagesPromise])
  	.then(function(result) {
  		res.render('user',{user: result[0], pages: result[1]})
  	})
  	.catch(next)
})











module.exports = router;