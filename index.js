var express = require('express'); //like #include
var app = express();  // include this no parameter function in express
var http = require('http').createServer(app);
var io = require('socket.io')(http);


var userCtr = 0;
//var $textIn = $('m');
// var chatWindow = document.getElementById('chat-window');
// var textIn = dopcument.getElementById('m');




app.use(express.static(__dirname)); // serve the folder index.js is in


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    userCtr += 1;
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', "User " + userCtr + ": " + msg); // *********
    });
  });


