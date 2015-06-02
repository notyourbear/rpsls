app.controller('roomCtrl', ['$scope', '$state', 'socket', 'profile', function($scope, $state, socket, profile) {

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

  $scope.play = function(playPiece){
    console.log(playPiece);

    //display move on screen
    angular.element('#userMove').html('You play ' + playPiece);
  };

  socket.on('chatMessage', function(user, msg){
    angular.element('#messages').append($('<li>').text(user+": "+msg));

     //if message goes past overflow, make sure it's scrolled to.
      angular.element('#messageSpace').stop().animate({
        scrollTop: angular.element("#messageSpace")[0].scrollHeight
      }, 800);
  });

  socket.on('joinGame', function(bool){
    console.log(bool);
    //set profile.inGame to be true;
    profile.inGame = bool;
    $scope.isInGame = bool;
  });

}]);
