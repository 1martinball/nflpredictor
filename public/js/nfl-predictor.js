'use strict';

/////////////////////////////////////////////////////////
//////////// Predictor Page Actions /////////////////////
/////////////////////////////////////////////////////////


populateBaseGameInfo();

let bindChangeEvents = function() {

    $("#week").change(function () {
        $(".fixture-row-container").removeClass('hide');
        $(".fixture-row-container").slideDown(300);
        console.log("INFO : #week.change - About to do ajax call to retrieve fixtures");
        weekChosen = $('#week').find(":selected").text();
        season = $('#season').find(":selected").text();
        console.log("DEBUG : Week Chosen = " + weekChosen);
        console.log("DEBUG : Season = " + season);
        getFixturesService(weekChosen);
    });
}


let bindClickEvents = function() {

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
            console.log("INFO : result-button.click : All fixtures have been predicted - sending predictions to server repository");
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
                        console.log("DEBUG : result-button.click : Returned from saving prediction successfully - " + JSON.stringify(result));
                        console.log("DEBUG : result-button.click :  - " + JSON.stringify(result.fixtures[0].homeTeam));
                        console.log("INFO : result-button.click : Redirecting to prediction summary page");
                        $.redirect(result.url, { prediction: result.prediction, week:result.week, player: result.player, game: result.game, totalGames: result.totalGames, season: result.season, fixtures: JSON.stringify(result.fixtures)});
                    }
                });
            } else {
                console.log("ERROR : result-button.click : There was a problem with your predictions......resetting game");
                resetGame();
                window.location.replace('http://localhost:3000');
            }
        }
    });
}


$(document).ready(function () {

    bindClickEvents();
    bindChangeEvents();

    if(!($('.season-week-container').length)) {
        console.log("INFO : About to call fixtures service for existing game : season - " + season + " : week - " + currentWeek);
        getFixturesService(currentWeek);
    }

});

