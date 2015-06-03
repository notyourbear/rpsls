app.controller('roomCtrl', ['$scope', '$state', 'socket', 'profile', function($scope, $state, socket, profile) {

  $scope.playerOne = profile.players[0];
  $scope.playerTwo = profile.players[1] || 'Waiting for an opponent';

  $scope.caviat = profile.currentRoomId;

  $scope.isInGame = profile.inGame; //set up here so that creator sees buttons


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
    console.log('profile.inGame:', profile.inGame);
    socket.emit('joinGame');
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
        angular.element('#playerOne').html(text);
        break;
      case 2: //in second position
        angular.element('#playerTwo').html(text);
        break;
      case false:
        console.log('what. how even?');
    }


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
    //set profile.inGame to be true;
    profile.inGame = bool;

    //add player to profile.players
    profile.countPlayers(players);
    console.log(profile.players);

    //set person as second player on users own screen when joining a game
    if (bool) {
      $scope.playerTwo = profile.userName;

      socket.emit('challengerHasArrived');
    }

    //set whether person is in game
    $scope.isInGame = bool;
  });

  socket.on('challengerHasArrived', function(challenger){
    profile.players.push(challenger.userName);
    $scope.playerTwo = challenger.userName;
  });

  socket.on('updateProfilePlayers', function(playPiece, players){
    profile.players = [];
    profile.countPlayers(players);
    $scope.play(playPiece);
  });

  socket.on('waiting', function(userName){
    var playerIndex = profile.players.indexOf(userName);
    $scope.caviat = profile.players + ' ' + playerIndex;

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

  socket.on('gameEval', function(winUserName, winPiece, syntax, lossPiece, lossUserName){
    
    var winIndex = profile.players.indexOf(winUserName);
  
    var message = winUserName + " threw " + winPiece + ". It was super effective! " + winPiece + " " + syntax + " " + lossPiece + "!";

    //set messages:
    if(winIndex === 0){
      $scope.playerOne = winPiece;
      $scope.playerTwo = lossPiece;
    } else if (winIndex === 1) {
      $scope.playerTwo = winPiece;
      $scope.playerOne = lossPiece;
    }

    $scope.victoryMessage = message;
    
  });

}]);
