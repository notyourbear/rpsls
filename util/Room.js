var Room = function(name, id, ownerId, ownerUserName){
  this.name = name;
  this.id = id;
  this.ownerId = ownerId;
  this.ownerUserName = ownerUserName;
  this.people = []; //needs to be rethought
  this.game = [];
  this.queue = [];
};

Room.prototype.addPerson = function(person){
  this.people.push(person);
  console.log('added:', person);
};

module.exports = Room;