app.controller('roomCtrl', ['$scope', '$state', 'socket', 'profile', function($scope, $state, socket, profile) {

  $scope.playerOne = profile.players[0];
  $scope.playerTwo = profile.players[1] || 'Waiting for an opponent';

  $scope.isInGame = profile.inGame; //set up here so that creator sees buttons

  var reset = function(){
    //emit to backend -- and i only need one person to do that.
    console.log('reset got called!');
    if(profile.inGame && profile.players[0] === profile.userName ) {
      socket.emit('startReset');
    }
    
  };

  //helper functions
  var victory = function(msg, winPiece, lossPiece, winIndex, cb){
    var count = 3;

    //display initial time;
    angular.element('#timer').text(count);



    var timer = setInterval(function() {
            //start countdown from 3 down
            count--;
            angular.element('#timer').text(count);

             if(count === 0){
                //display message
                clearInterval(timer);
                setTimeout(function(){
                  //display victory msg
                  angular.element('#timer').text(msg);

                  //display results
                  if(winIndex === 0){
                    $scope.playerOne = winPiece;
                    $scope.playerTwo = lossPiece;
                  
                    setTimeout(function(){
                      reset();
                    },7500);
                  
                  } else if (winIndex === 1) {

                    $scope.playerOne =winPiece;
                    $scope.playerTwo =lossPiece;
                    
                    setTimeout(function(){
                      reset();
                    },4000);
                  
                  }

                },1000);
             }
        }, 1000);


  };

 
  

  //scope functions

  $scope.chatMsg = function(){
    //emit message to other users
    if ($scope.chatMessage !== ''){
      socket.emit('chatMessage', $scope.chatMessage);
    

      //append message to own screen
      angular.element('#messages').append($('<li>').text(profile.userName+": "+$scope.chatMessage));

      //if message goes past overflow, make sure it's scrolled to.
      angular.element('#messageSpace').stop().animate({
        scrollTop: angular.element("#messageSpace")[0].scrollHeight
      }, 800);

      //reset chatMessage text to nothing
      $scope.chatMessage = '';
    }
  };

  $scope.joinGame = function(){

    //only send request if not already in game
    if(!profile.inGame){
      socket.emit('joinGame');
    }
  };

  $scope.leaveGame = function(){
    //double check that player actually is in game
    if(profile.inGame){
      //set requestLeave to true for later check
      profile.requestLeave = true;

      socket.emit('leaveGame');
    }
  };

  $scope.updatePlayers = function(playPiece){
    //i basically have to make sure that both sides have the same players in profile.players. to do that, i need to make a check to the backend first
    socket.emit('updateProfilePlayers', playPiece);
  };

  $scope.play = function(playPiece){
    console.log(playPiece);

    var text = 'You play ' + playPiece;

    //find position of user and display move on screen accordingly 
    console.log('a user name!', profile.userName);
    switch(profile.findPosition(profile.userName)){
      case 1: //in first position
        $scope.playerOne = text;
        break;
      case 2: //in second position
        $scope.playerTwo = text;
        break;
      case false:
        console.log('what. how even?');
    }

    //set the piecePlayed in the profile
    profile.playedPiece = playPiece;

    //emit move to backend:
    socket.emit('playPiece', playPiece);
  };

  socket.on('chatMessage', function(user, msg){
    angular.element('#messages').append($('<li>').text(user+": "+msg));

     //if message goes past overflow, make sure it's scrolled to.
      angular.element('#messageSpace').stop().animate({
        scrollTop: angular.element("#messageSpace")[0].scrollHeight
      }, 800);
  });

  socket.on('joinGame', function(bool, players){
    //set profile.inGame to be player's status;
    profile.inGame = bool;

    //switch the join room button on/off
    $scope.isInGame = bool;

    //add player to profile.players
    // profile.countPlayers(players);

    //set person as second player on users own screen when joining a game
    if(bool){
      socket.emit('challengerHasArrived');
    }

  });

  socket.on('leaveGame', function(bool, player){
    var playerIndex = profile.players.indexOf(player);

    //if the player has been in game and requested leave...
    if(profile.inGame && profile.requestLeave){
      //...set profile.inGame to be player's status;
      profile.inGame = bool;

      //...switch the join room button on/off
      $scope.isInGame = bool;

      //reset profile.requestLeave
      profile.requestLeave = false;
    }

    //if player should actually not be a part of the game anymore...
    if(!bool){
      //change for everyone:
      //...take the player out of the profile.players array
      profile.players.splice(playerIndex, 1);

      //...update screens with player positions

      if(profile.players.length === 1) { //in case another person was already in game
        $scope.playerOne = profile.players[0];
        $scope.playerTwo = 'Waiting for an opponent';
      } else if (profile.players.length === 0) {
        $scope.playerOne = 'Waiting for a player';
        $scope.playerTwo = 'Waiting for an opponent';
      }
      console.log('on leaving, players looks like:', profile.players);
    }
  });

  socket.on('challengerHasArrived', function(challenger){
    console.log('on arrival, profile players be:', profile.players);

    //check profile.players for screen position:
    if(profile.players.length === 0) {
      $scope.playerOne = challenger.userName;
    } else if (profile.players.length === 1){
      $scope.playerTwo = challenger.userName;
    }

    profile.players.push(challenger.userName);
  });

  socket.on('updateProfilePlayers', function(playPiece, players){
    // profile.players = [];
    profile.countPlayers(players);

    //only actually play a piece if profile.playedPiece is null, person is in game, and the playPiece is not null
    if(profile.playedPiece === null && profile.inGame && playPiece !== null){
      $scope.play(playPiece);
    }
  });

  socket.on('waiting', function(userName){
    var playerIndex = profile.players.indexOf(userName);

    //check whether the passed back userName is in the game and you are in the game
    if (profile.userName === userName && profile.inGame){
      //set the other user's message to being...waiting for dude
      
      if(playerIndex === 0){
        $scope.playerTwo = 'Waiting on ' + profile.players[1] + ' to make their move';
      } else if (playerIndex === 1){
        $scope.playerOne = 'Waiting on ' + profile.players[0] + ' to make their move';
      }
    
    } else if (profile.inGame){
     // else if you are in the game but have not made a move
      if(playerIndex === 0){
        $scope.playerOne = profile.players[0] + ' has made their move';
      } else if (playerIndex === 1){
        $scope.playerTwo = profile.players[1] + ' has made their move';
      }
    } else {
       //otherwise display a message for both users
       if(playerIndex === 0){
        $scope.playerOne = profile.players[0] + '  has made their move';
        $scope.playerTwo = 'Waiting on ' + profile.players[1] + ' to make their move';
       } else if (playerIndex === 1){
          $scope.playerOne = 'Waiting on ' + profile.players[0] + ' to make their move';
          $scope.playerTwo = profile.players[1] + ' has made their move';
      }
    }
  });

  socket.on('waitNoMore', function(userName){
    //find the player index
    var playerIndex = profile.players.indexOf(userName),
        text = userName + ' has made their move.';

    //check that it's not the user, because we don't have to update for him
    if(userName !== profile.userName || !profile.inGame) {
      //set that player has moved

      if(playerIndex === 0){
        $scope.playerOne = text;
      } else if (playerIndex === 1){
        $scope.playerTwo = text;
      }

    }
  });

  socket.on('gameEval', function(winUserName, winPiece, syntax, lossPiece, lossUserName){
    
    var winIndex = profile.players.indexOf(winUserName);
  
    var message = winUserName + " threw " + winPiece + ". It was super effective! " + winPiece + " " + syntax + " " + lossPiece + "!";
    
    victory(message, winPiece, lossPiece, winIndex, reset);
  });

  socket.on('gameEvalTie', function(playPiece){
    
    var message = 'Tie!!';

    //prempt victory function into doing what i need it to
    victory(message, playPiece, playPiece, 0, reset);
  });

  socket.on('startReset', function(){
    //how to reset the game.
    //set playedPiece = null
    profile.playedPiece = null;

    console.log('reset in process!');
    
    //reset scopes;
    $scope.playerOne = profile.players[0];
    $scope.playerTwo = profile.players[1];
    $scope.victoryMessage = "";

    //reset timer
    angular.element('#timer').html('');

  });

}]);
