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

var allFixtures = null;
sessionStorage.isDebug = false;

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

let addPageState = state => {
	location.hash = state;
}

let getExistingGameNames = function(elementToAppend, inGame) {
	if (inGame) {
		console.log("INFO : Retrieving existing games for player " + currentPlayer + " to populate results dropdown");
	}
	else {
		console.log("INFO : Retrieving existing games for dropdown for eligible games for player " + currentPlayer + " to enter");
	}
	$.ajax({
		url: '/getGames',
		data: "playername=" + currentPlayer + "&inGame=" + inGame,
		success: function(result, status, req) {
			if (result.length) {
				console.log("INFO - successfully returned from getGames call with result - " + result);
				console.log("DEBUG : Returned " + result.length + " games");
				existingGamesList = result;
				for (var i = 0; i < result.length; i++) {
					console.log("DEBUG : About to append " + result[i].name + " to dropdown");
					$(elementToAppend).append('<option value="' + result[i].name + '">' + result[i].name + '</option>');
				}
				if (!inGame) {
					$('.game-buttons-container').addClass('hide');
					$(".oldgame-info-container").removeClass('hide');
					$(".oldgame-info-container").slideDown(300);
					location.hash = "Start"
				}
			}
			else {
				if (!inGame) {
					console.log("INFO : There are no existing games to play in - returning to main menu");
					$('.message.error').html("Sorry, there are no valid existing games to play in");
					$('.message.error').removeClass('hide');
					setTimeout(function() {
						$('.message').html("");
					}, 3000);
				}
				else {
					console.log("INFO : There are no game results to view - returning to main menu");
					alert("Sorry, there are no games to view at this time, click Ok to return to main menu");
					history.back();
				}
			}
		}
	});
}

let maintenance = function() {
	console.log("Running maintenance to close games that are complete or in progress");
	$.ajax("/closeGames", {
		method: 'POST',
		data: "currentWeek=" + sessionStorage.week,
		success: function(result, status, req) {
			console.log("INFO : Maintenance returned successfully - " + result + " games closed");
		},
		error: function() {
			console.log("INFO : Error running maintenance on DB");
		}
	});
}

let populateCurrentPlayers = function() {
	console.log("INFO : Retrieving existing players for dropdown");
	$.ajax({
		url: '/getPlayers',
		success: function(result, status, req) {
			console.log("INFO - successfully returned from getPlayers call with result - " + result);
			console.log("DEBUG : Returned " + result.length + " players");
			for (var i = 0; i < result.length; i++) {
				console.log("DEBUG : About to append " + result[i] + " to dropdown");
				$('#selectPlayer').append('<option value="' + result[i] + '">' + result[i] + '</option>');
			}
		}
	});
}

let getAllFixturesForCurrentWeek = function(from, week, season) {

	console.log("INFO: Calling getAllFixture service for current NFL week");
	$.ajax({
		url: '/getAllFixtures',
		data: "week=" + week + "&season=" + season,
		success: function(result, status, req) {
			console.log("DEBUG : Result returned from GET/getAllFixtures - " + JSON.stringify(result));
			totalGames = result.totalFixtures;

			result.fixtures = checkFixturesAndSort(result.fixtures);

			if (from == "predictor") {
				startGamePredictionsInitialiser(result);
			}
			else if (from == "summary") {
				populatePredictions(result.fixtures);
			}
			else {
				//here from getInfo method and used to ensure current week is set correctly
				//in some circumstances the service will return the current week when some games are already played
				//we want to set current week to week where all games are available to predict
				//no need to do anything as checkFixturesAndSort function will have set week correctly
			}
		}
	});
}

let startGamePredictionsInitialiser = function(allFixtureResponse) {
	allFixtures = allFixtureResponse.fixtures;
	homeTeam = allFixtureResponse.fixtures[0].homeTeam.team;
	awayTeam = allFixtureResponse.fixtures[0].awayTeam.team;
	fixturesLeftToPredict = allFixtureResponse.totalFixtures;
	totalGames = allFixtureResponse.totalFixtures;
	playerPredictionString = "";
	$('span.js-fixtures-remaining').text(fixturesLeftToPredict);
	setTeamBadges(homeTeam, awayTeam, totalGames - fixturesLeftToPredict)
}

let checkFixturesAndSort = fixtures => {
	console.log("INFO: Fixtures will now be sorted by day");
	fixtures.sort((fixture1, fixture2) => {

		var gameIndexFixture1 = fixture1.gsisId.slice(-2);
		var gameDayFixture1 = fixture1.gsisId.substr(-4, 2);
		var gameMonthFixture1 = fixture1.gsisId.substr(4, 2);
		var gameYearFixture1 = fixture1.gsisId.substr(0, 4);

		var gameIndexFixture2 = fixture2.gsisId.slice(-2);
		var gameDayFixture2 = fixture2.gsisId.substr(-4, 2);
		var gameMonthFixture2 = fixture2.gsisId.substr(4, 2);
		var gameYearFixture2 = fixture2.gsisId.substr(0, 4);
		console.log("DEBUG: Original gsisId fixture1 = " + fixture1.gsisId + "; fixture2 = " + fixture2.gsisId);
		console.log("DEBUG: Fixture1 - gsisId = " + gameYearFixture1 + gameMonthFixture1 + gameDayFixture1 + gameIndexFixture1);
		console.log("DEBUG: Fixture1 - gsisId = " + gameYearFixture2 + gameMonthFixture2 + gameDayFixture2 + gameIndexFixture2);

		if (parseInt(gameYearFixture1) === parseInt(gameYearFixture2)) {
			if (parseInt(gameMonthFixture1) === parseInt(gameMonthFixture2)) {
				if (parseInt(gameDayFixture1) === parseInt(gameDayFixture2)) {
					return parseInt(gameIndexFixture1) - parseInt(gameIndexFixture2);
				}
				else {
					return parseInt(gameDayFixture1) - parseInt(gameDayFixture2);
				}
			}
			else {
				return parseInt(gameMonthFixture1) - parseInt(gameMonthFixture2);
			}
		}
		else {
			return parseInt(gameYearFixture1) - parseInt(gameYearFixture2);
		}
	});


	if (!hasEarliestFixtureElapsed(fixtures[0])) {
		return fixtures;
	}
	else {
		incrementWeekInSession();
		return getAllFixturesForCurrentWeek(false, sessionStorage.week, sessionStorage.season);
	}
}

let hasEarliestFixtureElapsed = earliestFixture => {
	var fixtureDate = new Date(earliestFixture.gsisId.substr(0, 4), earliestFixture.gsisId.substr(4, 2) - 1, earliestFixture.gsisId.substr(-4, 2));
	var dateToday = new Date();

	if (dateToday < fixtureDate) {
		return false;
	}
	else if (dateToday.getDate() === fixtureDate.getDate()) {
		return false;
	}
	return true;
}

let incrementWeekInSession = () => {
	var week = parseInt(sessionStorage.week);
	week++;
	sessionStorage.week = week;
}
