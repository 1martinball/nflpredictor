'use strict';

var homeTeam = "No team loaded";
var awayTeam = "No team loaded";
var weekChosen = null;
var playerPredictionString = "";

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

function getExistingGameNames(){
	var dummyGames = ["mbgame1", "mbgame2", "mbgame3", "mbgame4", "mbgame5"];
	return dummyGames;
}

function populateCurrentPlayers(){
	console.log("INFO : Retrieving existing players for dropdown");
	$.ajax({
		url: '/getPlayers',
		success: function (result, status, req) {
			var optionArray = []
			console.log(JSON.stringify(result));
			console.log(result);
			console.log("INFO : Returned " + result.length + " players");
			$.each(result, function(index, player) {
				console.log("Player returned for dropdown = " + player.name);
				$('#selectPlayer').append('<option value="' + player.name + '">' + player.name + '</option>');	
			});
		}
	});
}

$(document).ready(function () {
	
	populateCurrentPlayers();
	
	$("#week").change(function () {
		console.log("In nfl.js about to do ajax call");
		weekChosen = $('#week').find(":selected").text();
		console.log("Week Chosen = " + weekChosen);
		$.ajax({
			url: '/getFixtures',
			data: "week=" + weekChosen,
			success: function (result, status, req) {
				console.log(result);
				homeTeam = result.homeTeam;
				awayTeam = result.awayTeam;
				$('.team-badge.home').attr("src", "../images/teams/" + result.homeTeam + "_logo.svg");
				$('.team-badge.away').attr("src", "../images/teams/" + result.awayTeam + "_logo.svg");
				$('span.week-number').html("Week " + weekChosen);

				$('fixture-row-container').removeClass('hide');
				$('select#week').addClass('hide');
				$('.page-title').slideUp('slow');
			}
		});
	});

	$("#newgame").click(function () {
		$('.game-buttons-container').addClass('hide');
		$(".newgame-info-container").removeClass('hide');
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
	
	$("select#week").change(function () {
		$(".fixture-row-container").removeClass('hide');
		$(".fixture-row-container").slideDown(300);
	});

	$("#addPlayerBtn").click(function () {
		console.log("INFO : Add player click function - about to contact server to add this player");
		$('#selectPlayer').addClass('hide');
		if ($("#playername").val() === "") {
			console.log("ERROR : No player name entered");
			alert("Please enter a player name");
		} else{
			console.log("INFO : Contacting server to validate and save " + $("#playername").val())
			$.ajax("/addplayer", {
				method: 'POST',
				data: "playername=" + $("#playername").val(),
				success: function (data, status, req) {
					console.log("Ajax add player returned successfully");
					$("p.message").html(data);
					$("p.message").removeClass('hide');
				}
			});
		}
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
		$.ajax("/getNextGame", {
			method: 'GET',
			success: function (result, status, req) {
				console.log("Ajax get next game returned successfully");
				console.log("In success for getNextGame : game = " + result.game);
				homeTeam = result.homeTeam;
				awayTeam = result.awayTeam;
				$('.team-badge.home').attr("src", "../images/teams/" + result.homeTeam + "_logo.svg");
				$('.team-badge.away').attr("src", "../images/teams/" + result.awayTeam + "_logo.svg");
				$('p.game-number').html("Game " + result.game);
				$('fixture-row-container').removeClass('hide');
				$('select#week').addClass('hide');

			}
		});
	});
});