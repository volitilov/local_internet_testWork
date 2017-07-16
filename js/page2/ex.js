window.onload = function() {
	var balans = document.querySelector('#balans');

	user = {
		surname: "Фамилия",
		firstName: "Имя",
		middle_name: "Отчество",
		age: "20 лет",
		balans: 837456834
	}
	

	if (WebSocket) {
		wbskt_getBalans();
	} else {
		setInterval(function() {
			ajax_getBalans('/data.json', function(data) {
				balans.innerHTML = data['balans'];
			});
		}, 10000);
	}

	function ajax_getBalans(url, callback) {
		if (window.XMLHttpRequest) {
			// Для поддержки в IE8,9 события onerror
			var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
			var xhr = new XHR();
		} else {
			var xhr = new ActiveXObject('Microsoft.xhr');
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				try {
					var data = JSON.parse(xhr.responseText);
				} catch(err) {
					console.log(err.message + ' in ' + xhr.responseText);
					return;
				}
				callback(data);
			}
		};

		xhr.timeout = 20000;
		xhr.ontimeout = function() {
			document.querySelector('#errorBalans').innerHTML = 'Извините, запрос превысил максимальное время';
		}

		xhr.onabort = function() {
			document.querySelector('#errorBalans').innerHTML = 'запрос был отменён';
		}

		xhr.onerror = function() {
			document.querySelector('#errorBalans').innerHTML = 'произошла ошибка сервера';
		}
	 
		xhr.open('GET', url, true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send();
	}
	

	function wbskt_getBalans() {
		var socket = new WebSocket('ws://echo.websocket.org');

		socket.onopen = function(event) {
			console.log('socket open');
			setInterval(function() {
				socket.send(JSON.stringify(user));
			}, 10000);
		}

		socket.onmessage = function(event) {
			var data = JSON.parse(event.data);
			balans.innerHTML = data['balans'];
		}

		socket.onclose = function(event) {
			if (event.wasClean) {
				document.querySelector('#errorBlock').innerHTML = 'Соединение закрыто.';
			} else {
				document.querySelector('#errorBlock').innerHTML = 'Обрыв соединения по причине: ' + event.reason;
			}
		}

		socket.onerror = function(event) {
			document.querySelector('#errorBlock').innerHTML = 'Произошла ошибка сервера.';
		}
	}
}
