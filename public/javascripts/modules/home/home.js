(function() {
  "use strict";

  /*
  Home module for displaying home page content.
   */
  var app;

  app = angular.module("koan.home", ["ngRoute", "monospaced.elastic", "koan.common"]);

  app.config(function($routeProvider) {
    return $routeProvider.when("/", {
      title: "KOAN Home",
      templateUrl: "modules/home/home.html",
      controller: "HomeCtrl"
    });
  });

}).call(this);
