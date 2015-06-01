var Player = function(id) {
  this.id = id;
  this.userName = null;
  this.roomId = null;
  this.room = null;
};

Player.prototype.addUserName = function(name) {
  this.userName = name;
};

//for testing
Player.prototype.myNameIs = function(){
  console.log('Hi, my name is', this.userName);
};

module.exports = Player;