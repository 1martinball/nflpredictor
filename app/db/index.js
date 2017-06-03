'use strict';

const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);

Mongoose.connection.on('error', error => {
	console.log('Momgodb connection error: ', error);
});

//Create a schema that defines the structure for storing user data
const nflGame = new Mongoose.Schema({
	name: String,
	admin: String,
	status: String,
	playerCount: Number,
	season: String,
	week: String,
	players: [{name: String, prediction: String}]
});

const player = new Mongoose.Schema({
	name: String,
	predictions: [Mongoose.Schema.Types.ObjectId]
});

let gameModel = Mongoose.model('nflGame', nflGame);
let playerModel = Mongoose.model('player', player);

module.exports = {
	Mongoose,
	gameModel,
	playerModel
}

