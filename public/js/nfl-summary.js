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

let bindSubmitEvent = function(){
		$('#summaryForm').submit(function(e){
				let game = $('#predictionGame').val();
				let player = $('#summaryPlayer').html();
				$.ajax("/savePrediction", {
						method: 'POST',
						data : { playerPrediction : $('#predictionString').val(), game: game , player: player},
						dataType: 'json',
						success: function (result, status, req) {
								console.log("DEBUG : summaruSubmit : Returned from updating prediction successfully - " + JSON.stringify(result));
								console.log("INFO : Exiting to home page");
								if(result.recordsUpdated === 1){
										return;
								}
						},
						error: function(){
								console.log("INFO : Error updating prediction to DB");
								e.preventDefault();
						}
				});

		});
}

let populatePredictions = function(predictionSummaryFixtures){
	if(predictionSummaryFixtures) {
			for(var i=0; i < predictionSummaryFixtures.length; i++){
					$('img.away' + i).attr('src', 'images/teams/' + predictionSummaryFixtures[i].awayTeam.team + '_logo.svg');
					$('img.home' + i).attr('src', 'images/teams/' + predictionSummaryFixtures[i].homeTeam.team + '_logo.svg');
			}
	}
}

$(document).ready(function () {
		bindClickEvents();
		bindSubmitEvent();
		getAllFixturesForCurrentWeek(true);
});
