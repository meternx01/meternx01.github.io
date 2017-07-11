//*****************************************************
// game.js
// Game to play the Crystal Hunter Game
// Outputs to index.html via jQuery.
//
// Jason McKinney
// July 10, 2017
// Version 1
//*****************************************************

// Global Variables
var targetNumber = 0;
var buttonValue = [0, 0, 0, 0];
var accumulatedValue = 0;
var wins = 0;
var losses = 0;

//Console.log function for ease of debugging
function debugOut(place) {
	console.log("-----" + place + "------");
	console.log("targetNumber " + targetNumber);
	console.log("buttonValue " + buttonValue);
	console.log("accumulatedValue " + accumulatedValue);
	console.log("wins " + wins);
	console.log("losses " + losses);
}

// startGame initializes new values and makes the game ready for play
function startGame() {
	// Set New Target
	targetNumber = Math.floor(19 + (Date.now() / Math.random()) % 101);
	// Set the buttons
	for(var i=0;i<buttonValue.length;i++)
	{
		buttonValue[i] = Math.floor(1 + (Date.now() / Math.random()) % 12);
	}
	// Reset the user's score
	accumulatedValue = 0;
	// Output
	toHTML("start");
}

// endGame is envoked when a winning or losing condition exists
// Argument "isWin" is a boolean on if a win condition exists
// Alerts a message based on a win or a loss
function endGame(isWin)
{
	if(isWin)	// if a win
	{
		alert("You Win the Internets");
		wins++;
	}
	else	// must be a loss
	{
		alert("You lost, you went over by \n" + (accumulatedValue-targetNumber));
		losses++;
	}
	// Start a new game
	startGame();
}

//toHTML is the only function that writes output (primarlly to the HTML document)
//Argument "type" is a String to output to the console for debug purposes
//uses jQuery to write to the divs that have certain ids.
function toHTML(type)
{
	debugOut(type);	//debug
	// write out target
	$("#target-score").html("Target: " + targetNumber);	
	// write wins/losses
	$("#wins").html("Wins: " + wins);
	$("#losses").html("Losses: " + losses);
	// write accumulated score
	$("#user-score").html(accumulatedValue);
}

//************************************************************
//Main execution code, executes when page is completed loading
//************************************************************
$(document).ready(function () {
	//begin game
	startGame();
	//capture image clicks
	$(document).on("click", "img", function () {
		//determine image clicked
		var currentId = $(this).attr('id');	// extract id of the image clicked
		if (currentId.includes("image-")) {	// if it is a image-# id then
			var buttonPress = parseInt(currentId.charAt(currentId.length - 1))	// which image pressed (number)
			accumulatedValue += buttonValue[buttonPress - 1];	// add that value to the running total
			// if($(this).is("#image-1"))	//guaranteed code - sloppy
			// 	accumulatedValue+=buttonValue[0];
		}
		//output new total to page
		toHTML("Pressed "+currentId);
		//evaluate win or lose condition
		if(accumulatedValue >= targetNumber)
			endGame(accumulatedValue == targetNumber);
	});
});

