'use strict';

/////////////////////////////////////////////////////////
//////////// Prediction Summary Page Actions ///////////////////////
/////////////////////////////////////////////////////////


var predictionSummaryFixtures = null;

let bindClickEvents = function() {

    var $clickableElements = $("td");

    $clickableElements.on("click", function(event){

        var target = event.currentTarget.id;
        var newPredictionForGame = target.split('-')[0];
        var index = parseInt(target.split('-')[1]);
        var predictionString = $('#predictionString').val();
        var currentPredictionForGame = predictionString[index];

        if(currentPredictionForGame !== newPredictionForGame) {
            var newPredictionString = predictionString.substr(0,index) + newPredictionForGame + predictionString.substr(index+1);
            $('#predictionString').val(newPredictionString);

            $("#"+currentPredictionForGame+"-"+index).removeClass(currentPredictionForGame+"Pick").addClass(newPredictionForGame+"Pick");
            $("#"+newPredictionForGame+"-"+index).addClass(newPredictionForGame+"Pick").removeClass(currentPredictionForGame+"Pick");
        }
    });

}

$(document).ready(function () {

    bindClickEvents();

    if(predictionSummaryFixtures) {
        for(var i=0; i < predictionSummaryFixtures.length; i++){
            $('img.away' + i).attr('src', 'images/teams/' + predictionSummaryFixtures[i].awayTeam.team + '_logo.svg');
            $('img.home' + i).attr('src', 'images/teams/' + predictionSummaryFixtures[i].homeTeam.team + '_logo.svg');
        }
    }
});


