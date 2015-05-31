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

  $scope.addRoom = function(user, name){
    roomDiv.name = name || 'Orange Mochafrappachino';
    roomDiv.createdBy =  user || 'a user from Mars';

    var newRoom = roomDiv.roomBeg + roomDiv.nameBeg + roomDiv.name + roomDiv.nameEnd + roomDiv.createdBeg + roomDiv.createdBy + roomDiv.createdEnd + roomDiv.roomEnd;

    var room = angular.element('#rooms').append(newRoom);

    if(!user){
      socket.emit('addRoom', roomDiv.name);
    }
  };

  socket.on('addRoom', function(user, name){
    $scope.addRoom(user,name);
  });

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
    roomBeg: "<div class='gameRoom'>",
    nameBeg: "<div class='name'>",
    name: "",
    nameEnd: "</div>",
    createdBeg:"<div class='createdBy'>",
    createdBy: "",
    createdEnd:"</div>",
    roomEnd: "</div>"
    };
});



