Players = new Meteor.Collection("players");
Images = new Meteor.Collection("images");
Leaderboard = new Meteor.Collection("leaderboard");
Guesses = new Meteor.Collection("guesses");

var counter = 10;
var level = 1;
var numImages = 10;

if (Meteor.isClient) 
{
	//$("img").attr("src",level+".jpg");	
	
  countDownGuess = function (ans) 
  {
  	if((counter-1) > 0)
  	{
  		$("#guessCounter").html(--counter);	
  	}
  	else
  	{
  		var n = {};
		n['level'] = level;
	  	
	  	//var answer = ;
  	
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
  		$("#guessInput").html("");
  		$("#guessCounter").html(counter);	
  		$("#answer").html("George Orwell");
  	}
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

  Template.hello.getPhoto = function()
  {	
  	
			
				
	    //return Images.findOne(n);
  };
  
  Template.leaderBoard.getTopPlayers = function()
  {
    return Leaderboard.find({}, {sort: {score: '-1'}, limit: 10});
  };
  
  Template.guessBox.getGuesses = function()
  {
    return Guesses.find({}, {sort: {date: '-1'}, limit: 10});
  };
  
  Template.leaderBoard.getUserName = function()
  {
	  var user = Meteor.user();
	  if (user && user.emails)
	  {
	  	console.log(user._id);
	  	console.log(user.username);
	  	console.log(user.emails[0].address);
	    return user.emails[0].address;
	  } 
  };
  
  Template.makeGuess.events(
  {
    'click .guess' : function () 
    {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
      {
      	var str = $("#guessInput").val();
      	
//      	$(this).html("hello");
      	
      	var n = {};
		n['guess'] = str;
		n['user'] = Players.findOne({_id: Meteor.userId()});
		n['date'] = new Date();
      	
      	console.log(str);
      	
      	Guesses.insert(n);
      	
      	if(correctGuess())
      	{
      		$("#guessCounter").html(10);	
  			console.log("You Won!!!");
      	}
      	else
      	{
	      	countDownGuess();
	    }
      }
     }
  });
  
  Template.hello.events(
  {
    'click input' : function () 
    {
    	
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
      {
      	var user = Meteor.user();
		Players.update(
	   { _id: Meteor.userId() },
	   {
	     $set: { username: "robobear" },
	   });
	   
	   //Players.insert({name: "John Paul", score: "20"});
	    console.log("Username updated"+ Players.findOne({username: "robobear"}));
      	//updateUsername();
       
      }
    }
  });
}
if (Meteor.isServer) 
{
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
  
  Meteor.startup(function () 
  {
  	
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
    Accounts.onCreateUser(function(options, user) 
    {
 		//console.log("New user created!" + user.emails[0].address);
    });
  });
//console.log(Meteor.user().profile.name);
}

//Images.insert({name: "george.jpg", answer: "George Orwell"});
