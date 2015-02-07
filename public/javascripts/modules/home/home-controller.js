(function() {
  "use strict";
  angular.module("koan.home").controller("HomeCtrl", function($scope, api) {
    var user;
    user = $scope.common.user;
    $scope.postBox = {
      message: null,
      disabled: false
    };
    api.posts.list().success(function(posts) {
      posts.forEach(function(post) {
        post.commentBox = {
          message: "",
          disabled: false
        };
        return post.comments = post.comments || [];
      });
      return $scope.posts = posts;
    });
    $scope.createPost = function($event) {
      if (!$scope.postBox.message.length || $scope.postBox.disabled) {
        $event.preventDefault();
      }
      $scope.postBox.disabled = true;
      return api.posts.create({
        message: $scope.postBox.message
      }).success(function(post) {
        if (!_.some($scope.posts, function(p) {
          return p.id === post.id;
        })) {
          $scope.posts.unshift({
            id: post.id,
            from: user,
            message: $scope.postBox.message,
            createdTime: new Date(),
            comments: [],
            commentBox: {
              message: "",
              disabled: false
            }
          });
        }
        $scope.postBox.message = "";
        return $scope.postBox.disabled = false;
      }).error(function() {
        return $scope.postBox.disabled = false;
      });
    };
    $scope.createComment = function($event, post) {
      if ($event.keyCode !== 13) {
        return;
      }
      if (!post.commentBox.message.length || post.commentBox.disabled) {
        $event.preventDefault();
      }
      post.commentBox.disabled = true;
      api.posts.comments.create(post.id, {
        message: post.commentBox.message
      }).success(function(comment) {
        if (!_.some(post.comments, function(c) {
          return c.id === comment.id;
        })) {
          post.comments.push({
            id: comment.id,
            from: user,
            message: post.commentBox.message,
            createdTime: new Date()
          });
        }
        post.commentBox.message = "";
        return post.commentBox.disabled = false;
      }).error(function() {
        return post.commentBox.disabled = false;
      });
      return $event.preventDefault();
    };
    api.posts.created.subscribe($scope, function(post) {
      if (!_.some($scope.posts, function(p) {
        return p.id === post.id;
      })) {
        post.comments = [];
        post.commentBox = {
          message: "",
          disabled: false
        };
        return $scope.posts.unshift(post);
      }
    });
    return api.posts.comments.created.subscribe($scope, function(comment) {
      var post;
      post = _.find($scope.posts, function(post) {
        return post.id === comment.postId;
      });
      if (post && !_.some(post.comments, function(c) {
        return c.id === comment.id;
      })) {
        return post.comments.push(comment);
      }
    });
  });

}).call(this);
