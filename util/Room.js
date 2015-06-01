var Room = function(name, id, ownerId, ownerUserName){
  this.name = name;
  this.id = id;
  this.ownerId = ownerId;
  this.ownerUserName = ownerUserName;
  this.people = []; //needs to be rethought
};

Room.prototype.addPerson = function(userId, userName){
  this.people.push([userId, userName]);
};

module.exports = Room;