const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage,getUsernameColor} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users(); //initilaize users array
app.use(express.static(publicPath));

io.on('connection',(socket)=>{

  socket.on('join',(theUser,callback)=>{

    if (!isRealString(theUser.name)){
      return callback('Invalid name');
    }
    if(!isRealString(theUser.room) && !isRealString(theUser.roomSelect)){
      return callback('Invalid room')
    }
    
    if(!isRealString(theUser.room)){
      socket.join(theUser.roomSelect);
      theUser.room = theUser.roomSelect;
    }
    else  
      socket.join(theUser.room);

    users.removeUser(socket.id);
    users.addUser(socket.id,theUser.name,theUser.room,getUsernameColor(theUser.name));
    io.to(theUser.room).emit('updateUserList',users.getUserList(theUser.room)); //pass the array containing users in this room
    socket.emit('newMessage',generateMessage('Admin','','Welcome to the chat app'));
    socket.broadcast.to(theUser.room).emit('newMessage',generateMessage('Admin','',`${theUser.name} has joined`));
    callback();
  });

  socket.on('createMessage',(message,callback)=>{
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
        io.to(user.room).emit('newMessage',generateMessage(user.name,user.userNameColor,message.text));
    }
    callback(); //callback fn for client
  });

  socket.on('disconnect',()=>{
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin','',`${user.name} has left the room`));
    }
  });

  socket.on('createLocationMessage',(coords)=>{
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,user.userNameColor,coords.latitude,coords.longitude));
    }
  });

});

// in order to fetch current groups in the index
// a / get request , send back an array containing the rooms
app.get('/users', (req, res) => {
  res.send(users.getRooms());
});


server.listen(port,()=>{
  console.log(`Server is on ${port}`);
})
