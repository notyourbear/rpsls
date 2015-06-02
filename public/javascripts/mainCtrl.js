app.controller('mainCtrl', ['$scope', '$rootScope', '$compile', '$state', 'socket', 'roomDiv', 'profile', function($scope, $rootScope, $compile, $state, socket, roomDiv, profile) {

  $scope.welcome = 'Hi this is the main page';

  var hasCreatedRoom = false;  //for room creation check
  var userName = null;

  $scope.roomName = '';


  $scope.checkRoom = function(id){
    
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

  $scope.addRoom = function(user, name, id){
    
    //check if user is creating room
    if ($scope.roomName !== ''){
      roomDiv.room.createdBy = profile.userName;
      roomDiv.room.name = $scope.roomName;
      $scope.roomName = "";
    
    //else assume content provided via args
    } else {
      roomDiv.room.createdBy = user;
      roomDiv.room.name = name;
    }

    //create html for room element to add
    var joinButton = roomDiv.join.buttonBeg + "\""+id+"\"" + roomDiv.join.buttonBegEnd + roomDiv.join.buttonText + roomDiv.join.buttonEnd;

    //further creation. also compile the fucker into an angular template
    var newRoom = $compile(roomDiv.room.roomBeg + roomDiv.room.nameBeg + roomDiv.room.name + roomDiv.room.nameEnd + roomDiv.room.createdBeg + roomDiv.room.createdBy + roomDiv.room.createdEnd + joinButton + roomDiv.room.roomEnd)($scope);

  
    //validation time!  
    //check if room creation is being sent from another user
    if(arguments.length > 0){
      //if not, create room
      angular.element('#rooms').append(newRoom);

      //update profile with available rooms
      profile.availableRooms.push([user, name, id]);
      
      //else current user is trying to add a room.
      //check if user has already created a room and if user has a name
    } else if (profile.userName && !hasCreatedRoom){
        angular.element('#rooms').append(newRoom);

        //update profile with available rooms
        profile.availableRooms.push([user, name, id]);

      //if user is creating room, make it so he/she cannot create another
        hasCreatedRoom = true;

      //emit room creation to backend
        socket.emit('addRoom', roomDiv.room.name);

      //make the create room button dissapear
        angular.element('#addRooms').hide(300);

    }
   
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
    if (availableRooms.length > 0 && !$scope.bool){
      for (var i = 0; i < availableRooms.length; i++){
        
        //add each room
        $scope.addRoom(availableRooms[i].ownerUserName, availableRooms[i].name, availableRooms[i].id);
      }

      //set bool to true. will only run once now thanks to if check above
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

      //update profile with room info:
      profile.currentRoomId = id;
    }
  });
    
  socket.on('createdRoom', function(id){
    profile.currentRoomId = id;
    
    //enter room route
    $state.go('room');
  });
    


}]);