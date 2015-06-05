app.controller('mainCtrl', ['$scope', '$rootScope', '$compile', '$state', 'socket', 'profile', function($scope, $rootScope, $compile, $state, socket, profile) {

  $scope.welcome = 'Hi this is the main page';

  var hasCreatedRoom = false;  //for room creation check
  var userName = null;

  $scope.roomName = '';
  $scope.createRoom = true;


  $scope.checkRoom = function(id){
    console.log(id);
    //emit to backend to know whether user is in room (true or false)
    socket.emit('checkRoom', id);
  };

  $scope.joinRoom = function(id){
    
    //joins a game room
    socket.emit('joinRoom', id);
    $state.go('room');
  };

  $scope.addName = function(){
    if($scope.userName && !$rootScope.named){
      
      //update profile with name info
      profile.userName = $scope.userName;
      profile.hasName = true;

      //emit name to backend
      socket.emit('addName', profile.userName);

      //reset the input field
      $scope.userName = '';
      $rootScope.named = true;
    }
  };

  $scope.addRoomField = function(){
    $scope.createRoom = true;
  };

  $scope.addRoom = function(){
    //make sure created rooms have a name:
    var name = $scope.roomName || 'Room';

    //set profile.inGame to true;
    profile.inGame = true;

    //push player to the profile.players
    profile.players.push(profile.userName);
    
    //emit to backEnd that room should be created
    socket.emit('addRoom', name);
     
   
  };

  //socket listeners:
  socket.on('addRoom', function(user, name, id){
    
    //add room to home page
    $scope.addRoom(user, name, id);
  });

  socket.on('currentRooms', function(availableRooms){
      //console log out available rooms for testing
      console.log(availableRooms);

      //display current rooms. since this happens on connection, the server will keep trying to run this over and over. so create/set a bool that will make sure it can only run once

      $scope.allTheRooms = availableRooms;
    
  });

  socket.on('checkRoom', function(id, inRoom, players){
    
    //if in room, console.log (already in room)
    if(!inRoom){
      console.log('already in room');
    
    } else {

      //else have user join room
      console.log('joined room!');
      
      //update profile with room info:
      profile.currentRoomId = id;

      //update profile with players in room
      profile.countPlayers(players);

      $scope.joinRoom(id);

    }
  });
    
  socket.on('createdRoom', function(id){
    profile.currentRoomId = id;

    //enter room route
    $state.go('room');
  });
    


}]);