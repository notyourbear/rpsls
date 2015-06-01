'use strict'

var app = angular.module('homeRoom', ['ui.router']);

app.controller('mainCtrl', ['$scope', '$rootScope', 'socket', 'roomDiv', function($scope, $rootScope, socket, roomDiv) {

  $scope.welcome = 'Hi this is the main page';

  var hasCreatedRoom = false;  //for room creation check
  var userName = null;

  $scope.roomName = '';

  $scope.addName = function(){
    if($scope.userName && !$rootScope.named){
      userName = $scope.userName;
      console.log($scope.userName);
      socket.emit('addName', userName);
      $scope.userName = '';
      $rootScope.named = true;
    }
  };

  $scope.addRoomField = function(){
    $scope.createRoom = true;
  };

  $scope.addRoom = function(user, name){
    //check for scope
    if ($scope.roomName !== ''){
      roomDiv.room.createdBy = userName || 'you';
      roomDiv.room.name = $scope.roomName || 'Orange Mochafrappachino';
      $scope.roomName = "";
    //else assume content provided via args
    } else {
      roomDiv.room.createdBy = user;
      roomDiv.room.name = name;
    }

    var newRoom = roomDiv.room.roomBeg + roomDiv.room.nameBeg + roomDiv.room.name + roomDiv.room.nameEnd + roomDiv.room.createdBeg + roomDiv.room.createdBy + roomDiv.room.createdEnd + roomDiv.room.roomEnd;

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

      //emit room creation to backend
        socket.emit('addRoom', roomDiv.room.name);

      //make the create room button dissapear
        angular.element('#addRooms').hide(300);
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





