'use strict'

var app = angular.module('homeRoom', ['ui.router']);

app.controller('mainCtrl', ['$scope', '$rootScope', 'socket', function($scope, $rootScope, socket) {
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



