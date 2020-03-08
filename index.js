/***** SERVER side ******/

var express = require('express'); //like #include
var app = express();  // include this no parameter function in express
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var userlist = [];
var usercolors = [];
var userCtr = 0;


app.use(express.static(__dirname)); // serve the folder index.js is in


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    userCtr += 1; // TODO: might do something nicer than just counting, maybe generate a fun nickname
    console.log('a user connected');

    socket.emit('userID', userCtr); //send user number/ID to new connected client
    socket.on('userID', function(username){
      socket.name = username;
      socket.color = '#97abb1'; //default color - might change later
      userlist.push(socket.name);
      usercolors.push(socket.color);
      console.log('users: ' + userlist);
      io.emit('newUser', userlist, usercolors); //  send new userlist to all clients
      io.emit('chat message', username + ' has joined', 'SERVER');   

    });
      
    socket.on('disconnect', function(){  
      let i = userlist.indexOf(socket.name);
      userlist.splice(i, 1);
      usercolors.splice(i, 1);
      console.log('user disconnected: ' + socket.name);
      io.emit('newUser', userlist, usercolors); //  send new userlist to all clients
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){                             // on "connection" event from client...
    socket.on('chat message', function(msg, username, userColor){ // on "chat message" event from client...
    
    /***** Nickname Change  *******/
    let arr = msg.split(/\s+/);

    if(arr[0] == "/nick"){      
        let newName = arr[1];

        if(userlist.includes(newName)){
          socket.emit('chat message', 'That name is already taken!', 'SERVER'); 
        }else{
          userlist[userlist.indexOf(socket.name)] = newName;
          socket.name = newName;
          console.log('new users: ' + userlist);
          io.emit('newUser', userlist, usercolors); //  send new userlist to all clients
          io.emit('chat message', username + ' has changed their name to ' + newName, 'SERVER'); 
        }

    /***** Color Change ******/
      }else if(arr[0] == "/nickcolor"){
        socket.color = '#' + arr[1];
        usercolors[userlist.indexOf(socket.name)] = socket.color;
        console.log("colors: " + usercolors);
         io.emit('newUser', userlist, usercolors); //  send new userlist to all clients
        io.emit('chat message', username + ' has changed their color', 'SERVER'); 

      }else{
        io.emit('chat message', msg, socket.name, socket.color);// we emit the chat message to every client including sender
      }
    });
  });


