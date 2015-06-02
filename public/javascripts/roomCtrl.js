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

      console.log(profile.players);
    }
  };

  $scope.joinGame = function(){
    console.log('profile.inGame:', profile.inGame);
    socket.emit('joinGame');
  };

  $scope.play = function(playPiece){
    console.log(playPiece);

    //display move on screen
    angular.element('#userMove').html('You play ' + playPiece);

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
    }

    //set whether person is in game
    $scope.isInGame = bool;
  });

}]);
