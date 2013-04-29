

var counter = 10;
var level = 1;
var numImages = 10;

if (Meteor.isClient) 
{
	
	Meteor.subscribe("players");
  	Meteor.subscribe("users");
  	Meteor.subscribe("guesses");
  	Meteor.subscribe("images");
	
	Players = new Meteor.Collection("players");
	Images = new Meteor.Collection("images");
	Leaderboard = new Meteor.Collection("leaderboard");
	Guesses = new Meteor.Collection("guesses");
	
	
	Accounts.ui.config({
	
  		passwordSignupFields: 'USERNAME_ONLY'
	
	});	
	
	countDownGuess = function (ans) 
	{
		if((counter-1) > 0)
	  	{
	  		$("#guessCounter").html(--counter);	
	  	}
	  	else
	  	{
	  		$("#answer").html("<strong>"+getFamousName()+"</strong>");
	  		displayMessage("Answer: "+getFamousName());
	  		
		  	nextLevel();
	  	}
	};
  
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
  
  getFamousName = function () 
  {
  	var n = {};
	n['level'] = level;
  	
  	var famousName = Images.findOne(n);
  	
  	return famousName.answer;
  };
  
  getFamousNameList = function () 
  {	
  	 //return Images.find({answer});
  };
  
  correctGuess = function (guess) 
  {
  	var n = {};
	n['level'] = level;
  	
  	var answer = Images.findOne(n);
  	
  	answer.answer.replace(/\s+/g, '');//replace(" ","");
  	guess.replace('&nbsp;', '');
  	guess.replace(/\s+/g, '');//replace(" ","");
  	
  	var distance = levenshtein(answer.answer, guess);
  	
  	if(distance > -1 && distance < 5)
  	{
  		return true;
  	}
  	else
  	{
  		return false;
  	}
  };

  displayMessage = function(message)
  {	
  	$('#alert').html('<div class="alert"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
  	
  	Meteor.setTimeout(function(){$('#alert').val('');}, 5000)
  };
  
  Template.leaderBoard.getTopPlayers = function()
  {
  	return Players.find({}, {sort: {score: '-1'}, limit: 5});
  };
  
  Template.guessBox.getGuesses = function()
  {
    	return Guesses.find({}, {sort: {date: '-1'}, limit: 5});
  };
  
  Template.leaderBoard.getUserName = function()
  {
  	
  };
  
  Template.makeGuess.rendered = function()
  {
  	
  	
  	var names = new Array("GeorgeOrwell","Sergey Brin","MarkZuckerberg","LeonardoDicaprio","OzzyOsbourne","BobMarley","MilaKunis","LiamNeeson","AngelinaJolie","JohnLennon");
  	
  	
  	//var theNames = EJSON.stringify(names);
  	//$("input").attr("data-source",'["Goodbye"]');
  	$("#guessCont").html("<input id=\"guessInput\" type=\"text\" autofocus placeholder=\"Make a guess\" data-provide=\"typeahead\" data-source="+names+" />");
  };
  
  /*
  $('#guessInput').typeahead(
  
	  {
		source: [ 'michael martin', 'john smith']
	  }
  );*/
  
  
  
  
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
 
	makeAGuess = function()
	{

			// template data, if any, is available in 'this'
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
	
	
				if(typeof Players.findOne(m) === 'undefined')
				{
					console.log("Inserting new player!");
				
					Players.insert(n);
				}			    
	    	
			 	var aPlayer = Players.findOne({username: Meteor.user().username});
				Session.set("player_id",aPlayer._id);

				var currentUsername = Meteor.user().username;
			
			 	var n = {};
				n['guess'] = guess;
				n['username'] = currentUsername;
				n['correct'] = correctGuess(guess);
				n['date'] = new Date();
			 	
			 	console.log(guess);
			 	
			 	Guesses.insert(n);
			 	
			 	var m = {};
				m['score'] = 10;
			 	
			 	if(correctGuess(guess))
			 	{	
				 	var p = {};
					p['_id'] = Session.get("player_id");
				
			 		Players.update(p,{ $inc: m});
			 		//$("#guessCounter").html(10);
			 		nextLevel();
			 		displayMessage("You Win!");	
		  			console.log("You Won!!!");
		 		}
		 		else
		 		{
				 	countDownGuess();
		    		}
		 }
     
  };
  
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
if (Meteor.isServer) 
{
	Players = new Meteor.Collection("players");
	Images = new Meteor.Collection("images");
	Leaderboard = new Meteor.Collection("leaderboard");
	Guesses = new Meteor.Collection("guesses");

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
    
    // code to run on server at startup
    
  });
//console.log(Meteor.user().profile.name);
}

