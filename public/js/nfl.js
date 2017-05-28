'use strict';

var homeTeam = "No team loaded";
var awayTeam = "No team loaded";
var fixturesLeftToPredict = 0;
var totalGames = 0;
var weekChosen = null;
var currentPlayer = "";
var currentGame = "";
var playerPredictionString = "";
var season = "2016";
var predictionSummaryFixtures = null;

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
	LA: 'Rams',
	OAK: 'Raiders',
	BAL: 'Ravens',
	JAC: 'Jaguars',
	SD: 'Chargers',
	CIN: 'Bengals'
}

function resetGame() {
	homeTeam = "No team loaded";
 	awayTeam = "No team loaded";
 	fixturesLeftToPredict = 0;
	totalGames = 0;
	weekChosen = null;
	playerPredictionString = "";
	currentPlayer = "";
	currentGame = "";
}

function getExistingGameNames(){

	console.log("INFO : Retrieving existing games for dropdown");
	$.ajax({
		url: '/getGames',
		data: "playername=" + currentPlayer,
		success: function (result, status, req) {
			console.log("INFO - successfully returned from getGames call with result - " + result);
			console.log("DEBUG : Returned " + result.length + " games");
			for (var i=0; i < result.length; i++){
				console.log("DEBUG : About to append " + result[i] + " to dropdown");
				$('#selectGame').append('<option value="' + result[i] + '">' + result[i] + '</option>');
			}
		}
	});

}

function populateCurrentPlayers(){
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

$(document).ready(function () {


	/////////////////////////////////////////////////////////
	//////////// Welcome Page Actions ///////////////////////
	/////////////////////////////////////////////////////////

	if($('#welcomeForm').length){
		resetGame();
		populateCurrentPlayers();
	}

	$("#newgame").click(function () {
		$('.game-buttons-container').addClass('hide');
		$(".newgame-info-container").removeClass('hide');
		$(".newgame-info-container").addClass('show');
		$(".newgame-info-container").slideDown(300);
	});
	
	$("#oldgame").click(function () {
		$('.game-buttons-container').addClass('hide');
		$(".oldgame-info-container").removeClass('hide');
		$(".oldgame-info-container").slideDown(300);
		var gameList = getExistingGameNames();
		$.each(gameList, function (i, game) {
    		$('#existingGameChooser').append($('<option>', { 
				value: game,
				text : game 
    		}));
		});
			
	});

	$("#addPlayerBtn").click(function () {
		console.log("INFO : Add player click function - about to contact server to add this player");

		if ($("#playername").val() === "") {
			console.log("ERROR : No player name entered");
			alert("Please enter a player name");
		} else{
			console.log("INFO : Contacting server to validate and save " + $("#playername").val())
			$.ajax("/addPlayer", {
				method: 'POST',
				data: "playername=" + $("#playername").val(),
				success: function (result, status, req) {
					if(result == $("#playername").val()) {
						console.log("INFO : nfljs.addPlayerBtn.click : Ajax GET/addPlayer returned successfully - " + result);
						currentPlayer = result;
						$('.message.error').html("");
						$('.player-options-container').addClass('hide');
						$('.game-buttons-container').removeClass('hide');
					} else {
						$('.message.error').html(result);
						$('.message.error').removeClass('hide');
						setTimeout(function(){
							$('.message').html("");
						}, 3000);
					}
				}
			});
		}
	});

	$('#selectPlayer').change(function(){
		currentPlayer = $(this).val();
		$('.player-options-container').addClass('hide');
		$('.game-buttons-container').removeClass('hide');
		$('#playername').val("");
		$('.error').html("");
	});

	$('#welcomeForm').submit(function(e){
		if($('#gamename').is(":visible")) {
			if($('#gamename').val() == ""){
				alert("Please enter a game name");
				e.preventDefault();
			} else {
				return;
			}
		}
	});


	/////////////////////////////////////////////////////////
	//////////// Predictor Page Actions /////////////////////
	/////////////////////////////////////////////////////////

	$("select#week").change(function () {
		$(".fixture-row-container").removeClass('hide');
		$(".fixture-row-container").slideDown(300);
	});

	$("#week").change(function () {
		console.log("INFO : In nfl.js about to do ajax call to retrieve fixtures");
		weekChosen = $('#week').find(":selected").text();
		console.log("DEBUG : Week Chosen = " + weekChosen);
		$.ajax({
			url: '/getFixtures',
			data: "week=" + weekChosen + "&season=" + season,
			success: function (result, status, req) {
				console.log("DEBUG : nfl.js #week.change : Result returned from GET/getFixtures - " + result);
				homeTeam = result.homeTeam;
				awayTeam = result.awayTeam;
				fixturesLeftToPredict = result.totalFixtures;
				totalGames = result.totalFixtures;
				$('.team-badge.home').attr("src", "../images/teams/" + result.homeTeam + "_logo.svg");
				$('.team-badge.away').attr("src", "../images/teams/" + result.awayTeam + "_logo.svg");
				$('span.week-number').html("Week " + weekChosen);
				$('span.js-fixtures-remaining').html(fixturesLeftToPredict);

				$('fixture-row-container').removeClass('hide');
				$('select#week').addClass('hide');
				$('.page-title').slideUp('slow');
			}
		});
	});

	$(".result-button").click(function () {
		if ($(this).hasClass('home')) {
			console.log("You have selected " + teams[homeTeam] + " to win");
			playerPredictionString = playerPredictionString + "H";
		} else if ($(this).hasClass('away')) {
			console.log("You have selected " + teams[awayTeam] + " to win");
			playerPredictionString = playerPredictionString + "R";
		} else {
			console.log("You have selected a tie");
			playerPredictionString = playerPredictionString + "T";
		}
		if(fixturesLeftToPredict > 1){
			$.ajax("/getNextGame", {
			method: 'GET',
			success: function (result, status, req) {
					console.log("INFO : nfljs .result-button.click : GET/getNextGame returned successfully - " + JSON.stringify(result));
					homeTeam = result.homeTeam;
					awayTeam = result.awayTeam;
					fixturesLeftToPredict--;
					$('span.js-fixtures-remaining').html(fixturesLeftToPredict);
					$('.team-badge.home').attr("src", "../images/teams/" + result.homeTeam + "_logo.svg");
					$('.team-badge.away').attr("src", "../images/teams/" + result.awayTeam + "_logo.svg");
					$('p.game-number').html("Game " + result.game);
					$('fixture-row-container').removeClass('hide');
					$('select#week').addClass('hide');
				}
			});
		} else {
			currentPlayer = $('#player-name-id').text();
			currentGame = $('#game-name-id').text();
			console.log("INFO : nfljs .result-button.click : All fixtures have been predicted - sending predictions to server repository");
			console.log("DEBUG : Prediction string to send is - " + playerPredictionString);
			console.log("DEBUG : Player to send is - " + currentPlayer);
			console.log("DEBUG : Game to send is - " + currentGame);
			console.log("DEBUG : Week to send is - " + weekChosen);
			if(playerPredictionString.length == totalGames) {
				$.ajax("/savePrediction", {
					method: 'POST',
					data : { playerPrediction : playerPredictionString, player: currentPlayer, game : currentGame, week: weekChosen},
					dataType: 'json',
					success: function (result, status, req) {
						console.log("DEBUG : nfljs .result-button.click : Returned from saving prediction successfully - " + JSON.stringify(result));
						console.log("DEBUG : nfljs .result-button.click :  - " + JSON.stringify(result.fixtures[0].homeTeam));
						console.log("INFO : nfljs .result-button.click : Redirecting to prediction summary page");
						$.redirect(result.url, { prediction: result.prediction, fixtures: JSON.stringify(result.fixtures)});
					}
				});
			} else {
				console.log("ERROR : nfljs result-button.click : There was a problem with your predictions......resetting game");
				resetGame();
				window.location.replace('http://localhost:3000');
			}


		}
	});


	/////////////////////////////////////////////////////////
	//////////// Prediction Summary Page Actions ///////////////////////
	/////////////////////////////////////////////////////////

//	$('row.main-content-predictions').is(":visible", function() {
//		console.log(fixtureResponse[0].awayTeam.team);
//	});

	if(predictionSummaryFixtures) {
		for(var i=0; i < predictionSummaryFixtures.length; i++){
			$('img.away' + i).attr('src', 'images/teams/' + predictionSummaryFixtures[i].awayTeam.team + '_logo.svg');
			$('img.home' + i).attr('src', 'images/teams/' + predictionSummaryFixtures[i].homeTeam.team + '_logo.svg');
		}
	}

});
