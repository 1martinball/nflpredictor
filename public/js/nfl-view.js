'use strict';


/////////////////////////////////////////////////////////
//////////// View Game Page Actions ///////////////////////
/////////////////////////////////////////////////////////


let fetchResultTableData = function(game, week, season, players){

    console.log("INFO: Calling getAllFixture service for : Week - " + week + " : Season - " + season);
    $.ajax({
        url: '/getAllFixtures',
        data: "week=" + week + "&season=" + season,
        success: function (result, status, req) {
            console.log("DEBUG : Result returned from GET/getAllFixtures - " + JSON.stringify(result));
            totalGames = result.totalFixtures;
            createTable(game, players, result.fixtures, totalGames);
            $('.page-title').slideUp('slow');
        }
    });

}

let createTable = function(game, players, fixtures, totalgames) {
    var winningPlayerIndex = 0;
    players.forEach((player) => {
       player.gameScore = 0;
    });
    console.log("INFO : About to create result table");
    console.log("DEBUG : There are " + players.length + " players in this game");

    for(var j = 0; j < totalgames; j++){

        $('#result-table-body').append("<tr id='row-fixture-" + j + "'><td id='R-" + j + "' class='road-col text-center'></td><td id='T-" + j + "' class='text-col text-center'>@</td><td id='H-" + j + "' class='home-col  text-center'></td></tr>>");
        let awayScore = fixtures[j].awayTeam.score;
        let homeScore = fixtures[j].homeTeam.score;
        $('#R-' + j).append("<img class='team-badge-smaller away" + j + "' type='image/svg+xml' src='/images/teams/" + fixtures[j].awayTeam.team + "_logo.svg' />");
        $('#R-' + j).append(" : " + awayScore).addClass('text-col');
        $('#H-' + j).append(homeScore + " : ").addClass('text-col');
        $('#H-' + j).append("<img class='team-badge-smaller home" + j + "' type='image/svg+xml' src='/images/teams/" + fixtures[j].homeTeam.team + "_logo.svg' />");
        homeScore == awayScore ? $('#T-' + j).addClass('winner') : homeScore > awayScore ? $('#H-' + j).addClass('winner') : $('#R-' + j).addClass('winner');
        if(j == totalGames-1){
            $('#result-table-footer').append("<tr id='row-footer'><td id='R-footer' class='road-col text-center'></td><td id='T-footer' class='text-col text-center'></td><td id='H-footer' class='home-col  text-center'></td></tr>>");
        }
        for(var i = 0; i < players.length; i++) {
            if (j == 0) {
                $(".result-table-header-row").append("<th class='text-center player" + i + "'>" + players[i].name + "</th>");
            }
            $('#row-fixture-' + j).append("<td id='P" + i + "row" + j + "' class='player-col text-center'>");
            if (players[i].prediction[j] !== 'T') {
                $("#P" + i + "row" + j).append("<img class='team-badge-smaller' type='image/svg+xml' src='/images/teams/" + convertPlayerPrediction(players[i].prediction[j], fixtures[j]) + "' />");
            } else {
                $("#P" + i + "row" + j).append("TIE").addClass('text-col');
            }
            if($('#'+players[i].prediction[j]+'-'+j).hasClass('winner')) {
                $("#P" + i + "row" + j).append("<img class='tick' type='image/png' src='/images/tick.png' />");
                players[i].gameScore++;
            }
            if (j == totalgames-1) {
                if(i > 0) {
                    if(players[i].gameScore > players[i-1].gameScore) {
                        winningPlayerIndex = i;
                    }
                }
                $("#row-footer").append("<td class='text-center text-col'>" + players[i].gameScore + "</td>");
            }
        }
    }
    $(".player" + winningPlayerIndex).addClass('star').append("<p class='font-10 text-center'>WINNER</p>");
    $('.game-view-table').slideDown('slow');
    $('.game-view-table').removeClass('hide');
}

let convertPlayerPrediction = (prediction, fixture) => {
    if(prediction === 'H') {
        return fixture.homeTeam.team + "_logo.svg";
    } else if(prediction === 'R') {
        return fixture.awayTeam.team + "_logo.svg";
    } else {
        return 'TIE.jpg';
    }
}

let bindClickEvents = function(){

}

let bindChangeEvents = function(){

    $('#selectGameToView').change(function(){
        currentGame = $(this).val();
        currentWeek = existingGamesList.find(function(game){
            return game.name === currentGame;
        }).week;
        season = existingGamesList.find(function(game){
            return game.name === currentGame;
        }).season;
        var players = existingGamesList.find(function(game){
            return game.name === currentGame;
        }).players;
        $('.error').html("");
        fetchResultTableData(currentGame, currentWeek, season, players);
    });
}

let bindSubmitEvent = function(){

}

$(document).ready(function () {

    currentPlayer = $('#player').html();
    getExistingGameNames('#selectGameToView', true);
    bindClickEvents();
    bindChangeEvents();
    bindSubmitEvent();

});

