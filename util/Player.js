var Player = function(id) {
  this.id = id;
  this.userName = null;
  this.room = null;
};

Player.prototype.addUserName = function(name) {
  this.userName = name;
};

Player.prototype.name = function(){
  return this.userName;
};

module.exports = Player;