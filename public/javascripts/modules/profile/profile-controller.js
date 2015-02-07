(function() {
  "use strict";
  angular.module("koan.profile").controller("ProfileCtrl", function($scope) {
    return $scope.user = $scope.common.user;
  });

}).call(this);
