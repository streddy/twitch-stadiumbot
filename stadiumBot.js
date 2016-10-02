
var tmi = require('tmi.js');

/* Global variables */
var streamhost = "tikkaman"

/* Wave variables */
var waveStartCounter = 0;
var waveStarted = false;
var waveMessage = "Kappa";
var waveCounter = 0;
var startTime = Date.now();
var commentCount = 0;

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

var client = new tmi.client(options);
client.connect();

/* Called when wave is started */
var waveInitiate = function() {
   client.action(streamhost, "Let's start a Kappa wave!! (Type Kappa to participate)");
   waveStarted = true;
   waveCounter = 0;
   setTimeout(waveFinish, 10000);
};

/* Called when wave is finished */
var waveFinish = function() {
  /* More than 5 waves per second */
  if (waveCounter / 5.0 >= 1) {
    client.action(streamhost, "Nice wave!!!");
  }

  /* Bad wave */
  else {
    client.action(streamhost, "Terrible wave!!!");
  }

  /* Reset wave variables */
  waveStarted = false;
  waveStartCounter = 0;
  waveCounter = 0;
  commentCount = 0;
}

client.on("connected", function (address, port) {
   client.action(streamhost,
                 "You are now on a StadiumBot enabled chat! Type '!stadiumhelp' for a list of cool features.");
});

client.on("chat", function (channel, streamer, message, self) {
   if (self) return;

   if (waveStarted) {
      if (message === waveMessage) {
         waveCounter++;
      }
      return;
   }

   if (message === "!stadiumhelp") {
      client.action(streamhost,
                    "Here's a list of commands to give the chat a big stadium feel!\n!wave : Start a Kappa wave! Complete the wave for a treat!\n!forthebold: Feeling hungry? Request some Doritos!\n!yoquiero: Yo quiero Taco Bell.\n!supersmash: A brawl erupted in the stadium! Spam that KAPOW emote to come out on top!\n!kisscam: Make two users express their love for eachother <3\n!propose_'username': Embarass the love of your life in front of the stadium!\n");
   }

   if (message === "!neckbeard") {
      client.action(streamhost),
                    "~~~DoritosChip DoritosChip DoritosChip DoritosChip DoritosChip~~~");
   }

   if (message === "!yoquiero") {
      client.action(streamhost,
                    "~~~TBTacoLeft TBTacoRight TBTacoLeft TBTacoRight~~~");
   }

   if (message === "!kisscam") {
      client.action(streamhost, "<3 WELCOME TO KISSCAM <3");
   }

   if (message === "!wave") {
     waveStartCounter++;
     if (waveStartCounter >= 2) {
       waveInitiate();
     }
   }

   commentCount++;
});

/* Checks every 10 seconds whether the chat is idle enough to start a wave */
setInterval(function() {
  var delta = (Date.now() - startTime) * 1000;
  if (!waveStarted) {
    if ((commentCount / delta) < 5) {
      waveInitiate();
    }
  }
  startTime = Date.now();
}, 20000);
