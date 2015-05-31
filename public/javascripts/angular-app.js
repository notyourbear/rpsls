'use strict'

var app = angular.module('homeRoom', ['ui.router']);

app.controller('mainCtrl', ['$scope', '$rootScope', 'socket', 'roomDiv', function($scope, $rootScope, socket, roomDiv) {

  $scope.welcome = 'Hi this is the main page';
  
  $scope.addName = function(){
    if($scope.userName && !$rootScope.named){
      var user = $scope.userName;
      console.log($scope.userName);
      socket.emit('addName', user);
      $scope.userName = '';
      $rootScope.named = true;
    }
  };

  $scope.addRoom = function(){
    angular.element('#rooms').append(roomDiv.room);
  };

}]);

app.controller('roomCtrl', ['$scope', function($scope) {
  $scope.welcome = 'Hi this is the room page';
}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {

  // 'if typed in url is not used, go to homepage'
  $urlRouterProvider.otherwise('/');

  // use stateProvider for other routings
  $stateProvider
    .state('home', {
      url: '/',
      controller: 'mainCtrl'
    })
    .state('room', {
      url: '/room',
      controller: 'roomCtrl'
    });

}]);

app.factory('roomDiv', function (){
  return {
    room: "<div class='gameRoom'><div class='name'> Name of Room </div><div class='createdBy'>created by this user</div></div>"
    };
});



