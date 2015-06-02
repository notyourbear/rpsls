app.factory('profile', function (){
  return {
        //availableRooms,
        availableRooms: [],
        //currentRoomId,
        currentRoomId: null,
        //userName,
        userName: null,
        hasName: false,
        blah: 'mow',
        inGame: false,
        hi: 'mew',
        players: [],
        countPlayers: function(gameObject){
            //run through gameObject
            for (var i in gameObject) {
                if (gameObject.hasOwnProperty(i)){
                    this.players.push(i);
                }
            }
        }
    };
});