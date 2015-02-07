(function() {
  var data, token, tokenParam, tokenParamMatch, user;

  tokenParamMatch = RegExp('[?&]user=([^&]*)').exec(window.location.search);

  tokenParam = tokenParamMatch && decodeURIComponent(tokenParamMatch[1].replace(/\+/g, ' '));

  if (tokenParam) {
    data = JSON.parse(tokenParam);
    window.localStorage.token = data.token;
    window.localStorage.user = JSON.stringify(data.user);
  } else {
    token = window.sessionStorage.token || window.localStorage.token;
    user = token && JSON.parse(window.sessionStorage.user || window.localStorage.user);
    if (!user || user.exp < Math.round((new Date).getTime() / 1000)) {
      window.location.replace('/signin.html');
    }
  }

}).call(this);
