(function() {
  'use strict';

  /**
   * Top level module. Lists all the other modules as dependencies.
   */
  var app;

  app = angular.module("koan", ["ngRoute", "angular-loading-bar", "koan.common", "koan.home", "koan.profile"]);

  app.config(function($routeProvider, $locationProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    $locationProvider.html5Mode(true);
    return $routeProvider.otherwise({
      redirectTo: '/'
    });
  });

  app.run(function($location, $rootScope, $window, $route, api) {
    var common;
    common = $rootScope.common = $rootScope.common || {
      active: {},
      user: JSON.parse($window.sessionStorage.user || $window.localStorage.user),
      logout: function() {
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.user;
        delete $window.localStorage.token;
        delete $window.localStorage.user;
        return $window.location.replace('/signin.html');
      },
      clearDatabase: function() {
        var self;
        self = this;
        return api.debug.clearDatabase().success(function() {
          return self.logout();
        });
      }
    };
    api.connected.subscribe(function() {
      return common.onlineIndicatorStyle = {
        'background-color': 'green'
      };
    });
    api.disconnected.subscribe(function() {
      return common.onlineIndicatorStyle = {
        'background-color': 'lightgrey'
      };
    });
    return $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      var currentCtrl, previousCtrl;
      $rootScope.common.title = current.$$route.title;
      currentCtrl = current.controller.substring(0, current.controller.indexOf('Ctrl')).toLowerCase();
      $rootScope.common.active[currentCtrl] = 'active';
      if (previous) {
        previousCtrl = previous.controller.substring(0, previous.controller.indexOf('Ctrl')).toLowerCase();
        return delete $rootScope.common.active[previousCtrl];
      }
    });
  });

}).call(this);
