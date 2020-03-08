
$(function () {
  var socket = io();
  $('form').submit(function(e){
  e.preventDefault(); // prevents page reloading
  socket.emit('chat message', $('#m').val());
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

    //element.scrollTo(0,document.querySelector(".chat-window").scrollHeight);
} 
  
  
 //todo: highlighting own messages