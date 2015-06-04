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

Room.prototype.leaveFromGame = function(userName){
  //check that userName is actually in game:
  if(this.game.hasOwnProperty(userName)){
    delete this.game[userName];
    
    //return false to say that user is no longer in game
    return false;
  } else {

    //return true in case player was not taken out of game (and player is still in game)
    return true;
  }
};

Room.prototype.resetGame = function(){
  var i;

  for (i in this.game){
    if (this.game.hasOwnProperty(i)){
      this.game[i] = null;
    }
  }
};


module.exports = Room;