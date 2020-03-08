/***** SERVER side ******/

var express = require('express'); //like #include
var app = express();  // include this no parameter function in express
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var userlist = [];
var userCtr = 0;

//TODO
// need to send userCTR to user wwhen they connect -> this will be their identifier.




app.use(express.static(__dirname)); // serve the folder index.js is in


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    userCtr += 1;


    console.log('a user connected');

    socket.emit('userID', userCtr); //send user number/ID to new connected client
    socket.on('userID', function(username){
      socket.name = username;
      userlist.push(socket.name);
      console.log('users: ' + userlist);
      io.emit('newUser', userlist); //  send new userlist to all clients
    });
    
    
    
    socket.on('disconnect', function(){
      
      //todo remove from userlist
      userlist.splice(userlist.indexOf(socket.name), 1);
      console.log('user disconnected: ' + socket.name);
      io.emit('newUser', userlist); //  send new userlist to all clients
      
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){                           // on "connection" event from client...
    socket.on('chat message', function(msg, userID){            // on "chat message" event from client...
        io.emit('chat message', userID + ": " + msg); // we emit the chat message to every client including sender
    });
  });


//todo: Event handler for changing username
// probably a search function to find username in array

//can use this search to delete and rename users
// function findUser(username){
//   let found = false;
//   let i = 0;

//   while(!found || i <= userlist.length){
//     if(userlist[i] == username){
//       found = true;
//     }else{
//       i++;
//     }
//   }
//   return i;
// }

