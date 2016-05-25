'use strict';

var app = angular.module('storeApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/html/home.html'
    }).state('register', {
        url: '/register',
        templateUrl: '/html/register.html',
        controller: 'registerCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: '/html/login.html',
        controller: 'loginCtrl'
    }).state('items', {
        url: '/items',
        templateUrl: '/html/items.html',
        controller: 'itemsCtrl'
    }).state('logout', {
        url: '/logout',
        templateUrl: '/html/logout.html',
        controller: 'logoutCtrl'
    }).state('admin', {
        url: '/admin',
        templateUrl: '/html/admin.html',
        controller: 'adminCtrl',
        resolve: {
            admin: function(Auth, $q, $state) {
                return Auth.getProfile().catch(() => {
                    $state.go('login');
                    return $q.reject();
                });
            }
        }
    });

    $urlRouterProvider.otherwise('/');
});