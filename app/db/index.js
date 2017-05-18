'use strict';

const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);

Mongoose.connection.on('error', error => {
	console.log('Momgodb connection error: ', error);
});

//Create a schema that defines the structure for storing user data
const nflGame = new Mongoose.Schema({
	name: String,
	playerCount: Number,
	week: Number,
	players: [Mongoose.Schema.Types.ObjectId]
});

const player = new Mongoose.Schema({
	name: String,
	predictions: [Mongoose.Schema.Types.ObjectId]
});

const nflPrediction = new Mongoose.Schema({
	gamename: String,
	games: Number,
	week: Number,
	prediction: String
});


let gameModel = Mongoose.model('nflGame', nflGame);
let playerModel = Mongoose.model('player', player);
let predictionModel = Mongoose.model('nflPrediction', nflPrediction);

module.exports = {
	Mongoose,
	gameModel,
	playerModel,
	predictionModel
}

