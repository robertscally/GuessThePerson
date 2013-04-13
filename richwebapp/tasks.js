Players = new Meteor.Collection("players");
Images = new Meteor.Collection("images");

if (Meteor.isClient) 
{
  Template.hello.greeting = function () 
  {
    return "Welcome to tasks my man.";
  };

  Template.hello.helloCont = function()
  {
    return Images.find({});
  };

  Template.hello.events(
  {
    'click input' : function () 
    {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
      {
        console.log("You pressed the button");
      }
    }
  });
}
if (Meteor.isClient) 
{
  Meteor.startup(function () 
  {
    // code to run on server at startup
    
  });

}

//Images.insert({name: "george.jpg", answer: "George Orwell"});
