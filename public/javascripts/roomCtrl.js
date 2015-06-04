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
                    },7500);
                  
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

    //only actually play a piece if profile.playedPiece is null and person is in game
    if(profile.playedPiece === null && profile.inGame){
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
