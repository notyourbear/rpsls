'use strict'

var app = angular.module('homeRoom', ['ui.router']);

app.controller('mainCtrl', ['$scope', '$rootScope', 'socket', 'roomDiv', function($scope, $rootScope, socket, roomDiv) {

  $scope.welcome = 'Hi this is the main page';

  var hasCreatedRoom = false;  //for room creation check
  var userName = null;

  $scope.addName = function(){
    if($scope.userName && !$rootScope.named){
      userName = $scope.userName;
      console.log($scope.userName);
      socket.emit('addName', userName);
      $scope.userName = '';
      $rootScope.named = true;
    }
  };

  $scope.addRoom = function(user, name){
    roomDiv.createdBy =  user || 'you';
    roomDiv.name = name || 'Orange Mochafrappachino';

    var newRoom = roomDiv.roomBeg + roomDiv.nameBeg + roomDiv.name + roomDiv.nameEnd + roomDiv.createdBeg + roomDiv.createdBy + roomDiv.createdEnd + roomDiv.roomEnd;

    //check if room creation is being sent from another user
    if(arguments.length > 0){
      //if not, create room
      angular.element('#rooms').append(newRoom);
      
      //else current user is trying to add a room.
      //check if user has already created a room and if user has a name
    } else if (userName && !hasCreatedRoom){
        angular.element('#rooms').append(newRoom);
      //if user is creating room, make it so he/she cannot create another
        hasCreatedRoom = true;
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
        $scope.addRoom(currentRooms[x].ownerUserName, currentRooms[x].name);
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





