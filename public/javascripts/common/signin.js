(function() {
  $('form').submit(function(event) {
    event.preventDefault();
    return $.ajax({
      type: 'POST',
      url: '/signin',
      data: JSON.stringify({
        email: $('#email').val(),
        password: $('#password').val()
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
        var storage;
        storage = $('#rememberme').is(':checked') ? window.localStorage : window.sessionStorage;
        storage.token = data.token;
        storage.user = JSON.stringify(data.user);
        return window.location.replace('/');
      },
      error: function(res) {
        return $('form p.help-block').text(res.responseText);
      }
    });
  });

}).call(this);
