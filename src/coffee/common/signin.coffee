$('form').submit((event) -> 
	event.preventDefault()
	$.ajax
		type: 'POST',
		url: '/signin',
		data: JSON.stringify
			email: $('#email').val()
			password: $('#password').val()
		contentType: 'application/json'
		dataType: 'json'
		success: (data) -> 
      storage = if $('#rememberme').is(':checked') then window.localStorage else window.sessionStorage
      storage.token = data.token
      storage.user = JSON.stringify(data.user)
      window.location.replace('/')
		error: (res) -> 
		  $('form p.help-block').text(res.responseText)		
)		  
