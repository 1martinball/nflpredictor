'use strict';
const h = require('../helpers');
const passport = require('passport');


module.exports = () => {

	let routes = {
		'get': {
			'/': (req, res, next) => {
				console.log("INFO : Routing to - Welcome page at GET/");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				console.log("INFO : Rendering page : welcome.ejs");
				res.render('welcome', {
					page: "Welcome",
					error: false,
					errorMessage: ""
				});
			},
			'/getInfo': (req, res, next) => {
				console.log("INFO : Routing to : Nfl current info retrieval with request GET/getInfo");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				console.log("INFO : Calling helper function getInfo()");
				h.getInfo().then(info => {
					console.log("INFO : Helper function getInfo() returned to router with : " + JSON.stringify(info));
					console.log("INFO : Sending info data");
					res.send(info);
				}).catch(err => {
					console.log("ERROR : Error while attempting to retrieve nfl current info");
					console.log(err);
				});
			},
			'/redzone': (req, res, next) => {
				console.log("INFO : Routing to - Predictor at GET/redzone");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				console.log("INFO : Rendering page : predictor.ejs");
				console.log("INFO : Checking DB for game names")
				h.isNameValid(req.query.gamename, 'game').then(valid => {
					if (valid) {
						console.log("INFO : Game validation successful - Saving new game and player data");
						h.createNewGame(req).then(game => {
							console.log("DEBUG : About to render Predictor page with data : " + JSON.stringify(game));
							res.render('predictor', {
								page: "NFL Predictor | Redzone",
								error: false,
								errorMessage: "",
								player: game.admin,
								game: game.name,
							});
						}).catch(err => {
							console.log("ERROR : error returned when creating new game : " + err);
							res.render('welcome', {
								page: "Welcome",
								error: true,
								errorMessage: "An error returned when creating new game. Please try again"
							});
						});
					}
				}).catch(err => {
					if (err instanceof Error) {
						console.log("ERROR : error returned when checking if game is valid : " + err);
						res.render('welcome', {
							page: "Welcome",
							error: true,
							errorMessage: "An error occurred during game creation. Please try again"
						});
					}
					else {
						console.log("INFO : Game " + err + " already exists on the DB");
						res.render('welcome', {
							page: "Welcome",
							error: true,
							errorMessage: "Game " + err + " already exists. Please try again with a different game name"
						});
					}

				});
			},
			'/redzoneExistingGame': (req, res, next) => {

				console.log("INFO : Routing to - Predictor at GET/redzoneExistingGame");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				var player = req.query.playername == "" ? req.query.oldplayer : req.query.playername;
				console.log("DEBUG : Player name resolved to - " + player);
				console.log("INFO : Rendering page : predictor.ejs");
				console.log("INFO : Existing game validation not required");
				// h.addPlayerToGame(req).then(player => {
				// console.log("INFO : Router - index.js : Player " + player + " added successfully to game " + req.query.oldGame);
				res.render('predictor', {
					page: "NFL Predictor | Redzone",
					season: req.query.season,
					player: player,
					game: req.query.oldGame,
					error: false,
					errorMessage: "",
					week: req.query.week,
					newGame: false,
					fixtures: false,
					awayTeam: null,
					homeTeam: null
				});
				// }).catch( err => {
				// 	console.log("ERROR : Error returned when adding player to game - " + err);
				// 	res.render('welcome', {
				// 		page: "Welcome",
				// 		error: true,
				// 		errorMessage : err.message
				// 	});
				// });
			},
			'/getPlayers': (req, res, next) => {
				console.log("INFO : Routing to : Player look up with request GET/getPlayers");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				console.log("INFO : Calling helper function getPlayers()");
				h.getPlayers().then(players => {
					console.log("INFO : Helper function getPlayers() returned to router with : " + players);
					console.log("INFO : Sending players data");
					res.send(players);
				}).catch(err => {
					console.log("ERROR : Error while attempting to retrieve existing players");
					console.log(err);
				});
			},
			'/getGames': (req, res, next) => {
				console.log("INFO : Routing to : Game look up with request GET/getGames");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				console.log("INFO : Calling helper function getGames()");
				h.getGames(req.query.playername, req.query.inGame).then(games => {
					console.log("INFO : Helper function getGames() returned to router with : " + JSON.stringify(games));
					console.log("INFO : Sending games data");
					res.send(games);
				}).catch(err => {
					console.log("ERROR : Error while attempting to retrieve existing games");
					console.log(err);
				});
			},
			'/viewGame': (req, res, next) => {
				console.log("INFO : Routing to : View game data and results with request /viewGame");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				res.render('viewGame', {
					page: "Game And Result Viewer",
					player: req.query.player
				});
			},
			'/getAllFixtures': (req, res, next) => {
				console.log("INFO : Routing to : Fixture look up with request GET/getAllFixtures");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				console.log("INFO : Calling helper function getAllFixtures()");
				h.getAllFixtures(req.query.week, req.query.season).then(fixtures => {
					console.log("INFO : Helper function getAllFixtures() returned to router with : " + JSON.stringify(fixtures));
					console.log("INFO : Sending all fixture data");
					res.send({
						totalFixtures: fixtures.totalFixtures,
						error: false,
						fixtures: fixtures.fixtures
					});
				}).catch(err => {
					console.log("ERROR : Error while attempting to retrieve fixtures");
					console.log(err);
				})
			},
			'/predictionSummary': (req, res, next) => {
				console.log("INFO : routerjs POST/predictionSummary : Routed to - POST/predictionSummary");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				res.render('predictionSummary', {
					page: "Prediction Summary",
					prediction: req.query.playerPrediction,
					player: req.query.player,
					game: req.query.game,
				});
			}
		},
		'post': {
			'/addPlayer': (req, res, next) => {
				console.log("INFO : Routing to - post/addPlayer");
				console.log("INFO : POST request with parameters : " + (req.body.playername));
				console.log("INFO : About to check player name " + req.body.playername + " is available");
				h.isNameValid(req.body.playername, 'player').then(valid => {
					if (valid) {
						console.log("INFO : Player validation successful - Saving new player data");
						h.createNewPlayer(req.body.playername).then(player => {
							res.send(player.name);
						}).catch(err => {
							console.log("ERROR : error returned when creating new player");
							res.render('welcome', {
								page: "Welcome",
								error: true,
								errorMessage: "An error occurred creating new player. Please try again"
							});
						});
					}
				}).catch(name => {
					console.log("INFO : Problem found when checking if " + name + " is valid");
					res.send("That player already exists. Please try again");
				});
			},
			'/savePrediction': (req, res, next) => {
				console.log("INFO : routerjs POST/savePrediction : Routed to - POST/savePrediction");
				console.log("INFO : routerjs POST/savePrediction : POST request with parameters : " + JSON.stringify(req.body));
				console.log("INFO : routerjs POST/savePrediction : About to update the prediction with - " + req.body.playerPrediction);
				h.addPlayerAndPredictionToGame(req).then(player => {
					console.log("INFO : routerjs POST/savePrediction : Successfully updated player prediction");
					res.render('welcome', {
						page: "Welcome",
						error: false,
						errorMessage: ""
					});
				}).catch(err => {
					console.log("ERROR : routerjs POST/savePrediction : " + err);
					res.render('welcome', {
						page: "Welcome",
						error: true,
						errorMessage: "There was an error updating your prediction. Please retry - game has been reset"
					});
				});
			},
			'/closeGames': (req, res, next) => {
				console.log("INFO : routerjs POST/closeGames : Routed to - POST/closeGames");
				console.log("INFO : routerjs POST/closeGames : About to carry out maintenance to change game status to closed for past or in progress games");
				h.closeGames(req.body.currentWeek).then(gamesClosed => {
					res.send(gamesClosed);
				}).catch(err => {
					console.log(err);
					console.log("An error occurred whilst carrying out game maintenance");
				});
			}
		},
		'NA': (req, res, next) => {
			res.status(404).sendFile(process.cwd() + '/views/404.htm');
		}
	}

	return h.route(routes);

}
