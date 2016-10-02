// GLOBAL VARIABLES
// stream host
var streamhost = "tikkaman";
// users associated array to store users who have commented
var users = {};
// are we in kiss mode?
var kissmode = false;
// kissers
var kisser1;
var kisser2;
// kisser consent
var kisser1consent = false;
var kisser2consent = false;

function resetKiss() {
   kissmode = false;
   kisser1consent = false;
   kisser2consent = false;
}

var tmi = require('tmi.js');

var options = {
   options: {
      debug: true
   },
   connection: {
      cluster: "aws",
      reconnect: true
   },
   identity: {
      username: "StadiumBot",
      password: "oauth:37uvk4q1sad6msm7tojm2jatoah9gl"
   },
   channels: [streamhost]
};

// connect client
var client = new tmi.client(options);
client.connect();

// output welcome message
client.on("connected", function (address, port) {
   client.action(streamhost,
                 "You are now on a StadiumBot enabled chat! Type '!stadiumhelp' for a list of cool features.");
});

// when user leaves channel
client.on("part", function(channel, username, self) {
   console.log(username + " is parting");
   if (users[username] === true) {
      delete users[username];
   }
});

// command handling
client.on("chat", function (channel, user, message, self) {
   if (self) return;
   
   // add username to users associative array
   console.log(user.username);
   users[user.username] = true;

   // handle kissing prompts
   if (kissmode === true) {

      // kisser 1 no consent
      if (user.username === kisser1 && message.toUpperCase() === "NO") {
         if (kisser1consent === false) {
            client.action(streamhost,
                          "<3 @" + kisser1 + " DOESN'T WANT TO KISS :( <3");
            resetKiss();
         }
      
      // kisser 2 no consent
      } else if (user.username === kisser2 && message.toUpperCase() === "NO") {
         if (kisser2consent === false) {
            client.action(streamhost,
                          "<3 @" + kisser2 + " DOESN'T WANT TO KISS :( <3");
            resetKiss()
         }
      
      // kisser1 wants to kiss
      } else if (user.username === kisser1 && message.toUpperCase() === "YES") {
         if (kisser2consent === true) {
            client.action(streamhost,
                          "<3 THEY KISSED!! <3");
            resetKiss();
         
         } else {
            client.action(streamhost,
                          "<3 @" + kisser2 + ": @" + kisser1 + " WANTS TO KISS! WHAT DO YOU SAY? (YES/NO) <3");
            kisser1consent = true;
         }

      // kisser2 wants to kiss
      } else if (user.username === kisser2 && message.toUpperCase() === "YES") {
         if (kisser1consent === true) {
            client.action(streamhost,
                          "<3 THEY KISSED!! <3");
            resetKiss();
         
         } else {
            client.action(streamhost,
                          "<3 @" + kisser1 + ": @" + kisser2 + " WANTS TO KISS! WHAT DO YOU SAY? (YES/NO) <3");
            kisser2consent = true;
         }
      }
   }

   // help message
   if (message === "!stadiumhelp") {
      client.action(streamhost,
                    "Here's a list of commands to give the chat a big stadium feel!");
      client.action(streamhost,
                    "!wave : Start a Kappa wave! Complete the wave for a treat!");
      client.action(streamhost,
                    "!forthebold: Feeling hungry? Request some Doritos!");
      client.action(streamhost,
                    "!yoquiero: Yo quiero Taco Bell.");
      client.action(streamhost,
                    "!supersmash: A brawl erupted in the stadium! Spam that KAPOW emote to come out on top!");
      client.action(streamhost,
                    "!kisscam: Make two users express their love for eachother <3");
      client.action(streamhost,
                    "!propose_'username': Embarass the love of your life in front of the stadium!");
   }
   
   // food messages
   if (message === "!forthebold") {
      client.action(streamhost,
                    "~~~ DoritosChip DoritosChip DoritosChip DoritosChip DoritosChip ~~~");
   }

   if (message === "!yoquiero") {
      client.action(streamhost,
                    "~~~ TBTacoLeft TBTacoRight TBTacoLeft TBTacoRight ~~~");
   }

   // kisscam
   if (message === "!kisscam") {
      var userArr = Object.keys(users);

      client.action(streamhost,
                    "<3 WELCOME TO KISSCAM <3");
      
      if (userArr.length < 2) {
         client.action(streamhost,
                       "<3 YOU'RE THE ONLY ONE HERE. WANT TO KISS YOURSELF? <3");
      } else {   
         var userfinder1 = Math.floor(Math.random() * userArr.length);
         var userfinder2 = Math.floor(Math.random() * userArr.length);

         while(userfinder1 === userfinder2) {
            userfinder2 = Math.floor(Math.random() * userArr.length);
         }
      
         kisser1 = userArr[userfinder1];
         kisser2 = userArr[userfinder2];

         client.action(streamhost,
                       "<3 @" + kisser1 + " AND @" + kisser2 + " ARE ON THE KISSCAM <3");
         client.action(streamhost,
                       "<3 WOULD YOU LIKE TO KISS? (YES/NO) <3");
         kissmode = true;
      }
   }
});
