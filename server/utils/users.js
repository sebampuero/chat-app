class Users {
  constructor(){
    this.users = [];
    this.rooms = []
  }
  addUser(id,name,room,userNameColor){
    var user = {id,name,room,userNameColor};
    this.users.push(user);
    if(this.rooms.length > 0) this.rooms = this.rooms.filter(( aRoom ) => aRoom !== room);
    this.rooms.push(room);
    return user;
  }
  removeUser(id){
    var user = this.getUser(id);

    if(user){
      this.users = this.users.filter((user)=> user.id !== id);
    }
    return user;
  }
  getUser(id){
    //return the first item in the filtered array where the id equals
    //the user id
    return this.users.filter((user) => user.id === id)[0];
  }
  getUserList(room){
    //this is an array
    var users = this.users.filter((user)=>{
      return user.room === room;
    });
    //in this array , names are only stored
    var namesArray = users.map((user)=>{
      return user.name
    });
    return namesArray;
  }
  getRooms(){
    return this.rooms;
  }
}

module.exports = {Users};
