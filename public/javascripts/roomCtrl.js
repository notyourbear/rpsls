app.controller('roomCtrl', ['$scope', 'socket', 'profile', function($scope, socket, profile) {
  $scope.welcome = 'Hi this is the room page';
  $scope.caviat = profile.blah;
}]);
