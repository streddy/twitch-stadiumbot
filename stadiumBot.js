/*-----------------------------------------------------------------------------
Twitch StadiumBot
Authors:
   Sanjeev Reddy
   Anfernee Goon
   Sean Oh
   Jimmy Yan
-----------------------------------------------------------------------------*/

/* GLOBAL VARIABLES */

/* General */
var streamhost = "tikkaman";
var users = {};

/* Wave variables */
var waveStartCounter = 0;
var waveStarted = false;
var waveMessage = "Kappa";
var waveCounter = 0;
var startTime = Date.now();
var commentCount = 0;

/* Fightme variables */
var fightStarted = false;
var teamOneCount = 0;
var teamTwoCount = 0;
var teamOne = {};
var teamTwo = {};
var fightMessage = "KAPOW"


/* KissCam variables */
var kisser1;
var kisser2;
var kissmode = false;
var kisser1consent = false;
var kisser2consent = false;

/*---------------------------------------------------------------------------*/

/* HELPER FUNCTIONS */

/* Called when wave is started */
var waveInitiate = function() {
   client.action(streamhost,
                 "Let's start a Kappa wave!! (Type Kappa to participate)");
   waveStarted = true;
   waveCounter = 0;
   setTimeout(waveFinish, 10000);
};

/* Called when wave is finished */
var waveFinish = function() {
  /* More than 5 waves per second */
  if (waveCounter / 5.0 >= 1) {
    client.action(streamhost, "Nice wave!!!");

  /* Bad wave */
  } else {
    client.action(streamhost, "Terrible wave!!!");
  }

  /* Reset wave variables */
  waveStarted = false;
  waveStartCounter = 0;
  waveCounter = 0;
  commentCount = 0;
}

/* Checks every 10 seconds whether the chat is idle enough to start a wave */
setInterval(function() {
  var delta = (Date.now() - startTime) * 1000;
  if (!waveStarted && !fightStarted) {
    if ((commentCount / delta) < 5) {
      waveInitiate();
    }
  }
  startTime = Date.now();
}, 20000);

/* Called when Fightme is finished */
var fightFinish = function() {
  if (teamOneCount > teamTwoCount) {
    client.action(streamhost, "Team Kappa Wins!!");
  }

  else if (teamTwoCount > teamOneCount) {
    client.action(streamhost, "Team Kreygasm Wins!!");
  }

  else {
    client.action(streamhost, "Tie!")
  }

  fightStarted = false;
  teamOneCount = 0;
  teamTwoCount = 0;
}

/* Reset kiss global variables */
function resetKiss() {
   kissmode = false;
   kisser1consent = false;
   kisser2consent = false;
}

/*---------------------------------------------------------------------------*/

/* BOT AND EVENT HANDLING */

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

/* Connect client */
var client = new tmi.client(options);
client.connect();

/* Output welcome message */
client.on("connected", function (address, port) {
   client.action(streamhost,
                 "You are now on a StadiumBot enabled chat! Type '!stadiumhelp' for a list of cool features.");
});

/* Handle users leaving channel */
client.on("part", function(channel, username, self) {
   console.log(username + " is parting");
   if (users[username] === true) {
      delete users[username];
   }
});

/* Command handling */
client.on("chat", function (channel, user, message, self) {
   if (self) return;

   /* Add username to users associative array */
   console.log(user.username);
   users[user.username] = true;

   /* Handle wave behavior */
   if (waveStarted) {
      if (message.indexOf(waveMessage) !== -1) {
         waveCounter++;
      }
      return;
   }

   /* Handle fight behavior */
   if (fightStarted) {
     
     /* User is part of fight */
     if (teamOne.hasOwnProperty(user.username) || teamTwo.hasOwnProperty(user.username)) {
       var splitMessage = message.split(" ");
       var kapowCounter = 0;

       /* Count number of KAPOWs */
       for (var i = 0; i < splitMessage.length; i++) {
         if (splitMessage[i] === "KAPOW") {
           kapowCounter++;
         }
       }

       if (teamOne.hasOwnProperty(user.username)) {
         teamOneCount += kapowCounter;

       } else {
         teamTwoCount += kapowCounter;
       }
     }
     return;
   }

   /* Handle kissing prompts */
   if (kissmode) {

      /* Kisser 1 no consent */
      if (user.username === kisser1 && message.toUpperCase() === "NO") {
         if (kisser1consent === false) {
            client.action(streamhost,
                          "<3 @" + kisser1 + " DOESN'T WANT TO KISS :( <3");
            resetKiss();
         }

      /* Kisser 2 no consent */
      } else if (user.username === kisser2 && message.toUpperCase() === "NO") {
         if (kisser2consent === false) {
            client.action(streamhost,
                          "<3 @" + kisser2 + " DOESN'T WANT TO KISS :( <3");
            resetKiss()
         }

      /* Kisser1 wants to kiss */
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

      /* Kisser2 wants to kiss */
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

   /* Help message */
   if (message === "!stadiumhelp") {
      client.action(streamhost,
                    "Here's a list of commands to give the chat a big stadium feel!");
      client.action(streamhost,
                    "!forthebold: Feeling hungry? Request some Doritos!");
      client.action(streamhost,
                    "!yoquiero: Yo quiero Taco Bell.");
      client.action(streamhost,
                    "!wave : Start a Kappa wave! Complete the wave for a treat!");
      client.action(streamhost,
                    "!fightme: A brawl erupted in the stadium! Spam that KAPOW emote to come out on top!");
      client.action(streamhost,
                    "!kisscam: Make two users express their love for eachother <3");
      client.action(streamhost,
                    "!propose_'username': Embarass the love of your life in front of the stadium!");
   }

   /* Food messages */
   if (message === "!forthebold") {
      client.action(streamhost,
                    "~~~ DoritosChip DoritosChip DoritosChip DoritosChip DoritosChip ~~~");
   }

   if (message === "!yoquiero") {
      client.action(streamhost,
                    "~~~ TBTacoLeft TBTacoRight TBTacoLeft TBTacoRight ~~~");
   }

   /* Wave */
   if (message === "!wave") {
     waveStartCounter++;
     if (waveStartCounter >= 2) {
       waveInitiate();
     }
   }

   if (message === "!fightme") {
     var userArr = Object.keys(users);
     fightStarted = true;
     for (var i = 0; i < Math.floor(userArr.length / 2); i++) {
       teamOne[userArr[i]] = true;
       client.whisper(userArr[i], "You are fighting on Team Kappa!");
     }

     for (var i = Math.ceil(userArr.length / 2); i < userArr.length; i++) {
       teamTwo[userArr[i]] = true;
       client.whisper(userArr[i], "You are fighting on Team Kreygasm!");
     }

     setTimeout(fightFinish, 7000);
     teamOneCount = 0;
     teamTwoCount = 0;
   }

   /* Kisscam */
   if (message === "!kisscam") {
      var userArr = Object.keys(users);

      client.action(streamhost,
                    "<3 WELCOME TO KISSCAM <3");

      /* If there is only one recorded user */
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

   /* For wave counting */
   commentCount++;
});
