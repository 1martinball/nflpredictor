'use strict';

/////////////////////////////////////////////////////////
//////////// Predictor Page Actions /////////////////////
/////////////////////////////////////////////////////////



let bindHashChangeEvent = function() {
  $(window).on('hashchange', function(){
    if(location.hash > playerPredictionString.length){
      $(window).history.back();
    } else if(parseInt(location.hash.replace('#','')) < playerPredictionString.length)  {
      playerPredictionString = playerPredictionString.substr(0,playerPredictionString.length-1);
      var index = playerPredictionString.length;
      fixturesLeftToPredict++;
      setTeamBadges(resolveNextTeam(true, index), resolveNextTeam(false, index), index);
      $('span.js-fixtures-remaining').html(fixturesLeftToPredict);
    }
  });
}

let bindClickEvents = function() {

    $(".start-button").click(function () {
        $('.page-title').slideUp(500);
        //$('.page-title').addClass('hide');
        $(".fixture-row-container").removeClass('hide');
        $(".fixture-row-container").slideDown(500);
        $('span.js-fixtures-remaining').html(fixturesLeftToPredict);
        console.log("INFO : #start - About to do ajax call to retrieve fixtures");
        getAllFixturesForCurrentWeek(false, sessionStorage.week, sessionStorage.season);
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
          fixturesLeftToPredict--;
          var index = totalGames - fixturesLeftToPredict;
          setTeamBadges(resolveNextTeam(true, index), resolveNextTeam(false, index), index);
          $('span.js-fixtures-remaining').html(fixturesLeftToPredict);
          location.hash = playerPredictionString.length;
        } else {
            currentPlayer = $('#player-name-id').text();
            currentGame = $('#game-name-id').text();
            console.log("INFO : result-button.click : All fixtures have been predicted - sending predictions to server repository");
            console.log("DEBUG : Prediction string to send is - " + playerPredictionString);
            console.log("DEBUG : Player to send is - " + currentPlayer);
            console.log("DEBUG : Game to send is - " + currentGame);
            console.log("DEBUG : Week to send is - " + currentWeek);
            if(playerPredictionString.length == totalGames) {
                $.ajax("/savePrediction", {
                    method: 'POST',
                    data : { playerPrediction : playerPredictionString, player: currentPlayer, game : currentGame},
                    dataType: 'json',
                    success: function (result, status, req) {
                        console.log("DEBUG : result-button.click : Returned from saving prediction successfully - " + JSON.stringify(result));
                        // console.log("DEBUG : result-button.click :  - " + JSON.stringify(result.fixtures[0].homeTeam));
                        console.log("INFO : result-button.click : Redirecting to prediction summary page");
                        $.redirect(result.url, { prediction: result.prediction, player: result.player, game: result.game});
                    }
                });
            } else {
                console.log("ERROR : result-button.click : There was a problem with your predictions......resetting game");
                window.location.replace('http://localhost:3000');
            }
        }
    });
}

let resolveNextTeam = function(isHomeTeam, index) {
  return isHomeTeam ? allFixtures[index].homeTeam.team : allFixtures[index].awayTeam.team;
}

let setTeamBadges = function(homeTeam, awayTeam, index){
	$('.team-badge.away').attr("src", "../images/teams/"+awayTeam+"_logo.svg");
	$('.team-badge.home').attr("src", "../images/teams/"+homeTeam+"_logo.svg");
}


$(document).ready(function () {
    location.hash = playerPredictionString.length;
    $('span.heading-text').text(sessionStorage.season + " Season");
    $('span.season-number').text(sessionStorage.season + " Season");
    $('span.week-number').text("Week " + sessionStorage.week);

    bindClickEvents();
    bindHashChangeEvent();
});
