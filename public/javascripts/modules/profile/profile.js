(function() {
  "use strict";

  /*
  Profile module for user profile and related content.
   */
  var app;

  app = angular.module("koan.profile", ["ngRoute", "koan.common"]);

  app.config(function($routeProvider) {
    return $routeProvider.when("/profile", {
      title: "User Profile",
      templateUrl: "modules/profile/profile.html",
      controller: "ProfileCtrl"
    });
  });

}).call(this);
