'use strict';


let populateBaseGameInfo = function() {
  if(sessionStorage.isDebug){
    sessionStorage.season = prompt("season?");
    sessionStorage.week = prompt("week?");
    sessionStorage.seasonType = "Regular";
  } else {
    console.log("INFO : Retrieving initial game info");
    $.ajax({
        url: '/getInfo',
        success: function (result, status, req) {
            console.log("INFO - successfully returned from getInfo call with result - " + JSON.stringify(result));
            console.log("DEBUG : Returned season - " + result.seasonYear + ", seasonType - " + result.seasonType + ", week - " + result.week);
            var numericStringWeek = result.week.replace(/^\D+/g,"");
            sessionStorage.week = numericStringWeek;
            sessionStorage.season = result.seasonYear;
            sessionStorage.seasonType = result.seasonType;
            console.log("DEBUG : currentNflGameInfo resolved to - " + JSON.stringify(currentNflGameInfo));
            console.log("Saving game info to session");
        }
    });
  }
}
