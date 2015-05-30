'use strict'

var homeRoom = angular.module('homeRoom', []);

homeRoom.controller('mainCtrl', ['$scope', function($scope) {
  $scope.welcome = 'Hi this is the main page';
}]);

