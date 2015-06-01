'use strict'

var app = angular.module('homeRoom', ['ui.router']);

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





