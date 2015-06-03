app.factory('profile', function (){
  return {
        //availableRooms,
        availableRooms: [],
        //currentRoomId,
        currentRoomId: null,
        //userName,
        userName: null,
        hasName: false,
        inGame: false,
        playedPiece: null,
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
        },
        findPosition: function(userName){
            //only run if two players are present
            console.log('checking this userName', userName);

            console.log('current state of the players array', this.players);
            if (this.players.length === 2) {
                if(userName === this.players[0]){
                    return 1;
                }else if (userName === this.players[1]) {
                    return 2;
                }
            }

            //if not found return false
            return false;
        }
    };
});