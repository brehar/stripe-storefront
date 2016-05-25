'use strict';

var app = angular.module('storeApp');

app.controller('mainCtrl', function($scope, Auth) {
    function checkLoggedIn() {
        Auth.getProfile().then(res => {
            $scope.currentUser = res.data;
        }).catch(err => {
            $scope.currentUser = null;
        });
    }

    checkLoggedIn();

    $scope.$on('loggedin', function() {checkLoggedIn()});
    $scope.$on('loggedout', function() {checkLoggedIn()});

    $('.button-collapse').sideNav();
});

app.controller('registerCtrl', function($scope, $state, Auth) {
    $scope.registerUser = function() {
        Auth.registerUser($scope.newUser).then(res => {
            return Auth.loginUser($scope.newUser);
        }).then(res => {
            $state.go('items');
        });
    };
});

app.controller('loginCtrl', function($scope, $state, Auth) {
    $scope.loginUser = function() {
        Auth.loginUser($scope.user).then(res => {
            $scope.$emit('loggedin');
            $state.go('items');
        });
    };
});

app.controller('logoutCtrl', function($scope, $state, Auth) {
    Auth.logoutUser().then(res => {
        $scope.$emit('loggedout');
        $state.go('home');
    });
});

app.controller('itemsCtrl', function() {

});

app.controller('adminCtrl', function() {
    
});