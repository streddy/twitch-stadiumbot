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
      username: "kale420sd",
      password: "oauth:g9iue67zqvnrh9f4l8zspeidr94th6"
   },
   channels: ["tikkaman"]
};

var client = new tmi.client(options);
client.connect();

client.on("connected", function (address, port) {
   client.action("tikkaman",
                 "You are now on a KissCam enabled chat! Make two users express their love for each other by typing '!kisscam'");
});
