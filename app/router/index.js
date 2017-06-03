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
				h.resetGame();
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
					if(valid) {
						console.log("INFO : Game validation successful - Saving new game and player data");
						h.createNewGame(req).then(game => {
							console.log("DEBUG : About to render Predictor page with data : " + JSON.stringify(game));
							res.render('predictor', {
								page: "NFL Predictor | Redzone",
								season: req.query.season,
								error: false,
								errorMessage: "",
								week: game.week,
								player: game.players[0].name,
								game: game.name,
								newGame: true,
								fixtures: false,
								awayTeam: null,
								homeTeam: null
							});
						}).catch( err => {
							console.log("ERROR : error returned when creating new game : " + err );
							res.render('welcome', {
								page: "Welcome",
								error: true,
								errorMessage : "An error returned when creating new game. Please try again"
							});
						});
					}
				}).catch(err => {
					if(err instanceof Error){
						console.log("ERROR : error returned when checking if game is valid : " + err);
						res.render('welcome', {
							page: "Welcome",
							error: true,
							errorMessage : "An error occurred during game creation. Please try again"
						});
					} else {
						console.log("INFO : Game " + err + " already exists on the DB");
						res.render('welcome', {
							page: "Welcome",
							error: true,
							errorMessage : "Game " + err + " already exists. Please try again with a different game name"
						});
					}

				});
			},
			'/redzoneExistingGame': (req, res, next) => {
				console.log("INFO : Routing to - Predictor at GET/redzoneExistingGame");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				console.log("INFO : Rendering page : predictor.ejs");
				console.log("INFO : Existing game validation not required - Need to update game with player data");
				h.addPlayerToGame(req).then(player => {
					console.log("INFO : Router - index.js : Player " + player + " added successfully to game " + req.query.oldGame);
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
				}).catch( err => {
					console.log("ERROR : Error returned when adding player to game - " + err);
					res.render('welcome', {
						page: "Welcome",
						error: true,
						errorMessage : err.message
					});
				});
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
			'/getFixtures': (req, res, next) => {
				console.log("INFO : Routing to : Fixture look up with request GET/getFixtures");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				console.log("INFO : Calling helper function getFixtures()");
				h.setGameWeekAndSeason(req.query.week, req.query.season);
				h.getFixtures(req.query.week, req.query.season).then(teams => {
					console.log("INFO : Helper function getFixtures() returned to router with : " + JSON.stringify(teams));
					console.log("INFO : Sending fixture data");
					res.send({
						homeTeam: teams.homeTeam,
						awayTeam: teams.awayTeam,
						season: '2016',
						week: teams.week,
						game: teams.game,
						totalFixtures: teams.totalFixtures,
						error: false,
						fixtures: true
					});	
				}).catch(err => {
					console.log("ERROR : Error while attempting to retrieve fixtures");
					console.log(err);
				})
			},
			'/getNextGame': (req, res, next) => {
				console.log("INFO : Routing to : Next game look up with request GET/getNextGame");
				console.log("INFO : GET request with parameters : " + JSON.stringify(req.query));
				console.log("INFO : Calling helper function getNextGame()");
				var next = h.getNextGame();
				console.log("INFO : Helper function getNextGame() returned : " + JSON.stringify(next));					
				console.log("INFO : Sending fixture data");
				res.send({
						homeTeam: next.homeTeam,
						awayTeam: next.awayTeam,
						season: '2016',
						game: next.game,
						error: false,
						fixtures: true
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
            }
		},
		'post': {
			'/addPlayer' : (req, res, next) => {
				console.log("INFO : Routing to - post/addPlayer");
				console.log("INFO : POST request with parameters : " + (req.body.playername));
				console.log("INFO : About to check player name " + req.body.playername + " is available");
				h.isNameValid(req.body.playername, 'player').then(valid => {
					if(valid){
						console.log("INFO : Player validation successful - Saving new player data");
						h.createNewPlayer(req.body.playername).then(player => {
							res.send(player.name);
						}).catch(err => {
							console.log("ERROR : error returned when creating new player");
							h.resetGame();
							res.render('welcome', {
								page: "Welcome",
								error: true,
								errorMessage : "An error occurred creating new player. Please try again"
							});
						});
					}
				}).catch(name => {
					console.log("INFO : Problem found when checking if " + name + " is valid");
					h.resetGame();
					res.send("That player already exists. Please try again");
				}); 
			},
			'/savePrediction' : (req, res, next) => {
				console.log("INFO : routerjs POST/savePrediction : Routed to - POST/savePrediction");
				console.log("INFO : routerjs POST/savePrediction : POST request with parameters : " + JSON.stringify(req.body));
				console.log("INFO : routerjs POST/savePrediction : About to update the prediction with - " + req.body.playerPrediction);
				var fixtures = h.getGameStateFixtures();
				var totalGames = h.getTotalFixtures();
				var season = h.getSeason();
				h.updatePrediction(req).then(recordsChanged => {
					console.log("INFO : routerjs POST/savePrediction : Successfully updated player prediction - " + recordsChanged + " record amended");
					res.send({
						url: "/predictionSummary",
						prediction: req.body.playerPrediction,
						week: req.body.week,
						player: req.body.player,
						game: req.body.game,
						totalGames: totalGames,
						season: season,
						fixtures: fixtures,
						recordsUpdated: recordsChanged
					});
				}).catch(err => {
					console.log("ERROR : routerjs POST/savePrediction : " + err);
					res.render('welcome', {
						page: "Welcome",
						error: true,
						errorMessage : "There was an error updating your prediction. Please retry - game has been reset"
					});
				});
			},
			'/predictionSummary' : (req, res, next) => {
				console.log("INFO : routerjs POST/predictionSummary : Routed to - POST/predictionSummary");
				console.log("INFO : routerjs POST/predictionSummary : About to send back prediction data for redirect - " + JSON.stringify(req.body.prediction));
				res.render('predictionSummary', {
					page: "Prediction Summary",
					prediction: req.body.prediction,
					week: req.body.week,
					player: req.body.player,
					game: req.body.game,
					totalGames: req.body.totalGames,
					season: req.body.season,
					fixtures: req.body.fixtures
				});
			}
		},
		'NA': (req, res, next) => {
			res.status(404).sendFile(process.cwd() + '/views/404.htm');
		}
	}

	return h.route(routes);

}
