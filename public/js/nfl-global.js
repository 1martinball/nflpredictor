'use strict';

var homeTeam = "No team loaded";
var awayTeam = "No team loaded";
var fixturesLeftToPredict = 0;
var totalGames = 0;
var weekChosen = null;
var currentPlayer = "";
var currentGame = "";
var currentWeek = "";
var playerPredictionString = "";
var season = "";
var existingGamesList = [];
var currentNflGameInfo = {
        currentNflSeason : "",
        currentNflWeek: "",
        currentNflSeasonType: ""
    }

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

let resetGame = function() {
    homeTeam = "No team loaded";
    awayTeam = "No team loaded";
    fixturesLeftToPredict = 0;
    totalGames = 0;
    weekChosen = null;
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
        console.log("INFO : Retrieving existing games for dropdown for elligible games for player " + currentPlayer + " to enter");
    }
    $.ajax({
        url: '/getGames',
        data: "playername=" + currentPlayer + "&inGame=" + inGame,
        success: function (result, status, req) {
            console.log("INFO - successfully returned from getGames call with result - " + result);
            console.log("DEBUG : Returned " + result.length + " games");
            existingGamesList = result;
            for (var i=0; i < result.length; i++){
                console.log("DEBUG : About to append " + result[i].name + " to dropdown");
                $(elementToAppend).append('<option value="' + result[i].name + '">' + result[i].name + '</option>');
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



let getFixturesService = function (week) {
    console.log("INFO: getFixtureService - calling getFixture service for : Week - " + week + " : Season - " + season);
    $.ajax({
        url: '/getFixtures',
        data: "week=" + week + "&season=" + season,
        success: function (result, status, req) {
            console.log("DEBUG : getFixturesService() : Result returned from GET/getFixtures - " + JSON.stringify(result));
            homeTeam = result.homeTeam;
            awayTeam = result.awayTeam;
            fixturesLeftToPredict = result.totalFixtures;
            totalGames = result.totalFixtures;
            $('.team-badge.home').attr("src", "../images/teams/" + result.homeTeam + "_logo.svg");
            $('.team-badge.away').attr("src", "../images/teams/" + result.awayTeam + "_logo.svg");
            $('span.week-number').html("Week " + week);
            $('span.season-number').html("Season " + season);
            $('span.js-fixtures-remaining').html(fixturesLeftToPredict);
            $('.fixture-row-container').removeClass('hide');
            $('select#week').addClass('hide');
            $('.page-title').slideUp('slow');
        }
    });
};