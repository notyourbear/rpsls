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
        players: [],
        countPlayers: function(gameObject){
            var isAPlayer;

            //run through gameObject
            for (var i in gameObject) {
                if (gameObject.hasOwnProperty(i)){
                    //check to see if guy is already in the game: 
                    for (var j = 0; j < this.players.length; j++){
                        if(i === this.players[j]) {
                            isAPlayer = true;
                        }
                    }

                    //only push in if not already a player
                    if (!isAPlayer){
                        this.players.push(i);
                    }
                }
            }
        }
    };
});