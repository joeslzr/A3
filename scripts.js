
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
  socket.on('chat message', function(msg, fromUser, fromColor){
    if(fromUser == username ){
      $('#messages').append($('<li style="border-left: 4px solid #ff5654;font-weight: bold;">').html('[' + getTime() + '] ' + '<span style="color:' + color + ';">' + username + '</span>' + ': ' + msg));//TODO: make this nicer somehow  
    }else if(fromUser == 'SERVER'){
      $('#messages').append($('<li style="font-style: oblique;">').text('[' + getTime() + '] ' + msg));
    }else{
      $('#messages').append($('<li>').html('[' + getTime() + '] ' + '<span style="color:' + fromColor + ';">' + fromUser + '</span>' + ': ' + msg));
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

function prntOnlineUsers(userlist, colors){
  for(let i=0; i < userlist.length ; i++){
    if(userlist[i] == username){
      $('#users-list').append($('<li style="border-left: 4px solid #ff5654;font-weight: bold;">').html('<span style="color:' + colors[i] + ';">' + userlist[i] + '</span>'));
      console.log('u: ' + userlist);
      color = colors[i];
    }else{
      $('#users-list').append($("<li style= color:" + colors[i] + ";>").text(userlist[i]));
    
    }
  }


  //userlist.forEach(function(val, i, arr, usercolors){
  //   if(val == username){
  //     //$('#users-list').append($("<li style=border-left: 4px solid #ff5654; font-weight: bold" + "color:" + usercolors[i] + ";>").text(val));
  //     $('#users-list').append($("<li style=border-left: 4px solid #ff5654; font-weight: bold" + "color: #ff5654" + ";>").text(val));
  //     console.log(usercolors[i]);
  //     color = usercolors[i];
  //   }else{
  //     $('#users-list').append($("<li style= color:" + usercolors[i] + ";>").text(val));
  //   }
  // });
}


socket.on('namechange succ', function(newName){
  username = newName;
});


// socket.on('colorchange succ',function(usercolors, userlist){
//   $('#users-list').empty();
//     userlist.forEach(function(val, i, arr){
//       if(val == username){
//         //$('#users-list').append($("<li style=border-left: 4px solid #ff5654; font-weight: bold" + "color:" + usercolors[i] + ";>").text(val));
//         $('#users-list').append($("<li style=border-left: 4px solid #ff5654; font-weight: bold" + "color: #ff5654" + ";>").text(val));
//         console.log(usercolors[i]);
//         color = usercolors[i];
//       }else{
//         $('#users-list').append($("<li style= color:" + usercolors[i] + ";>").text(val));
//       }
//     });
// });


function getTime(){
  let now = new Date();
  let time = now.getHours() + ":" + now.getMinutes();
  return time;
}

  
 //todo: change username 
 //todo: highlighting own messages