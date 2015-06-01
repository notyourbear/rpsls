app.controller('roomCtrl', ['$scope', '$state', 'socket', 'profile', function($scope, $state, socket, profile) {

  $scope.welcome = 'Hi this is the room page';
  $scope.caviat = profile.currentRoomId;

  $scope.chatMsg = function(){
    socket.emit('chatMessage', $('#m').val());
        $('#m').val('');
        return false;
  };

  socket.on('chatMessage', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

}]);
