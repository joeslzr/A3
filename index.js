/***** SERVER side ******/

var express = require('express'); //like #include
var app = express();  // include this no parameter function in express
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var userlist = [];
var usercolors = [];
var userCtr = 0;

var hist = [];

app.use(express.static(__dirname)); // serve the folder index.js is in


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    userCtr += 1; // TODO: might do something nicer than just counting, maybe generate a fun nickname

    console.log('a user connected');
    socket.emit('userID', userCtr); //send user number/ID to new connected client
    socket.on('userID', function(username){
    let timestamp = getTime();
    socket.name = username;
    socket.color = '#97abb1'; //default color - might change later
    userlist.push(socket.name);
    usercolors.push(socket.color);
    console.log('users: ' + userlist);
    io.emit('newUser', userlist, usercolors); //  send new userlist to all clients  
    
    // send history first***

    socket.emit('history', hist);

    let msg = username + ' has joined';
    updateHist(username, timestamp, msg);

    io.emit('chat message',  msg, 'SERVER', socket.color,timestamp);   

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
    
    let timestamp = getTime();
    socket.on('chat message', function(msg, username, userColor){ // on "chat message" event from client...

    /**** ********/
    console.log(hist);
    /************ */
    
    /***** Nickname Change  *******/
    let arr = msg.split(/\s+/);

    if(arr[0] == "/nick"){      
        let newName = arr[1];
        let timestamp = getTime();
        if(userlist.includes(newName)){
          
          let msg = 'That name is already taken!';
          updateHist(username, timestamp, msg);
          socket.emit('chat message', msg, 'SERVER', timestamp); 
        }else{
          userlist[userlist.indexOf(socket.name)] = newName;
          socket.name = newName;
          console.log('new users: ' + userlist);
          socket.emit('namechange succ', newName);
          io.emit('newUser', userlist, usercolors); //  send new userlist to all clients

          let msg = username + ' has changed their name to ' + newName;
          updateHist(username, timestamp, msg);

          io.emit('chat message', msg, 'SERVER', timestamp); 
        }

    /***** Color Change ******/
    }else if(arr[0] == "/nickcolor"){
        socket.color = '#' + arr[1];
        usercolors[userlist.indexOf(socket.name)] = socket.color;
        console.log("colors: " + usercolors);
        io.emit('newUser', userlist, usercolors); //  send new userlist to all clients

        let msg = username + ' has changed their color';
        let timestamp = getTime();
        updateHist(username, timestamp, msg);
        io.emit('chat message', msg, 'SERVER', timestamp); 

    }else{
        updateHist(socket.name, timestamp, msg);
        io.emit('chat message', msg, socket.name, socket.color, timestamp);// we emit the chat message to every client including sender
      }
    });
  });

  function getTime(){
    let now = new Date();
    let time = now.getHours() + ":" + now.getMinutes();
    return time;
  }

  function updateHist(username, timestamp, message){
    let msg = '[' + timestamp + '] ' + username + ': ' + message;
    hist.push(msg);
  }
