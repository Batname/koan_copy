tokenParamMatch = RegExp('[?&]user=([^&]*)').exec(window.location.search)
tokenParam = tokenParamMatch and decodeURIComponent(tokenParamMatch[1].replace(/\+/g, ' '))
if tokenParam
  data = JSON.parse(tokenParam)
  window.localStorage.token = data.token
  window.localStorage.user = JSON.stringify(data.user)
else
  token = window.sessionStorage.token or window.localStorage.token
  user = token and JSON.parse(window.sessionStorage.user or window.localStorage.user)
  if !user or user.exp < Math.round((new Date).getTime() / 1000)
    window.location.replace '/signin.html'