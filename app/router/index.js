'use strict';
const h = require('../helpers');
const passport = require('passport');


module.exports = () => {

	let routes = {
		'get': {
			'/': (req, res, next) => {
				console.log("INFO : Routing to - Welcome page at GET/");
				console.log("INFO : GET request with parameters : " + req.query);
				console.log("INFO : Rendering page : welcome.ejs");
				res.render('welcome', {
					page: "Welcome",
					error: false,
					errorMessage: ""
				});
			},
			'/redzone': (req, res, next) => {
				console.log("INFO : Routing to - Predictor at GET/redzone");
				console.log("INFO : GET request with parameters : " + req.query);
				console.log("INFO : Rendering page : predictor.ejs");
				console.log("INFO : Checking DB for game names")
				h.isNameValid(req.query.gamename, 'game').then(valid => {
					if(valid) {
						console.log("INFO : Game validation successful - Saving new game and player data");
						h.createNewGame(req).then(game => {
							res.render('predictor', {
								page: "NFL Predictor | Redzone",
								season: '2016',
								error: false,
								errorMessage: "",
								week: '1',
								game: '1',
								fixtures: false,
								awayTeam: null,
								homeTeam: null
							});
						}).catch( err => {
							console.log("ERROR : error returned when creating new game");
							res.render('welcome', {
								page: "Welcome",
								error: true,
								errorMessage : "An error occurred. Please try again"
							});
						});
					} else {
						res.render('welcome', {
							page: "Welcome",
							error: true,
							errorMessage : "That game name is already in use. Please enter a new game name"
						});
					}
				}).catch(err => {
					console.log("ERROR : error returned when checking if game is valid");
					res.render('welcome', {
						page: "Welcome",
						error: true,
						errorMessage : "An error occurred. Please try again"
					});
				});
			},
			'/redzoneExistingPlayer': (req, res, next) => {
				console.log("INFO : Routing to - Predictor at GET/redzoneExistingPlayer");
				console.log("INFO : GET request with parameters : " + req.query);
				console.log("INFO : Rendering page : predictor.ejs");

				console.log("INFO : Existing game validation not required - Need to update game with player data");
				h.addPlayerToGame(req).then(player => {
					res.render('predictor', {
						page: "NFL Predictor | Redzone",
						season: '2016',
						error: false,
						errorMessage: "",
						week: '1',
						game: '1',
						fixtures: false,
						awayTeam: null,
						homeTeam: null
					});
				}).catch( err => {
					console.log("ERROR : error returned when adding player to game");
					res.render('welcome', {
						page: "Welcome",
						error: true,
						errorMessage : "An error occurred. Please try again"
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
				h.getGames().then(games => {
					console.log("INFO : Helper function getGames() returned to router with : " + games);
					console.log("INFO : Sending games data");
					res.send(games);
				}).catch(err => {
					console.log("ERROR : Error while attempting to retrieve existing games");
					console.log(err);
				});
			},
			'/getFixtures': (req, res, next) => {
				console.log("INFO : Routing to : Fixture look up with request GET/getFixtures");
				console.log("INFO : GET request with parameters : " + req.query);
				console.log("INFO : Calling helper function getFixtures()");
				h.getFixtures(req.query.week).then(teams => {
					console.log("INFO : Helper function getFixtures() returned to router with : " + JSON.stringify(teams));
					console.log("INFO : Sending fixture data");
					res.send({
						homeTeam: teams.homeTeam,
						awayTeam: teams.awayTeam,
						season: '2016',
						week: teams.week,
						game: teams.game,
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
				console.log("INFO : GET request with parameters : " + req.query);
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
							res.render('welcome', {
								page: "Welcome",
								error: true,
								errorMessage : "An error occurred. Please try again"
							});
						});
					} else {
						console.log("INFO : Player validation failed - name already in use - try again");
						res.render('welcome', {
							page: "Welcome",
							error: true,
							errorMessage : req.body.playername + " is already in use. Please try again"
						});
					}
				}).catch(err => {
					console.log("ERROR : error returned when checking if player is valid");
					res.render('welcome', {
						page: "Welcome",
						error: true,
						errorMessage : "An error occurred. Please try again"
					});
				}); 
			}
		},
		'NA': (req, res, next) => {
			res.status(404).sendFile(process.cwd() + '/views/404.htm');
		}
	}

	return h.route(routes);

}
