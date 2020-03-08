
/********** CLIENT Side ***********/

var socket = io();
var userID;
var username;
var color = '#97abb1'; //Default color holder

$(function () {
  $('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val(), username, color);
    $('#m').val('');
  return false;
  });
  socket.on('chat message', function(msg, fromUser, fromColor, timestamp){
    if(fromUser == username ){
      $('#messages').append($('<li style="border-left: 4px solid #ff5654;font-weight: bold;">').html('[' + timestamp + '] ' + '<span style="color:' + color + ';">' + username + '</span>' + ': ' + msg));//TODO: make this nicer somehow  
    }else if(fromUser == 'SERVER'){
      $('#messages').append($('<li style="font-style: oblique;">').text('[' + timestamp + '] ' + msg));
    }else{
      $('#messages').append($('<li>').html('[' + timestamp + '] ' + '<span style="color:' + fromColor + ';">' + fromUser + '</span>' + ': ' + msg));
    }
    let chat = document.getElementById("chat-window");
    chat.scrollTop = chat.scrollHeight;
  });
});


socket.on('userID', function(userCtr){
  username = 'user' + userCtr;
  socket.emit('userID', username);
  socket.on('newUser', function(userlist, usercolors){
    $('#users-list').empty();
    prntOnlineUsers(userlist, usercolors);
  });
});


socket.on('history', function(hist){
  for(let i = 0; i < hist.length ; i++){
    $('#messages').append($('<li>').html('<span style="color: #88e1f2;">' + hist[i] + '</span>'));
  }

});


function prntOnlineUsers(userlist, colors){
  for(let i=0; i < userlist.length ; i++){
    if(userlist[i] == username){
      $('#users-list').append($('<li style="border-left: 4px solid #ff5654;font-weight: bold;">').html('<span style="color:' + colors[i] + ';">' + userlist[i] + '</span>'));
      color = colors[i];
    }else{
      $('#users-list').append($("<li style= color:" + colors[i] + ";>").text(userlist[i]));
    
    }
  }

}


socket.on('namechange succ', function(newName){
  username = newName;
});

