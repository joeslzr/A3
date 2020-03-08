
/********** CLIENT Side ***********/

var socket = io();
var userID;
var username;

$(function () {
  // var socket = io();
  $('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val(), username);
    $('#m').val('');
  return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    autoScroll();
  });


});

function autoScroll(){
    var element = document.getElementById("chat-window");
    element.scrollTop = element.scrollHeight;
} 

socket.on('userID', function(userCtr){
  username = 'user' + userCtr;
  socket.emit('userID', username);

  console.log('my user ID is: ' + username);

  socket.on('newUser', function(userlist){
    console.log('userlist: ' + userlist);
    $('#users-list').empty();
    userlist.forEach(function(val, i, arr){
      $('#users-list').append($('<li>').text(val));
    });
  });
});


socket.emit('disconnect', username);







  
 //todo: change username 
 //todo: highlighting own messages