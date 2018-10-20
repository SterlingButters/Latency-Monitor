// - Get connected public ip: `netstat -tn 2>/dev/null | grep .3000 | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head`
// - Ping that ip: `ping -c 10 -i .5 -W 3 <ipPublic>`
// - Plot RTT vs time using plotly:
//   - https://plot.ly/javascript/time-series/

var port = 3000;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var ping = require ("net-ping");
var io = require('socket.io')(server);

var clientIp = null;
var clientPort = null;
var clientHostname = null;

app.set('trust proxy', true);
app.use(function (req, res, next) {
  clientIp = req.ip;
  clientPort = req.connection.remotePort;
  clientHostname = req.hostname;
  next()
});

app.use(express.static(__dirname + '/'));

server.listen(port, function(){
  console.log(`Listening on http://127.0.0.1:${port}`);
});

var openURL = require('opn');
console.log("Opening Server URL")
openURL(`http://127.0.0.1:${port}`);

// net-ping; also try node-ping-wrapper
var options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 56,
    retries: 1,
    // sessionId: (process.pid % 65535),
    timeout: 2000,
    ttl: 64 // 128
};

var session = ping.createSession (options);
var interval = 500;

io.on('connection', function (socket) {
  setTimeout(function() {
    console.log(clientIp)
    console.log(clientPort)
    console.log(clientHostname);

    // var target = clientHostname; // TODO: May need 'req.ip' later
    // var target = "";

    setInterval(function() {
      session.pingHost(target, function (error, target, sent, rcvd) {
        var ms = rcvd - sent;
        if (error)
          console.log (target + ": " + error.toString());
        else
          console.log (target + ": Alive (ms=" + ms + ")");
          if (ms < 2000) {
            socket.emit('latency', {latency: ms, time: sent});
          }
      });
    }, interval);
  }, interval);
});

// const spawn = require("child_process").spawn;
// console.log(`Determining public ip\'s connected to port ${port}`);
//
// let output = [];
//
// const proc = spawn('sh', [
//   '-c',
//   `netstat -nat | grep ${port}.*ESTABLISHED | awk '{print $5}' | grep -v .*${port}`
// ]);
//
// proc.stdout.on('data', (chunk) => {
//   console.log(chunk.toString())
//   output.push(chunk.toString().substring(0, chunk.toString().lastIndexOf(".")));
// });
//
// proc.stderr.on('data', (chunk) => {
//   console.log(chunk.toString());
// });
//
// proc.on('error', (err) => {
//   console.error(err);
// });
//
// proc.on('exit', (code) => {
//   console.log(`Public ip address of client connected to port ${port}: ` + output);
//   console.log("Number of ip connection instances: " + output.length)
//   var ipPublic;
//   if (output.length > 1) {
//     console.log("Multiple ip addresses connected to port. Taking last...")
//     ipPublic = output[output.length-1];
//   }
//   else {ipPublic = output}
//
//   console.log("Pinging public ip address")
//   var pingPublic = spawn('sh', ['-c',
//   `ping -c 10 -i .5 -W 3 ${ipPublic} | awk '{print $7}'`
// ]);
//
//   pingPublic.stdout.on('data', function(chunk){
//       var textChunk = chunk.toString('utf8');
//       console.log(textChunk);
//   });
// });
