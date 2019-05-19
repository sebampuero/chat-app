var socket = io();
const MAX_NUMBER_OF_LOCATION_MSG = 5;
var COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];
/*
* When a new message arrives and the client is at the bottom of the container
* keep scrolling down to bottom.
*/
function scrollToBottom (){
  //selectors
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');
  //heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight+scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}
//getUsernameColor function taken from demo code in socket.io
function getUsernameColor (username) {
  // Compute hash code
  var hash = 7;
  for (var i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  // Calculate color
  var index = Math.abs(hash % COLORS.length);
  return COLORS[index];
}

socket.on('connect',function(){
  //get params from the url
  var theUser = $.deparam(window.location.search);
  socket.emit('join',theUser,function(error){
    if (error){
      alert(error);
      window.location.href="/";
    }else{
      console.log('No error');
      if(theUser.room !== ""){
        $('#group-name').html(theUser.room);
      }else{
        $('#group-name').html(theUser.roomSelect);
      }
    }
  });
});

socket.on('disconnect',function(){

});

socket.on('updateUserList',function(users){
  var ol = $('<ol></ol>');
  users.forEach(function(user){
    ol.append($('<li></li>').text(user));
  });
  $('#users').html(ol); //do not append, wipe and put
});

socket.on('newMessage',function(message){
  var template = $('#message-template').html();
  message.createdAt = moment(message.createdAt).format('h:mm a');
  var html = Mustache.render(template,message);
  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage',function(locationObject){
  var template = $('#location-message-template').html();
  locationObject.createdAt = moment(locationObject.createdAt).format('h:mm a');
  var html = Mustache.render(template,locationObject);
  $('#messages').append(html);
  scrollToBottom();
});

$('#message-form').on('submit',function(e){
  e.preventDefault();
  var messageValue = $('[name=message]');
  $('button#send-message-btn').attr('disabled','disabled').text('Sending..');
  socket.emit('createMessage',{
    text : messageValue.val()
  },function(){
    messageValue.val("");
    $('#send-message-btn').removeAttr('disabled').text('Send');
  });
});

var locationButton = $('#send-location');
var numOfSentLocations = 0;
locationButton.on('click',function(){
  var options = { //set options for retrieval of location
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };
  if(!navigator.geolocation){
    return alert('Tu browser es una cagada');
  }
  numOfSentLocations++; //increment number of max sent locations counter
  console.log(numOfSentLocations);
  if(numOfSentLocations<=MAX_NUMBER_OF_LOCATION_MSG){
    locationButton.attr('disabled','disabled').text('Sending location..');
    navigator.geolocation.getCurrentPosition(success,error,options);
  }else{
    alert('You sent too many location messages');
  }
  function success(position){
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage',{
      latitude : position.coords.latitude,
      longitude : position.coords.longitude
    });
  }
  function error(){
    alert('Acepta pues');
    locationButton.removeAttr('disabled').text('Send location');
  }
});
