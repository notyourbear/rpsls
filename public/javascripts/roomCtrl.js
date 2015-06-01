app.controller('roomCtrl', ['$scope', '$state', 'socket', 'profile', function($scope, $state, socket, profile) {
  $scope.welcome = 'Hi this is the room page';
  $scope.caviat = $state.current;
}]);
