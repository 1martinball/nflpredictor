'use strict';


let populateBaseGameInfo = function() {
    console.log("INFO : Retrieving initial game info");
    $.ajax({
        url: '/getInfo',
        success: function (result, status, req) {
            console.log("INFO - successfully returned from getInfo call with result - " + JSON.stringify(result));
            console.log("DEBUG : Returned season - " + result.seasonYear + ", seasonType - " + result.seasonType + ", week - " + result.week);
            var numericStringWeek = result.week.replace(/^\D+/g,"");
            currentNflGameInfo.currentNflWeek = numericStringWeek;
            currentNflGameInfo.currentNflSeason = result.seasonYear;
            currentNflGameInfo.currentNflSeasonType = result.seasonType;
            console.log("DEBUG : currentNflGameInfo resolved to - " + JSON.stringify(currentNflGameInfo));

        }
    });
}
