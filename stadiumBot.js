
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
   channels: ["tikkaman"]
};

var client = new tmi.client(options);
client.connect();

client.on("connected", function (address, port) {
   client.action("tikkaman",
                 "You are now on a StadiumBot enabled chat! Type '!stadiumhelp' for a list of cool features.");
});

client.on("chat", function (channel, user, message, self) {
   if (self) return;

   if (message === "!stadiumhelp") {
      client.action("tikkaman",
                    "Here's a list of commands to give the chat a big stadium feel!\n!wave : Start a Kappa wave! Complete the wave for a treat!\n!neckbeard: Feeling hungry? Request some Doritos!\n!yoquiero: Yo quiero Taco Bell.\n!supersmash: A brawl erupted in the stadium! Spam that KAPOW emote to come out on top!\n!kisscam: Make two users express their love for eachother <3 \n!propose_'username': Embarass the love of your life in front of the stadium!\n");
   }

   if (message === "!kisscam") {   
      client.action("tikkaman", "<3 WELCOME TO KISSCAM <3");
   }
});
