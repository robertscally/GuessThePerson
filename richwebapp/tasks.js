

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
    	
	//$("img").attr("src",level+".jpg");	
	
  countDownGuess = function (ans) 
  {
  	if((counter-1) > 0)
  	{
  		$("#guessCounter").html(--counter);	
  	}
  	else
  	{
  		//$("#answer").html("<strong>"+getFamousName()+"</strong>");
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
  
  correctGuess = function (guess) 
  {
  	var n = {};
	n['level'] = level;
  	
  	var answer = Images.findOne(n);
  	
  	if(guess == answer.answer)
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
  	
  	/*
	  var user = Meteor.user();
	  if (user && user.emails)
	  {
	  	console.log(user._id);
	  	console.log(user.username);
	  	console.log(user.emails[0].address);
	    return user.emails[0].address;
	  }*/ 
  };
  
  Template.makeGuess.events(
  {
  	'click .guess' : function () 
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
     }
  });
  
  
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

	/*Accounts.onCreateUser(function(options, user) 
    	{
    		//var user = Meteor.user();
		//Meteor.users.find({ _id: Meteor.userId() },{$set: { 'username': 'robscally' },});
   		
    		var n = {};
		n['user_id'] = user._id;
		n['username'] = user.username; //emails[0].address;
		n['score'] = 0;
		//n[] = ;
		
    		Players.insert(n);
 		
 			
 		console.log("New user created! " + user._id +" "+ user.username);
    	});*/
    
	/*
	Meteor.publish('updateUsername', function () {
  	var user = Meteor.user();
	Meteor.users.update(
   	{ _id: Meteor.userId() },
   	{
     		$set: { 'username': 'robscally' },
   	});
   
    	console.log("Username updated"+user.username);
	});
	updateUsername = function()
	{
	var user = Meteor.user();
	Meteor.users.update(
   { _id: Meteor.userId() },
   {
     $set: { 'username': 'robscally' },
   });
   
    console.log("Username updated"+user.username);
 };
  */
 
  Meteor.startup(function () 
  {
  	//Guesses.remove({});
	//Players.remove({});
  	//Images.remove({});
  	/*level = 1;*/
  	/*Images.insert({level: 1, name: "1.jpg", answer: "George Orwell"});
  	Images.insert({level: 2, name: "2.jpg", answer: "Sergey Brin"});
  	Images.insert({level: 3, name: "3.jpg", answer: "Mark Zuckerberg"});
  	Images.insert({level: 4, name: "4.jpg", answer: "Leonardo Dicaprio"});
  	Images.insert({level: 5, name: "5.jpg", answer: "Ozzy Osbourne"});
  	Images.insert({level: 6, name: "6.jpg", answer: "Bob Marley"});
  	Images.insert({level: 7, name: "7.jpg", answer: "Mila Kunis"});
  	Images.insert({level: 8, name: "8.jpg", answer: "Liam Neeson"});
  	Images.insert({level: 9, name: "9.jpg", answer: "Angelina Jolie"});
  	Images.insert({level: 10, name: "10.jpg", answer: "John Lennon"});
  	*/
  	
  	//Uncomment folowing to remove all data from a database
  	//Guesses.remove({});
    
    // code to run on server at startup
    
  });
//console.log(Meteor.user().profile.name);
}

