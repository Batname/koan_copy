"use strict"

###
Profile module for user profile and related content.
###
app = angular.module("koan.profile", [
	"ngRoute" 
	"koan.common"
])
app.config ($routeProvider) ->
  $routeProvider.when "/profile",
    title: "User Profile"
    templateUrl: "modules/profile/profile.html"
    controller: "ProfileCtrl"

