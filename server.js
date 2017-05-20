'use strict';

const express = require('express');
const app = express();
const nflpredictor = require('./app');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.set('view engine', 'ejs');

app.use(nflpredictor.session);

app.use('/', nflpredictor.router);

app.listen(app.get('port'), () => {
	console.log('NFL Predictor running on port: ', 3000);
});
