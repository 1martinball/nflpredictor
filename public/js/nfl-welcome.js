'use strict';


/////////////////////////////////////////////////////////
//////////// Welcome Page Actions ///////////////////////
/////////////////////////////////////////////////////////

populateBaseGameInfo();

let bindClickEvents = function(){

		$("#newgame").click(function () {
				$('.game-buttons-container').addClass('hide');
				$(".newgame-info-container").removeClass('hide');
				$(".newgame-info-container").addClass('show');
				$(".newgame-info-container").slideDown(300);
		});

		$("#oldgame").click(function () {
				getExistingGameNames('#selectGame', false);
		});

		$("#viewgame").click(function () {
				window.location = 'viewGame?player='+currentPlayer;
		});

		$("#addPlayerBtn").click(function () {

				console.log("INFO : Add player click function - about to contact server to add this player");
				if ($("#playername").val() === "") {
						console.log("ERROR : No player name entered");
						alert("Please enter a player name");
				} else{
						console.log("INFO : Contacting server to validate and save " + $("#playername").val())
						$.ajax("/addPlayer", {
								method: 'POST',
								data: "playername=" + $("#playername").val(),
								success: function (result, status, req) {
										if(result == $("#playername").val()) {
												console.log("INFO : nfljs.addPlayerBtn.click : Ajax GET/addPlayer returned successfully - " + result);
												currentPlayer = result;
												$('.message.error').html("");
												$('.player-options-container').addClass('hide');
												$('.game-buttons-container').removeClass('hide');
										} else {
												$('.message.error').html(result);
												$('.message.error').removeClass('hide');
												setTimeout(function(){
														$('.message').html("");
												}, 3000);
										}
								}
						});
				}
		});
}

let bindChangeEvents = function(){

		$('#selectPlayer').change(function(){
				currentPlayer = $(this).val();
				$('.player-options-container').addClass('hide');
				$('.game-buttons-container').removeClass('hide');
				$('#playername').val("");
				$('.error').html("");
		});

		$('#selectGame').change(function(){
				currentGame = $(this).val();
				$('#gamename').val("");
				$('.error').html("");
		});


}

let bindSubmitEvent = function(){

		$('#welcomeForm').submit(function(e){

				if($('#gamename').is(":visible")) {
						if($('#gamename').val() == ""){
								alert("Please enter a game name");
								e.preventDefault();
						} else {
								return;
						}
				} else {
					return;
				}
		});
}

$(document).ready(function () {
		addPageState("Welcome");
		populateCurrentPlayers();
		document.getElementById('welcomeForm').reset();
		bindClickEvents();
		bindChangeEvents();
		bindSubmitEvent();

});
