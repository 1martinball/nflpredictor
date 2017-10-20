'use strict';

var homeTeam = "No team loaded";
var awayTeam = "No team loaded";
var fixturesLeftToPredict = 0;
var totalGames = 0;
var currentPlayer = "";
var currentGame = "";
var currentWeek = "";
var playerPredictionString = "";
var season = "";
var existingGamesList = [];
var currentNflGameInfo = {
				currentNflSeason : "",
				currentNflWeek: "",
				currentNflSeasonType: "",
		}
var allFixtures = null;
var teams = {
		CHI: "Bears",
		MIN: "Vikings",
		GB: 'Packers',
		DET: 'Lions',
		TB: 'Buccaneers',
		CAR: 'Panthers',
		ATL: 'Falcons',
		NO: 'Saints',
		HOU: 'Texans',
		TEN: 'Titans',
		NE: 'Patriots',
		MIA: 'Dolphins',
		BUF: 'Bills',
		NYJ: 'Jets',
		PHI: 'Eagles',
		WAS: 'Redskins',
		DAL: 'Cowboys',
		NYG: 'Giants',
		KC: 'Chiefs',
		DEN: 'Broncos',
		CLE: 'Browns',
		IND: 'Colts',
		PIT: 'Steelers',
		ARI: 'Cardinals',
		SF: '49ers',
		SEA: 'Seahawks',
		LAR: 'Rams',
		OAK: 'Raiders',
		BAL: 'Ravens',
		JAC: 'Jaguars',
		LAC: 'Chargers',
		CIN: 'Bengals'
}

let resetGame = function() {
		homeTeam = "No team loaded";
		awayTeam = "No team loaded";
		fixturesLeftToPredict = 0;
		totalGames = 0;
		playerPredictionString = "";
		currentPlayer = "";
		currentGame = "";
		currentWeek = "";
		existingGamesList = [];
}

let getExistingGameNames = function(elementToAppend, inGame){
		if(inGame){
				console.log("INFO : Retrieving existing games for player " + currentPlayer + " to populate results dropdown");
		} else {
				console.log("INFO : Retrieving existing games for dropdown for eligible games for player " + currentPlayer + " to enter");
		}
		$.ajax({
				url: '/getGames',
				data: "playername=" + currentPlayer + "&inGame=" + inGame,
				success: function (result, status, req) {
						if(result.length){
								console.log("INFO - successfully returned from getGames call with result - " + result);
								console.log("DEBUG : Returned " + result.length + " games");
								existingGamesList = result;
								for (var i=0; i < result.length; i++){
										console.log("DEBUG : About to append " + result[i].name + " to dropdown");
										$(elementToAppend).append('<option value="' + result[i].name + '">' + result[i].name + '</option>');
								}
								if (!inGame) {
										$('.game-buttons-container').addClass('hide');
										$(".oldgame-info-container").removeClass('hide');
										$(".oldgame-info-container").slideDown(300);
								}
						} else {
								if(!inGame) {
										console.log("INFO : There are no existing games to play in - returning to main menu");
										$('.message.error').html("Sorry, there are no valid existing games to play in");
										$('.message.error').removeClass('hide');
										setTimeout(function(){
												$('.message').html("");
										}, 3000);
								} else {
										console.log("INFO : There are no game results to view - returning to main menu");
										alert("Sorry, you have no games to view at this time");
										resetGame();
										window.location.replace('http://localhost:3000');
								}
						}
				}
		});
}

let populateCurrentPlayers = function(){
		console.log("INFO : Retrieving existing players for dropdown");
		$.ajax({
				url: '/getPlayers',
				success: function (result, status, req) {
						console.log("INFO - successfully returned from getPlayers call with result - " + result);
						console.log("DEBUG : Returned " + result.length + " players");
						for (var i=0; i < result.length; i++){
								console.log("DEBUG : About to append " + result[i] + " to dropdown");
								$('#selectPlayer').append('<option value="' + result[i] + '">' + result[i] + '</option>');
						}
				}
		});
}

let getAllFixturesForCurrentWeek = function(isSummary){

		console.log("INFO: Calling getAllFixture service for current NFL week");
		$.ajax({
				url: '/getAllFixtures',
				data: "week=current&season=" + currentNflGameInfo.currentNflSeason,
				success: function (result, status, req) {
						console.log("DEBUG : Result returned from GET/getAllFixtures - " + JSON.stringify(result));
						totalGames = result.totalFixtures;

						if(!isSummary){
							startGamePredictionsInitialiser(result);
						} else {
							populatePredictions(result.fixtures);
						}
				}
		});
}

let startGamePredictionsInitialiser = function(allFixtureResponse){
	allFixtures = allFixtureResponse.fixtures;
	homeTeam = allFixtureResponse.fixtures[0].homeTeam.team;
	awayTeam = allFixtureResponse.fixtures[0].awayTeam.team;
	fixturesLeftToPredict = allFixtureResponse.totalFixtures;
	totalGames = allFixtureResponse.totalFixtures;
	playerPredictionString = "";
	setTeamBadges(homeTeam, awayTeam, totalGames-fixturesLeftToPredict)
}

let setTeamBadges = function(homeTeam, awayTeam, index){
	$('.team-badge.away').attr("src", "../images/teams/"+awayTeam+"_logo.svg");
	$('.team-badge.home').attr("src", "../images/teams/"+homeTeam+"_logo.svg");
}
