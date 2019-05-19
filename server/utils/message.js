const moment = require('moment');
var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
var generateMessage = (from,userNameColor,text) =>{
  return {
    from,
    text,
    userNameColor,
    createdAt: moment().valueOf()
  }
}
var generateLocationMessage = (from,userNameColor,latitude,longitude)=>{
  return {
    from,
    userNameColor,
    url : `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  }
}
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

module.exports = {generateMessage,generateLocationMessage,getUsernameColor}
