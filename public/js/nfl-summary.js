'use strict';

/////////////////////////////////////////////////////////
//////////// Prediction Summary Page Actions ///////////////////////
/////////////////////////////////////////////////////////


var predictionSummaryFixtures = null;


$(document).ready(function () {

    if(predictionSummaryFixtures) {
        for(var i=0; i < predictionSummaryFixtures.length; i++){
            $('img.away' + i).attr('src', 'images/teams/' + predictionSummaryFixtures[i].awayTeam.team + '_logo.svg');
            $('img.home' + i).attr('src', 'images/teams/' + predictionSummaryFixtures[i].homeTeam.team + '_logo.svg');
        }
    }

});


