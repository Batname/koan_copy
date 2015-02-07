'use strict';

###*
 * Top level module. Lists all the other modules as dependencies.
###

app = angular.module("koan", [
	"ngRoute"
	"angular-loading-bar"
	"koan.common"
	"koan.home"
	"koan.profile"
])

app.config ($routeProvider, $locationProvider, cfpLoadingBarProvider) ->
  cfpLoadingBarProvider.includeSpinner = false
  cfpLoadingBarProvider.latencyThreshold = 500
  $locationProvider.html5Mode true
  $routeProvider.otherwise 
  	redirectTo: '/'

app.run ($location, $rootScope, $window, $route, api) ->
  # attach commonly used info to root scope to be available to all controllers/views
  common = $rootScope.common = $rootScope.common or
    active: {}
    user: JSON.parse($window.sessionStorage.user or $window.localStorage.user)
    logout: ->
      delete $window.sessionStorage.token
      delete $window.sessionStorage.user
      delete $window.localStorage.token
      delete $window.localStorage.user
      $window.location.replace '/signin.html'
    clearDatabase: ->
      self = this
      api.debug.clearDatabase().success ->
        self.logout()

	  # declare websocket event listeners for backend api
	  api.connected.subscribe ->
	    common.onlineIndicatorStyle = 'background-color': 'green'

	  api.disconnected.subscribe ->
	    common.onlineIndicatorStyle = 'background-color': 'lightgrey'

	  # set actions to be taken each time the user navigates
	  $rootScope.$on '$routeChangeSuccess', (event, current, previous) ->

	    # set page title
	    $rootScope.common.title = current.$$route.title
	    
	    # set active menu class for the left navigation (.sidenav)
	    currentCtrl = current.controller.substring(0, current.controller.indexOf('Ctrl')).toLowerCase()
	    $rootScope.common.active[currentCtrl] = 'active'
	    if previous
	      previousCtrl = previous.controller.substring(0, previous.controller.indexOf('Ctrl')).toLowerCase()
	      delete $rootScope.common.active[previousCtrl]
