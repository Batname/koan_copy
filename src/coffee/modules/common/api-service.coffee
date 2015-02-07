"use strict"

###
Service for providing access the backend API via HTTP and WebSockets.
###
angular.module("koan.common").factory "api", ($rootScope, $http, $window) ->


  apiBase = "api"
  token = ($window.sessionStorage.token or $window.localStorage.token)
  headers = Authorization: "Bearer " + token
  wsHost = ($window.document.location.origin or ($window.location.protocol + "//" + $window.location.host)).replace(/^http/, "ws")
  api = events: {}
  ws = api.ws = new WebSocket(wsHost + "?access_token=" + token)
  $window.setInterval (->
    ws.send "ping"
  ), 1000 * 25
  
  event = ->
    callbacks = $.Callbacks()
    subscribe: ($scope, fn) ->
      if fn
        # unsubscribe from event on controller destruction to prevent memory leaks
        $scope.$on "$destroy", ->
          callbacks.remove fn

      else
        fn = $scope
      callbacks.add fn

    unsubscribe: callbacks.remove
    publish: callbacks.fire
  
  api.connected = event()
  ws.onopen = ->
    api.connected.publish.apply this, arguments
    $rootScope.$apply()

  api.disconnected = event()
  ws.onclose = ->
    api.disconnected.publish.apply this, arguments
    $rootScope.$apply()

  api.posts =
    list: ->
      $http
        method: "GET"
        url: apiBase + "/posts"
        headers: headers


    create: (post) ->
      $http
        method: "POST"
        url: apiBase + "/posts"
        data: post
        headers: headers


    created: event()
    comments:
      create: (postId, comment) ->
        $http
          method: "POST"
          url: apiBase + "/posts/" + postId + "/comments"
          data: comment
          headers: headers


      created: event()

  api.debug = clearDatabase: ->
    $http
      method: "POST"
      url: apiBase + "/debug/clearDatabase"
      headers: headers

  index = (obj, i) ->
    obj[i]

  # convert dot notation string into an actual object index
  ws.onmessage = (event) -> # websocket event object
    data = JSON.parse(event.data) # rpc event object (data)
    unless data.method
      throw "Malformed event data received through WebSocket. Received event data object was: " + data
    else throw "Undefined event type received through WebSocket. Received event data object was: " + data  unless data.method.split(".").reduce(index, api)
    data.method.split(".").reduce(index, api).publish data.params

  api
