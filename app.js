'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const swig = require('swig');
require('./filters')(swig);
const bodyParser = require('body-parser');
const path = require('path');
const wikiRoute = require('./routes/wiki.js'); //plug in our router
const userRoute = require('./routes/users.js');


// logging middleware
app.use(morgan('dev'));

//point res.render to the proper directory
app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn of swig's caching
swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests
//setting the static route 
app.use(express.static(path.join(__dirname, '/public')));

app.use('/wiki',wikiRoute);
app.use('/users',userRoute);

app.listen(3000, function () {
    console.log('Server is listening on port 3000!');
});