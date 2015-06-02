var Room = function(name, id, ownerId, ownerUserName){
  this.name = name;
  this.id = id;
  this.ownerId = ownerId;
  this.ownerUserName = ownerUserName;
  this.people = []; //needs to be rethought
  this.game = {};
  this.queue = [];
};

Room.prototype.addPerson = function(person){
  this.people.push(person);
  console.log('added:', person);
};

Room.prototype.addToGame = function(userName){
  //validate that game has less that two players in it:
  var count = 0,
      i;

  for (i in this.game) {
        if (this.game.hasOwnProperty(i)) {
            count++;
        }
    }

  if(count < 2 && !this.game.hasOwnProperty(userName)){
    //if validated, add player as an object with a null value;
    this.game[userName] = null;
    return true;
  } else {
    return false;
  }

};

module.exports = Room;