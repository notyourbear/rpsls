app.controller('roomCtrl', ['$scope', '$state', 'socket', 'profile', function($scope, $state, socket, profile) {

  var setHtml = function(id, theHtml){
    angular.element("#"+ id).html(theHtml);
  };

  $scope.playerOne = profile.players[0];
  $scope.playerTwo = profile.players[1] || 'Waiting for an opponent';

  $scope.playerOneObject = "11";
  $scope.playerTwoObject = "";

  $scope.isInGame = profile.inGame; //set up here so that creator sees buttons

  $scope.gameplayButtons = [
    {
      id: 'rock',
      name: 'Rock',
      fawesome: 'hand-rock-o'
    },
    {
      id: 'paper',
      name: 'Paper',
      fawesome: 'hand-paper-o'
    },
    {
      id: 'scissors',
      name: 'Scissors',
      fawesome: 'hand-scissors-o'
    },
    {
      id: 'lizard',
      name: 'Lizard',
      fawesome: 'hand-lizard-o'
    },
    {
      id: 'spock',
      name: 'Spock',
      fawesome: 'hand-spock-o'
    }
  ];

  var reset = function(){
    //emit to backend -- and i only need one person to do that.
    console.log('reset got called!');
    if(profile.inGame && profile.players[0] === profile.userName ) {
      socket.emit('startReset');
    }
    
  };

  //helper functions
  var leaveTheGame = function(bool, player){
    var playerIndex = profile.players.indexOf(player);

    //check that playerIndex is not -1 

    if(playerIndex !== -1){

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
    }
  };

  var victory = function(msg, winPiece, lossPiece, winIndex, cb){
    var count = 2;

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
                    },800);
                  
                  } else if (winIndex === 1) {

                    $scope.playerOne =winPiece;
                    $scope.playerTwo =lossPiece;
                    
                    setTimeout(function(){
                      reset();
                    },800);
                  
                  }

                },1000);
             }
        }, 1000);


  };

 
  

  //scope functions

  $scope.chatMsg = function(){
    //emit message to other users
    if ($scope.chatMessage !== ''){
      angular.element('#messages').append($('<li>').html("<span class='chat-profile-name'><p>" + profile.userName + ":</p></span> <span class='chat-message-text'><p>"+$scope.chatMessage+"</p></span>"));

       //if message goes past overflow, make sure it's scrolled to.
        angular.element('#messageSpace').stop().animate({
          scrollTop: angular.element("#messageSpace")[0].scrollHeight
        }, 800);



      socket.emit('chatMessage', $scope.chatMessage);
  
      //messageDuplication hack
      profile.lastChatMsg = $scope.chatMessage;

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

      //emit leave request to back end
      socket.emit('leaveGame');
    }
  };

  $scope.leaveRoom = function(){
    //set requestRoomLeave to true for a later check
    profile.requestRoomLeave = true;

    //emit leave request to back end with the inGame status for a backend check
    socket.emit('leaveRoom', profile.inGame);
  };

  $scope.updatePlayers = function(playPiece){
    //i basically have to make sure that both sides have the same players in profile.players. to do that, i need to make a check to the backend first
    socket.emit('updateProfilePlayers', playPiece);
  };

  $scope.play = function(playPiece){
    console.log(playPiece);

    var text = 'You play ' + playPiece;
    var piece = playPiece.toLowerCase();
    var html = "<i class='fa fa-hand-"+piece+"-o fa-3x'></i>";

    //find position of user and display move on screen accordingly 
    console.log('a user name!', profile.userName);
    switch(profile.findPosition(profile.userName)){
      case 1: //in first position
        angular.element("#player-one-game-object").append(html);
        break;
      case 2: //in second position
        angular.element("#player-two-game-object").append(html);
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
    //message duplication hack
    if(user !== profile.userName){

      // angular.element('#messages').append($('<li>').text(user+": "+msg));

      angular.element('#messages')
        .append($('<li>')
        .html("<span class='chat-profile-name'><p>" + user + ":</p></span> <span class='chat-message-text'><p>"+msg+"</p></span>"));

       //if message goes past overflow, make sure it's scrolled to.
        angular.element('#messageSpace').stop().animate({
          scrollTop: angular.element("#messageSpace")[0].scrollHeight
        }, 800);

        profile.lastReceivedChatSender = user;
        profile.lastReceivedChatMsg = msg;
      }
  });

  socket.on('joinGame', function(bool){
    //set profile.inGame to be player's status;
    profile.inGame = bool;

    //switch the join room button on/off
    $scope.isInGame = bool;

    //set person as second player on users own screen when joining a game
    if(bool){
      socket.emit('challengerHasArrived');
    } else {
      angular.element('#messages').append($('<li>').text("Can't join. The game is full"));

       //if message goes past overflow, make sure it's scrolled to.
        angular.element('#messageSpace').stop().animate({
          scrollTop: angular.element("#messageSpace")[0].scrollHeight
        }, 800);

    }

  });

  socket.on('leaveGame', function(bool, player){
    var playerIndex = profile.players.indexOf(player);

    leaveTheGame(bool, player);
  });

  socket.on('startRoomLeave', function(bool, player){
    // run through leave game.
    leaveTheGame(bool, player);

    console.log('this is the fact that i want to leave this infernal room:', profile.requestRoomLeave);

    //check for whether user made request to leave
    if(profile.requestRoomLeave){
      // then:
        // -change profile's:
        //   -inGame to false;
        //   -playedPiece to null
        //   -currentRoomId to null
      profile.inGame = false;
      profile.playedPiece = null;
      profile.currentRoomId = null;
      profile.requestRoomLeave = false;

      // emit to backend to finish leave
      socket.emit('completeRoomLeave');
      $state.go('home');
    } else {
      //tell user that somebody is leaving the room

      angular.element('#messages').append($('<li>').text(player + ' has left the room'));

     //if message goes past overflow, make sure it's scrolled to.
      angular.element('#messageSpace').stop().animate({
        scrollTop: angular.element("#messageSpace")[0].scrollHeight
      }, 800);

    }
  });

  socket.on('userHasJoined', function(userName, hasEntered){

    if (!hasEntered) { //dumb hack fix for only displaying enter message once
      angular.element('#messages').append($('<li>').html("<span style='margin-left:10px'>" + userName + " has joined the room</span>"));

       //if message goes past overflow, make sure it's scrolled to.
        angular.element('#messageSpace').stop().animate({
          scrollTop: angular.element("#messageSpace")[0].scrollHeight
        }, 800);
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

  socket.on('updateProfilePlayers', function(playPiece){
    // profile.players = [];
    // profile.countPlayers(players);

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
        setHtml('player-two-game-object', 'Waiting on move');
      } else if (playerIndex === 1){
        setHtml('player-one-game-object', 'Waiting on move');
      }
    
    } else if (profile.inGame){
     // else if you are in the game but have not made a move
      if(playerIndex === 0){
        setHtml('player-one-game-object', 'Move has been made');
      } else if (playerIndex === 1){
        setHtml('player-two-game-object', 'Move has been made');
        
      }
    } else {
       //otherwise display a message for both users
       if(playerIndex === 0){
        setHtml('player-two-game-object', 'Waiting on move');
        setHtml('player-one-game-object', 'Move has been made');
       } else if (playerIndex === 1){
          setHtml('player-one-game-object', 'Waiting on move');
          setHtml('player-two-game-object', 'Move has been made');
      }
    }
  });

  socket.on('waitNoMore', function(userName){
    //find the player index
    var playerIndex = profile.players.indexOf(userName),
        html = 'Move has been made';

    //check that it's not the user, because we don't have to update for him
    if(userName !== profile.userName || !profile.inGame) {
      //set that player has moved

      if(playerIndex === 0){
        setHtml('player-one-game-object', html);
      } else if (playerIndex === 1){
        setHtml('player-two-game-object', html);
      }

    }
  });

  socket.on('gameEval', function(winUserName, winPiece, syntax, lossPiece, lossUserName){

    var winningPiece = winPiece.toLowerCase();
    var winningHtml = "<i class='fa fa-hand-"+winningPiece+"-o fa-3x'></i>";

    var loserPiece = lossPiece.toLowerCase();
    var loserHtml = "<i class='fa fa-hand-"+loserPiece+"-o fa-3x'></i>";
    
    var winIndex = profile.players.indexOf(winUserName);

    if(winIndex === 0){
      setHtml('player-one-game-object', winningHtml);
      setHtml('player-two-game-object', loserHtml);
    } else if (winIndex === 1){
      setHtml('player-one-game-object', loserHtml);
      setHtml('player-two-game-object', winningHtml);
    }
  
    var message = winUserName + " threw " + winPiece + ". It was super effective! " + winPiece + " " + syntax + " " + lossPiece + "!";
    
    victory(message, winPiece, lossPiece, winIndex, reset);
  });

  socket.on('gameEvalTie', function(playPiece){

    var piece = playPiece.toLowerCase();
    var html = "<i class='fa fa-hand-"+piece+"-o fa-3x'></i>";

    setHtml('player-one-game-object', html);
    setHtml('player-two-game-object', html);
    
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

    //reset html 
    setHtml('player-one-game-object', '');
    setHtml('player-two-game-object', '');

    //reset timer
    angular.element('#timer').html('');

  });

}]);



