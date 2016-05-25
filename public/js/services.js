'use strict';

var app = angular.module('storeApp');

app.service('Auth', function($http) {
    this.getProfile = () => {
        return $http.get('/api/users/profile');
    };

    this.registerUser = newUser => {
        return $http.post('/api/users/register', newUser);
    };

    this.loginUser = user => {
        return $http.post('/api/users/authenticate', user);
    };

    this.logoutUser = () => {
        return $http.delete('/api/users/logout');
    };
});