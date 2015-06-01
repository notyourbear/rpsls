'use strict'

var app = angular.module('homeRoom', ['ui.router']);

app.controller('mainCtrl', ['$scope', '$rootScope', '$compile', 'socket', 'roomDiv', function($scope, $rootScope, $compile, socket, roomDiv) {

  $scope.welcome = 'Hi this is the main page';

  var hasCreatedRoom = false;  //for room creation check
  var userName = null;

  $scope.roomName = '';


  $scope.checkRoom = function(id){
    console.log('frontcheck, whats the id:',  id);
    //emit to backend to know whether user is in room (true or false)
    socket.emit('checkRoom', id);
  };

  $scope.joinRoom = function(id){
    socket.emit('joinRoom', id);
  };

  $scope.addName = function(){
    if($scope.userName && !$rootScope.named){
      userName = $scope.userName;
      socket.emit('addName', userName);
      $scope.userName = '';
      $rootScope.named = true;
    }
  };

  $scope.addRoomField = function(){
    $scope.createRoom = true;
  };

  $scope.addRoom = function(user, name, id){
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

    var joinButton = roomDiv.join.buttonBeg + "\""+id+"\"" + roomDiv.join.buttonBegEnd + roomDiv.join.buttonText + roomDiv.join.buttonEnd;

    var newRoom = $compile(roomDiv.room.roomBeg + roomDiv.room.nameBeg + roomDiv.room.name + roomDiv.room.nameEnd + roomDiv.room.createdBeg + roomDiv.room.createdBy + roomDiv.room.createdEnd + joinButton + roomDiv.room.roomEnd)($scope);

  
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

  socket.on('addRoom', function(user, name, id){
    $scope.addRoom(user, name, id);
  });

  socket.on('currentRooms', function(currentRooms){
    console.log(currentRooms);
    if (currentRooms.length > 0 && !$scope.bool){
      for (var i = 0; i < currentRooms.length; i++){
        $scope.addRoom(currentRooms[i].ownerUserName, currentRooms[i].name, currentRooms[i].id);
      }
      $scope.bool = true;
    }
  });

  socket.on('checkRoom', function(id, inRoom){
    //if in room, console.log (already in room)
    if(!inRoom){
      console.log('already in room');
    } else {
      //else have user join room
      console.log('joined room!');
      $scope.joinRoom(id);
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
      controller: 'mainCtrl',
      templateUrl: 'templates/home.ejs'
    })
    .state('room', {
      url: '/room',
      controller: 'roomCtrl',
      templateUrl: 'templates/room.ejs'
    });

}]);





