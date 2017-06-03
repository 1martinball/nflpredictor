'use strict';


/////////////////////////////////////////////////////////
//////////// View Game Page Actions ///////////////////////
/////////////////////////////////////////////////////////


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
        $('.error').html("");
        fetchResultTableData(currentGame, currentWeek, season);



    });
}

let fetchResultTableData = function(game, week, season){

    console.log("INFO : getPlayerForGameService : Attempting to retrieve list of players for this game - " + game);
    $.ajax("/getPlayersForGame", {
        method: 'GET',
        data: "game="+game,
        success: function (players, status, req) {
            console.log("INFO : getPlayerForGameService : Ajax GET/getPlayerForGame returned successfully - " + players);
            $('.message.error').html("");
            console.log("INFO: Calling getAllFixture service for : Week - " + week + " : Season - " + season);
            $.ajax({
                url: '/getAllFixtures',
                data: "week=" + week + "&season=" + season,
                success: function (result, status, req) {
                    console.log("DEBUG : Result returned from GET/getAllFixtures - " + JSON.stringify(result));
                    totalGames = result.totalFixtures;
                    createTable(players, result.fixtures, totalGames);
                    $('.page-title').slideUp('slow');
                }
            });
        },
        error:  function() {
            $('.message.error').html(result);
            $('.message.error').removeClass('hide');
            setTimeout(function () {
                $('.message').html("");
            }, 3000);
            resetGame();
            window.location("/");
        }
    });
}

let createTable = function(players, fixtures, totalgames) {
    console.log("INFO : About to create result table");
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

