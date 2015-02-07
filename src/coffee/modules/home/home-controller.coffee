"use strict"

angular.module("koan.home").controller "HomeCtrl", ($scope, api) ->
  user = $scope.common.user
  $scope.postBox =
    message: null
    disabled: false

  
  api.posts.list().success (posts) ->
    posts.forEach (post) ->
      post.commentBox =
        message: ""
        disabled: false

      post.comments = post.comments or []

    $scope.posts = posts

  
  $scope.createPost = ($event) ->
    
    if not $scope.postBox.message.length or $scope.postBox.disabled
      $event.preventDefault()
    
    $scope.postBox.disabled = true
    
    api.posts.create(message: $scope.postBox.message).success((post) ->
      unless _.some($scope.posts, (p) ->
        p.id is post.id
      )
        $scope.posts.unshift
          id: post.id
          from: user
          message: $scope.postBox.message
          createdTime: new Date()
          comments: []
          commentBox:
            message: ""
            disabled: false

      $scope.postBox.message = ""
      $scope.postBox.disabled = false
    ).error ->
      $scope.postBox.disabled = false


  $scope.createComment = ($event, post) ->
    return if $event.keyCode isnt 13
    
    if not post.commentBox.message.length or post.commentBox.disabled
      $event.preventDefault()
    
    post.commentBox.disabled = true
    
    api.posts.comments.create(post.id,
      message: post.commentBox.message
    ).success((comment) ->
      unless _.some(post.comments, (c) ->
        c.id is comment.id
      )
        post.comments.push
          id: comment.id
          from: user
          message: post.commentBox.message
          createdTime: new Date()

      post.commentBox.message = ""
      post.commentBox.disabled = false
    ).error ->
      post.commentBox.disabled = false
    $event.preventDefault()

  api.posts.created.subscribe $scope, (post) ->
    unless _.some($scope.posts, (p) ->
      p.id is post.id
    )
      post.comments = []
      post.commentBox =
        message: ""
        disabled: false
      $scope.posts.unshift post

  api.posts.comments.created.subscribe $scope, (comment) ->
    post = _.find($scope.posts, (post) ->
      post.id is comment.postId
    )
    post.comments.push comment  if post and not _.some(post.comments, (c) ->
      c.id is comment.id
    )

