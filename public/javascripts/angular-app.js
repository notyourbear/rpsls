'use strict'

var homeRoom = angular.module('homeRoom', ['ui.router']);

homeRoom.controller('mainCtrl', ['$scope', function($scope) {
  $scope.welcome = 'Hi this is the main page';
}]);

homeRoom.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) { 
  

}]);

