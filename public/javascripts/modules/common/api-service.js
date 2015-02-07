(function() {
  "use strict";

  /*
  Service for providing access the backend API via HTTP and WebSockets.
   */
  angular.module("koan.common").factory("api", function($rootScope, $http, $window) {
    var api, apiBase, event, headers, index, token, ws, wsHost;
    apiBase = "api";
    token = $window.sessionStorage.token || $window.localStorage.token;
    headers = {
      Authorization: "Bearer " + token
    };
    wsHost = ($window.document.location.origin || ($window.location.protocol + "//" + $window.location.host)).replace(/^http/, "ws");
    api = {
      events: {}
    };
    ws = api.ws = new WebSocket(wsHost + "?access_token=" + token);
    $window.setInterval((function() {
      return ws.send("ping");
    }), 1000 * 25);
    event = function() {
      var callbacks;
      callbacks = $.Callbacks();
      return {
        subscribe: function($scope, fn) {
          if (fn) {
            $scope.$on("$destroy", function() {
              return callbacks.remove(fn);
            });
          } else {
            fn = $scope;
          }
          return callbacks.add(fn);
        },
        unsubscribe: callbacks.remove,
        publish: callbacks.fire
      };
    };
    api.connected = event();
    ws.onopen = function() {
      api.connected.publish.apply(this, arguments);
      return $rootScope.$apply();
    };
    api.disconnected = event();
    ws.onclose = function() {
      api.disconnected.publish.apply(this, arguments);
      return $rootScope.$apply();
    };
    api.posts = {
      list: function() {
        return $http({
          method: "GET",
          url: apiBase + "/posts",
          headers: headers
        });
      },
      create: function(post) {
        return $http({
          method: "POST",
          url: apiBase + "/posts",
          data: post,
          headers: headers
        });
      },
      created: event(),
      comments: {
        create: function(postId, comment) {
          return $http({
            method: "POST",
            url: apiBase + "/posts/" + postId + "/comments",
            data: comment,
            headers: headers
          });
        },
        created: event()
      }
    };
    api.debug = {
      clearDatabase: function() {
        return $http({
          method: "POST",
          url: apiBase + "/debug/clearDatabase",
          headers: headers
        });
      }
    };
    index = function(obj, i) {
      return obj[i];
    };
    ws.onmessage = function(event) {
      var data;
      data = JSON.parse(event.data);
      if (!data.method) {
        throw "Malformed event data received through WebSocket. Received event data object was: " + data;
      } else {
        if (!data.method.split(".").reduce(index, api)) {
          throw "Undefined event type received through WebSocket. Received event data object was: " + data;
        }
      }
      return data.method.split(".").reduce(index, api).publish(data.params);
    };
    return api;
  });

}).call(this);
