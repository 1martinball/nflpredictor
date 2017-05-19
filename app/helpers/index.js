'use strict';

const router = require('express').Router();
const db = require('../db');
const http = require('http');


var gameState = {
	totalGames: 0,
	nextGame: 1,
	gameIndex: 0,
	week: 1,
	fixtures: null
};


let _registerRoutes = (routes, method) => {
	for (let key in routes) {
		if (typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
			_registerRoutes(routes[key], key);
		} else {
			if (method === 'get') {
				router.get(key, routes[key]);
			} else if (method === 'post') {
				router.post(key, routes[key]);
			} else {
				router.use(routes[key]);
			}
		}
	}
}

let route = routes => {
	_registerRoutes(routes);
	return router;
}


// The ES6 promisified version of findById
let findById = id => {
	return new Promise((resolve, reject) => {
		db.userModel.findById(id, (error, user) => {
			if (error) {
				reject(error);
			} else {
				resolve(user);
			}
		});
	});
}

let findByName = (name, type) => {
	console.log("INFO : Looking up " + type + " " + name + " by name");
	return new Promise((resolve, reject) => {
		if(type == 'game') {
			db.gameModel.findOne({name:name}, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});	
		} else if (type == 'player'){
			db.playerModel.findOne({name:name}, (error, result) => {
				if (error) {
					console.log("DBError - player lookup by name failed");
					reject(error);
				} else {
					console.log("Resolving " + result);
					resolve(result);
				}
			});
		} else {
			reject(error);
		}
		
	});
}

let isNameValid = (name, type) => {
	console.log("Validating " + type + " name - " + name);
	return new Promise((resolve, reject) => {
		findByName(name, type).then(result => {
			if(result != null){
				console.log("INFO : " + result.name + "  was found - validation failed - user will need to enter new " + type + " name");
				reject(false);
			} else {
				resolve(true);
			}
		}).catch(err => {
			console.log("ERROR : Error encountered whilst searching db for " + name);
			console.log(err.message);
			return false;
		});
	}); 
}

//let validatePlayerName = playerName => {
//	findByGameName(playerName).then(player => {
//		console.log("INFO : Player was found - validation failed - user will need to enter new player name");
//		return false;
//	}).catch(err => {
//		console.log("INFO : Player " + playerName + " was not found");		
//		return true;
//	}); 
//}

let createNewGame = request => {
	console.log("INFO : Attempting to create new game on DB");
	var playerName = request.query.playername == "" ? request.query.oldPlayer : request.query.playername;
	return new Promise((resolve, reject) => {
		let newGame = new db.gameModel({
			name: request.query.gamename,
			playerCount: '1',
			week: request.query.week,
			players : [playerName]
		});

		newGame.save(error => {
			if (error) {
				reject(new Error("ERROR : Error saving game to repository"));
			} else {
				resolve(newGame);
			}
		});
	});
}

let addPlayerToGame = request => {
	console.log("INFO : Attempting to add player " + request.query.playername + " to " + request.query.oldGame + " on DB");
	var playerName = request.query.playername == "" ? request.query.oldplayer : request.query.playername;
	console.log("DEBUG : Player name resolved to - " + playerName);
	var gameName = request.query.oldGame;
	return new Promise((resolve, reject) => {
		findByName(gameName, 'game').then(result => {
			var pCount = result.playerCount;
			pCount++;
			console.log("INFO : Game " + result.name + " found. Now updating with new player " + playerName);
			db.gameModel.findByIdAndUpdate(result._id,
				{
					"$set": {"playerCount": pCount},
					"$push": {"players": playerName}
				},
				{ "new": true, "upsert": false},
				function(err, data) {
				if(err){
					console.log("ERROR: Error returned trying to add player to existing game - " + result.name);
					reject(err);
				} else {
					console.log("INFO : Player " + playerName + " was added successfully to " + data.name);
					resolve(playerName);
				}
			}).catch(err => {
				console.log("ERROR : Error encountered whilst searching db for " + gameName);
				console.log(err.message);
				reject(err);
			});
		}).catch(err => {
			console.log("ERROR : Error encountered whilst searching db for " + gameName);
			console.log(err.message);
			reject(err);
		});
	});
}

let createNewPlayer = playername => {
	console.log("INFO : Attempting to create new player " + playername + " on DB");
	return new Promise((resolve, reject) => {
		let newPlayer = new db.playerModel({
			name: playername,
			predictions: []
		});

		newPlayer.save(error => {
			if (error) {
				reject(new Error("ERROR : Error saving player to repository"));
			} else {
				console.log("INFO : " + newPlayer.name + " saved successfully");
				resolve(newPlayer);
			}
		});
	});
}

let getPlayers = () => {
	return new Promise((resolve, reject) => {
		db.playerModel.find({}, (error, players) => {
			if (error) {
				reject(error);
			} else {
				console.log("INFO : About to resolve existing players");
				console.log("INFO : Players response :" + JSON.stringify(players));
				resolve(players.map((player) => {
					return player.name;
				}));
			}
		});
	});
}

let getGames = () => {
	return new Promise((resolve, reject) => {
		db.gameModel.find({}, (error, games) => {
			if (error) {
				reject(error);
			} else {
				console.log("INFO : About to resolve existing games");
				console.log("INFO : Games response :" + JSON.stringify(games));
				resolve(games.map((game) => {
					return game.name;
				}));
			}
		});
	});
}

let getFixtures = week => {
	var body = '';
	gameState.nextGame = 1;
	gameState.week = week;
	console.log("INFO : About to retrieve fixture data for selected week : " + week);

	return new Promise((resolve, reject) => {
		var url = "http://api.suredbits.com/nfl/v0/games";
		if(week == "Current week") {
			url = "http://api.suredbits.com/nfl/v0/games";
		} else {
			url = "http://api.suredbits.com/nfl/v0/games/2016/" + week;
		}
		console.log("INFO : Retrieving fixtures from : " + url);
		http.get(url, (res) => {
			res.on('data', function (chunk) {
				body += chunk;
			});

			res.on('end', function () {
				var fixtureResponse = JSON.parse(body);
				console.log("INFO : There were " + fixtureResponse.length + " games returned in response for week " + gameState.week);
				gameState.fixtures = fixtureResponse;
				gameState.totalGames = fixtureResponse.length;
				console.log("INFO : calling helper function getNextGame() to return first fixture")
				resolve(getNextGame()); 
			}).on('error', (e) => {
				console.log(`ERROR : Error whilst retrieving fixture data : ${e.message}`);
				reject(e);
			});
		});
	});
}

let getNextGame = () => {
	var nextGame = {
		homeTeam : null,
		awayTeam : null,
		week: gameState.week,
		game: '1'
	};
	
	console.log("INFO : About to retrieve the next game from gameState fixture model, game number of the next game is " + gameState.nextGame);
	console.log("INFO : Retrieving game from index " + gameState.gameIndex);
	nextGame.homeTeam = gameState.fixtures[gameState.gameIndex].homeTeam.team;
	nextGame.awayTeam = gameState.fixtures[gameState.gameIndex].awayTeam.team;
	nextGame.game = gameState.nextGame;
	console.log("Next game to be returned to router : " + JSON.stringify(nextGame));
	incrementGame();
	return nextGame;
}

function incrementGame(){
	console.log("INFO : Incrementing game state");
	gameState.nextGame++;
	gameState.gameIndex++;
}


module.exports = {
	route,
	findById,
	findByName,
	getFixtures,
	getNextGame,
	createNewGame,
	createNewPlayer,
	isNameValid,
	getPlayers,
	getGames,
	addPlayerToGame
}
