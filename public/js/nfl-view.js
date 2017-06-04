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
    console.log("INFO : About to create result table");
    console.log("DEBUG : There are " + players.length + " players in this game");

    for(var j = 0; j < totalgames; j++){
        $('#result-table-body').append("<tr id='row-fixture-" + j + "'><td id='R-" + j + "' class='road-col text-center'></td><td id='T-" + j + "' class='text-col text-center'>@</td><td id='H-" + j + "' class='home-col  text-center'></td></tr>>");
        $('#R-' + j).append("<img class='team-badge-smaller away" + j + "' type='image/svg+xml' src='/images/teams/" + fixtures[j].awayTeam.team + "_logo.svg' />");
        $('#R-' + j).append(" : " + fixtures[j].awayTeam.score).addClass('text-col');
        $('#H-' + j).append("<img class='team-badge-smaller home" + j + "' type='image/svg+xml' src='/images/teams/" + fixtures[j].homeTeam.team + "_logo.svg' />");
        $('#H-' + j).append(" : " + fixtures[j].homeTeam.score).addClass('text-col');

        for(var i = 0; i < players.length; i++) {
            if (j == 0) {
                $(".result-table-header-row").append("<th class='text-center'>" + players[i].name + "</th>");
            }
            $('#row-fixture-' + j).append("<td id='P" + i + "row" + j + "' class='player-col text-center'>");
            if (players[i].prediction[j] !== 'T') {
                $("#P" + i + "row" + j).append("<img class='team-badge-smaller' type='image/svg+xml' src='/images/teams/" + convertPlayerPrediction(players[i].prediction[j], fixtures[j]) + "' />");
            } else {
                $("#P" + i + "row" + j).append("TIE").addClass('text-col');
            }
        }
    }
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

