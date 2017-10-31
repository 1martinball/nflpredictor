'use strict';

const router = require('express').Router();
const db = require('../db');
const http = require('http');


let _registerRoutes = (routes, method) => {
	for (let key in routes) {
		if (typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
			_registerRoutes(routes[key], key);
		}
		else {
			if (method === 'get') {
				router.get(key, routes[key]);
			}
			else if (method === 'post') {
				router.post(key, routes[key]);
			}
			else {
				router.use(routes[key]);
			}
		}
	}
}

let route = routes => {
	_registerRoutes(routes);
	return router;
}

let findById = id => {
	return new Promise((resolve, reject) => {
		db.userModel.findById(id, (error, user) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(user);
			}
		});
	});
}

let findByName = (name, type) => {
	console.log("INFO : Looking up " + type + " " + name + " by name");
	return new Promise((resolve, reject) => {
		if (type == 'game') {
			db.gameModel.findOne({
				name: name
			}, (error, result) => {
				if (error) {
					reject(error);
				}
				else {
					resolve(result);
				}
			});
		}
		else if (type == 'player') {
			db.playerModel.findOne({
				name: name
			}, (error, result) => {
				if (error) {
					console.log("DBError - player lookup by name failed");
					reject(error);
				}
				else {
					console.log("Resolving " + result);
					resolve(result);
				}
			});
		}
		else {
			reject(error);
		}
	});
}

let deleteRecord = (name, type) => {
	return new Promise((resolve, reject) => {
		if (type == 'game') {
			db.gameModel.findOneAndDelete({
				name: name
			}, (error, result) => {
				if (error) {
					console.log("DBError - game lookup by name failed");
					reject(error);
				}
				else {
					resolve(result);
				}
			});
		}
		else if (type == 'player') {
			db.playerModel.findOneAndDelete({
				name: name
			}, (error, result) => {
				if (error) {
					console.log("DBError - player lookup by name failed");
					reject(error);
				}
				else {
					console.log("Resolving " + result);
					resolve(result);
				}
			});
		}
		else {
			reject(error);
		}
	});
}

let isNameValid = (name, type) => {
	console.log("INFO : Validating " + type + " name - " + name);
	return new Promise((resolve, reject) => {
		findByName(name, type).then(result => {
			if (result != null) {
				console.log("INFO : " + result.name + "  was found - validation failed - user will need to enter new " + type + " name");
				reject(result.name);
			}
			else {
				resolve(true);
			}
		}).catch(err => {
			console.log("ERROR : Error encountered whilst searching db for " + name + " : " + err);
			reject(err);
		});
	});
}

let createNewGame = request => {
	console.log("DEBUG : Helpers index.js : Request query passed in - " + JSON.stringify(request.query));
	console.log("INFO : Attempting to create new game on DB");
	var playerName = request.query.playername == "" ? request.query.oldplayer : request.query.playername;
	console.log("DEBUG : Player name resolved to - " + playerName);
	return new Promise((resolve, reject) => {
		let newGame = new db.gameModel({
			name: request.query.gamename,
			admin: playerName,
			status: 'closed',
			playerCount: '0',
			week: request.query.week,
			season: request.query.season,
			players: []
		});

		newGame.save(error => {
			if (error) {
				reject(new Error("ERROR : Error saving game to repository"));
			}
			else {
				resolve(newGame);
			}
		});
	});
}

let addPlayerAndPredictionToGame = request => {
	console.log("INFO : Attempting to add player " + request.body.player + " to " + request.body.game + " on DB");
	var gameName = request.body.game;
	var playerName = request.body.player;
	var playerPrediction = request.body.playerPrediction;
	return new Promise((resolve, reject) => {
		findByName(gameName, 'game').then(result => {
			var pCount = result.playerCount;
			var playerArray = result.players;
			pCount++;

			console.log("INFO : Game " + result.name + " found. Now updating with new player " + playerName);
			db.gameModel.findByIdAndUpdate(result._id, {
					"$set": {
						"playerCount": pCount
					},
					"$set": {
						"status": "open"
					},
					"$push": {
						"players": {
							name: playerName,
							prediction: playerPrediction
						}
					}
				}, {
					"new": true,
					"upsert": false
				},
				function(err, data) {
					if (err) {
						console.log("ERROR: Error returned trying to add player to existing game - " + result.name);
						reject(err);
					}
					else {
						console.log("INFO : Player " + playerName + " was added successfully to " + data.name);
						resolve(playerName);
					}
				}
			)
		}).catch(err => {
			console.log("ERROR : Error encountered whilst searching db for " + gameName);
			reject(err);
		});
	});
}

let removePlayerFromGame = (playerName, gameName) => {
	console.log("INFO : Attempting to remove player " + request.query.playername + " from " + request.query.game + " on DB");
	return new Promise((resolve, reject) => {
		findByName(gameName, 'game').then(result => {
			var pCount = result.playerCount;
			var playerArray = result.players;
			if (playerArray.indexOf((player => {
					player.name === playerName
				})) === -1) {
				console.log("ERROR : Player " + playerName + " not found in game " + gameName);
				reject(new Error("Player " + playerName + " not found in game " + gameName));
			}
			else if (pCount < 2) {
				//only one player in game so far, we are removing player, so must remove game too
				deleteRecord(gameName, 'game').then(result => {
					resolve(gameName);
				}).catch(err => {
					console.log("ERROR : Error encountered whilst removing game record " + gameName);
					reject(err);
				});
			}
			else {
				console.log("INFO : Game " + result.name + " found. Now removing player " + playerName);
				db.gameModel.findByIdAndUpdate(result._id, {
						"$set": {
							"playerCount": --pCount
						},
						"$pull": {
							"players": {
								name: playerName
							}
						}
					}, {
						"multi": false
					},
					function(err, data) {
						if (err) {
							console.log("ERROR: Error returned trying to remove player from existing game - " + result.name);
							reject(err);
						}
						else {
							console.log("INFO : Player " + playerName + " was removed successfully from " + data.name);
							resolve(playerName);
						}
					})
			}
		}).catch(err => {
			console.log("ERROR : Error encountered whilst searching db for " + gameName);
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
			}
			else {
				console.log("INFO : " + newPlayer.name + " saved successfully");
				resolve(newPlayer);
			}
		});
	});
}

let getInfo = () => {
	var body = '';
	return new Promise((resolve, reject) => {
		var url = "http://api.suredbits.com/nfl/v0/info/";
		console.log("INFO : Retrieving game info from : " + url);
		//		var options = {
		//			host: "internet-proxy-bov.group.net",
		//			port: 81,
		//			path: url
		//		}

		http.get(url, (res) => {
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {
				var response = JSON.parse(body);
				console.log("DEBUG : Info data returned - " + response);
				resolve(response);
			}).on('error', (e) => {
				console.log(`ERROR : Error whilst retrieving nfl info data : ${e.message}`);
				reject(e);
			});
		});
	});
}

let closeGames = week => {
	return new Promise((resolve, reject) => {
		db.gameModel.update({
				week: {
					$lt: week
				},
				'status': 'open'
			}, {
				"$set": {
					"status": "closed"
				}
			}, {
				"multi": true
			},
			function(err, data) {
				if (err) {
					console.log("ERROR: Error returned during game maintenance");
					reject(err);
				}
				else {
					console.log("INFO : Status changed on " + data + "games");
					resolve(data);
				}
			}
		)
	});
}

let getPlayers = () => {
	return new Promise((resolve, reject) => {
		db.playerModel.find({}, (error, players) => {
			if (error) {
				reject(error);
			}
			else {
				console.log("INFO : About to resolve existing players");
				console.log("INFO : Players response :" + JSON.stringify(players));
				resolve(players.map((player) => {
					return player.name;
				}));
			}
		});
	});
}

let getGames = (playername, inGame) => {
	var query = "";
	if (inGame === "true") {
		query = db.gameModel.where('players.name', {
			"$eq": playername
		});
	}
	else {
		query = db.gameModel.where({
			status: 'open',
			'players.name': {
				$ne: playername
			}
		});
	}
	return new Promise((resolve, reject) => {
		db.gameModel.find(query, (error, games) => {
			if (error) {
				reject(error);
			}
			else {
				console.log("INFO : About to resolve existing games");
				console.log("INFO : Games response :" + JSON.stringify(games));
				var requiredData = games.map((game) => {
					if (inGame === "false") {
						return {
							name: game.name,
							week: game.week,
							season: game.season
						};
					}
					else {
						return {
							name: game.name,
							week: game.week,
							season: game.season,
							players: game.players
						};
					}
				});
				console.log("DEBUG : Mapped data to resolve to router - " + JSON.stringify(requiredData));
				resolve(requiredData);
			}
		});
	});
}

let getAllFixtures = (week, season) => {
	var body = '';
	return new Promise((resolve, reject) => {
		console.log("INFO : About to retrieve fixture data for season - " + season + " and week - " + week);
		var url = "http://api.suredbits.com/nfl/v0/games/" + season + "/" + week;

		console.log("INFO : Retrieving fixtures from : " + url);
		//		var options = {
		//			host: "internet-proxy-bov.group.net",
		//			port: 81,
		//			path: url
		//		}

		http.get(url, (res) => {
			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				var fixtureResponse = JSON.parse(body);
				console.log("DEBUG : Fixture data returned - " + fixtureResponse);
				console.log("INFO : There were " + fixtureResponse.length + " games returned in response");
				var fixtures = {
					fixtures: fixtureResponse,
					totalFixtures: fixtureResponse.length
				}
				resolve(fixtures);
			}).on('error', (e) => {
				console.log(`ERROR : Error whilst retrieving fixture data : ${e.message}`);
				reject(e);
			});
		});
	});
}

module.exports = {
	route,
	findById,
	findByName,
	createNewGame,
	createNewPlayer,
	isNameValid,
	getPlayers,
	getGames,
	addPlayerAndPredictionToGame,
	getInfo,
	getAllFixtures,
	removePlayerFromGame,
	deleteRecord,
	closeGames
}
