"use strict"

###
Home module for displaying home page content.
###
app = angular.module("koan.home", [
	"ngRoute"
	"monospaced.elastic"
	"koan.common" 
])

app.config ($routeProvider) ->
  $routeProvider.when "/",
    title: "KOAN Home"
    templateUrl: "modules/home/home.html"
    controller: "HomeCtrl"