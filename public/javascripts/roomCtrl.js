app.controller('roomCtrl', ['$scope', '$state', 'socket', 'profile', function($scope, $state, socket, profile) {

  $scope.welcome = 'Hi this is the room page';
  $scope.caviat = profile.currentRoomId;

  $scope.chatMsg = function(){
    //emit message to other users
    if ($scope.chatMessage !== ''){
      socket.emit('chatMessage', $scope.chatMessage);
    

      //append message to own screen
      angular.element('#messages').append($('<li>').text(profile.userName+": "+$scope.chatMessage));

      //reset chatMessage text to nothing
      $scope.chatMessage = '';
    }
  };

  socket.on('chatMessage', function(user, msg){
    angular.element('#messages').append($('<li>').text(user+": "+msg));
  });

}]);
