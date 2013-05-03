/* Global variables */
var counter = 10;
var level = 1;
var numImages = 10;

/* Code which is run on the client */
if (Meteor.isClient) 
{
	/* Subscribe to collections on server */
	Meteor.subscribe("players");
  	Meteor.subscribe("users");
  	Meteor.subscribe("guesses");
  	Meteor.subscribe("images");
	
	/* Create collections on the client side */
	Players = new Meteor.Collection("players");
	Images = new Meteor.Collection("images");
	Leaderboard = new Meteor.Collection("leaderboard");
	Guesses = new Meteor.Collection("guesses");
	
	
	/* Configure the sign in / create account user interface so 
	   that only a username and password are required */
	Accounts.ui.config(
	{
  		passwordSignupFields: 'USERNAME_ONLY'
	});	
	
	
	/* Function to count down the number of guesses counter */
	countDownGuess = function (ans) 
	{
		/* If counter is more than 0, decrement the counter */
		if((counter-1) > 0)
	  	{
	  		$("#guessCounter").html(--counter);	
	  	}
	  	else
	  	{
	  		/* Else the number of allowed guesses has been used and 
	  		   the answer must be displayed */
	  		$("#answer").html("<strong>"+getFamousName()+"</strong>");
	  		displayMessage("Answer: "+getFamousName());
	  		
	  		// move on to the next level
		  	nextLevel();
	  	}
	};
  
  
  	/* Function to move onto the next level in the game */
	nextLevel = function () 
	{
		if ((level+1) <= numImages)
		{
			level = level+1;
		}
		else
		{ 
			level = 1;
		}
	
		$("img").attr("src",level+".jpg");
	
		counter = 10;
	
		$("#guessCounter").html(counter);	
	};

	
	/* Function to get the famous name answer for the current level */
	getFamousName = function () 
	{
		var n = {};
		n['level'] = level;

		var famousName = Images.findOne(n);

		return famousName.answer;
	};
	
	
  	/* Function to check if the users guess is correct */
	correctGuess = function (guess) 
	{
		var n = {};
		n['level'] = level;

		// get the answer from the images collection for current level
		var answer = Images.findOne(n);

		// remove any white space from the users guess and from the 
		// correct answer stored in the collection
		answer.answer.replace(/\s+/g, '');
		guess.replace('&nbsp;', '');
		guess.replace(/\s+/g, '');

		// use the levenshtein algorithm to check if the
		// users guess matches the correct answer or is almost
		// correct
		var distance = levenshtein(answer.answer, guess);

		/* If the distance is greater than -1 and less than 5 
		   then the guess is correct else return false */
		if(distance > -1 && distance < 5)
		{
			return true;
		}
		else
		{
			return false;
		}
	};

	
	/* Function to display a message to the user */
	displayMessage = function(message)
	{	
		$('#alert').html('<div class="alert"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');

		Meteor.setTimeout(function(){$('#alert').val('');}, 5000)
	};
  
  
  	/* This function finds the top 5 players from the players
	   collection and sorts them by highest score */
	Template.leaderBoard.getTopPlayers = function()
	{
		return Players.find({}, {sort: {score: '-1'}, limit: 5});
	};

	
	/* This function finds the last 5 guesses from the guesses
	   collection and sorts them by date descending */
	Template.guessBox.getGuesses = function()
	{
		return Guesses.find({}, {sort: {date: '-1'}, limit: 5});
	};


	/* This function is called when the makeGuess template 
	   is first rendered */
	Template.makeGuess.rendered = function()
	{
		// generate an input box to allow the user to guess 
		$("#guessCont").html("<input id=\"guessInput\" type=\"text\" autofocus placeholder=\"Make a guess\" />");
	};


  	/* Whenever the enter key is pressed inside the guess 
  	   input box, the makeAGuess function is called */
	Template.makeGuess.events(
	{
		"keydown #guessInput": function(event)
		{	
			if(event.which == 13)
			{
				makeAGuess();
			}
		}
	});
 
 	
 	/* Whenever the enter key is pressed inside the guess 
  	   input box, the makeAGuess function is called */
	makeAGuess = function()
	{
		if (typeof console !== 'undefined')
		{
			var guess = $("#guessInput").val();

			$("#guessInput").val('');
			 
			var user = Meteor.user();
			 	
			var n = {};
			n['user_id'] = Meteor.userId();
			n['username'] = user.username;
			n['score'] = 0;

			console.log(Meteor.userId() + " " + user.username);

			var m = {};
			m['username'] = Meteor.user().username;


			/* If the logged in player is not in the players
			   collection then insert the current logged in 
			   user into the players collection */
			if(typeof Players.findOne(m) === 'undefined')
			{
				console.log("Inserting new player!");

				Players.insert(n);
			}			    


			/* Find the player in the players collection which has the 
			   current logged in users username */
			var aPlayer = Players.findOne({username: Meteor.user().username});
			Session.set("player_id",aPlayer._id);


			var currentUsername = Meteor.user().username; // get the current users username
			

			/* Used to create an object of the users guess,
			   username and the time the guess was made */
			var n = {};
			n['guess'] = guess;
			n['username'] = currentUsername;
			n['correct'] = correctGuess(guess);
			n['date'] = new Date();

			console.log(guess);

			Guesses.insert(n); // insert a new guess 

			var m = {};
			m['score'] = 10;

			/* Check if the guess is correct */
			if(correctGuess(guess))
			{	
			 	var p = {};
				p['_id'] = Session.get("player_id");

				Players.update(p,{ $inc: m}); // update the players score
				
				nextLevel(); // go onto the next level
				
				displayMessage("You Win!");	// display a message to the user when they win
				
				console.log("You Won!!!");
			}
			/* If guess is not correct then countdown the number of guesses allowed */
			else
			{
			 	countDownGuess();
			}
		}
	};
  
  	/* Levenshtein function sourced from a third party to enable
  	   the user to get points for an guess even if it is not 100%
  	   correct  */
	levenshtein = function(s1, s2) 
	{
		// http://kevin.vanzonneveld.net
		// +            original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
		// +            bugfixed by: Onno Marsman
		// +             revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
		// + reimplemented by: Brett Zamir (http://brett-zamir.me)
		// + reimplemented by: Alexander M Beedie
		// *                example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
		// *                returns 1: 3
		if (s1 == s2) {
		return 0;
		}

		var s1_len = s1.length;
		var s2_len = s2.length;
		if (s1_len === 0) {
		return s2_len;
		}
		if (s2_len === 0) {
		return s1_len;
		}

		// BEGIN STATIC
		var split = false;
		try {
		split = !('0')[0];
		} catch (e) {
		split = true; // Earlier IE may not support access by string index
		}
		// END STATIC
		if (split) {
		s1 = s1.split('');
		s2 = s2.split('');
		}

		var v0 = new Array(s1_len + 1);
		var v1 = new Array(s1_len + 1);

		var s1_idx = 0,
		s2_idx = 0,
		cost = 0;
		for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
		v0[s1_idx] = s1_idx;
		}
		var char_s1 = '',
		char_s2 = '';
		for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
		v1[0] = s2_idx;
		char_s2 = s2[s2_idx - 1];

		for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
		 char_s1 = s1[s1_idx];
		 cost = (char_s1 == char_s2) ? 0 : 1;
		 var m_min = v0[s1_idx + 1] + 1;
		 var b = v1[s1_idx] + 1;
		 var c = v0[s1_idx] + cost;
		 if (b < m_min) {
		   m_min = b;
		 }
		 if (c < m_min) {
		   m_min = c;
		 }
		 v1[s1_idx + 1] = m_min;
		}
		var v_tmp = v0;
		v0 = v1;
		v1 = v_tmp;
		}
		
		return v0[s1_len];
	};  
}

/* Code which is run on the server */
if (Meteor.isServer) 
{
	/* Create collections on the server */
	Players = new Meteor.Collection("players");
	Images = new Meteor.Collection("images");
	Leaderboard = new Meteor.Collection("leaderboard");
	Guesses = new Meteor.Collection("guesses");

	/* The following publish the collections on 
	   the server to the client */
	Meteor.publish("players", function () 
	{
  		return Players.find(); // everything
	});
	
	Meteor.publish("guesses", function () 
	{
  		return Guesses.find(); // everything
	});
	
	Meteor.publish("images", function () 
	{
  		return Images.find(); // everything
	});
	
	Meteor.publish("users", function () 
	{
  		return Meteor.users.find({}); // everything
	});
 
  Meteor.startup(function () 
  {
  	//$("body").html("<script src=\"levenstein.js\"></script>");
  
  	//Guesses.remove({});
	//Players.remove({});
  	//Images.remove({});
  	/*level = 1;*/
  	Images.insert({level: 1, name: "1.jpg", answer: "George Orwell"});
  	Images.insert({level: 2, name: "2.jpg", answer: "Sergey Brin"});
  	Images.insert({level: 3, name: "3.jpg", answer: "Mark Zuckerberg"});
  	Images.insert({level: 4, name: "4.jpg", answer: "Leonardo Dicaprio"});
  	Images.insert({level: 5, name: "5.jpg", answer: "Ozzy Osbourne"});
  	Images.insert({level: 6, name: "6.jpg", answer: "Bob Marley"});
  	Images.insert({level: 7, name: "7.jpg", answer: "Mila Kunis"});
  	Images.insert({level: 8, name: "8.jpg", answer: "Liam Neeson"});
  	Images.insert({level: 9, name: "9.jpg", answer: "Angelina Jolie"});
  	Images.insert({level: 10, name: "10.jpg", answer: "John Lennon"});
  	
  	
  	//Uncomment folowing to remove all data from a database
  	//Guesses.remove({});
    
  });
}

