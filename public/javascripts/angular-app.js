'use strict'

var app = angular.module('homeRoom', ['ui.router']);

app.controller('mainCtrl', ['$scope', '$rootScope', 'socket', 'roomDiv', function($scope, $rootScope, socket, roomDiv) {

  $scope.welcome = 'Hi this is the main page';

  var hasCreatedRoom = false;  //for room creation check

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
    roomDiv.createdBy =  user || 'you';
    roomDiv.name = name || 'Orange Mochafrappachino';

    var newRoom = roomDiv.roomBeg + roomDiv.nameBeg + roomDiv.name + roomDiv.nameEnd + roomDiv.createdBeg + roomDiv.createdBy + roomDiv.createdEnd + roomDiv.roomEnd;

    //check to see if user has already created a room, or if it's being sent from another user
    if(arguments.length > 0 || !hasCreatedRoom){
      //if not, create room
      angular.element('#rooms').append(newRoom);
      
      //if user is creating room, make it so he/she cannot create another
      if(arguments.length === 0){
        hasCreatedRoom = true;
      }
    }

    if(arguments.length === 0){
      socket.emit('addRoom', roomDiv.name);
    }
  };

  socket.on('addRoom', function(user, name){
    $scope.addRoom(user,name);
  });

  socket.on('currentRooms', function(currentRooms){
    console.log(currentRooms);
    if (currentRooms.length > 0 && !$scope.bool){
      for (var x = 0; x < currentRooms.length; x++){
        $scope.addRoom(currentRooms[x].name, currentRooms[x].room);
      }
      $scope.bool = true;
    }
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





