window.onload = function() {

	// получаю все необходимые DOM эленменты
	var form = document.forms.page1_form;
	var inp_surname = form.elements.surname;
	var inp_firstName = form.elements.firstName;
	var inp_middleName = form.elements.middle_name;
	var inp_age = form.elements.age;
	var submit = form.elements.save;
	var mas_inp = [inp_surname, inp_firstName, inp_middleName];


	// Отменяю отправку формы клавишей "Enter"
	form.addEventListener('keydown', function(event) {
		event = event || window.event;
		if(event.keyCode == 13) {
			return false;
		}
	});


	// перебираю масив инпутов и вешаю на них обработчик события
	// если инпуты меняется, то возвращаю кнопку в первоначальное состояние
	// также смотрю если инпуты больше 15 символов и пустые, то сразу меняю цвет 
	// на красный, иначе отменяю цвет. 
	for (var i = 0; i < mas_inp.length; i++) {
		mas_inp[i].oninput = function() {
			submit.value = "Сохранить изменения!";
			submit.disabled = false;
			if (this.value.length > 15 || this.value.length == '') {
				this.className = 'input-error';
			} else {
				this.className = '';
			}
		}
	}


	// вешую обработчик на кнопку отправки данных
	submit.onclick = function(event) {
		var event = event || window.event;
		event.preventDefault();
		var count = 0;


		for (var i = 0; i < mas_inp.length; i++) {
			if (mas_inp[i].value.length < 15 && mas_inp[i].value.length != '') {
				count++;
			}
		}

		if (inp_age.value < 18 || inp_age.value > 50) {
			inp_age.className = 'input-error';
		} else {
			inp_age.className = '';
			count++;
		}

		if (count == 4) {
			var user = {
				surname: inp_surname.value,
				firstname: inp_firstName.value,
				middleName: inp_middleName.value,
				age: inp_age.value + ' лет',
				balans: "745 руб."
			}

			if (WebSocket) {
				openWebsocket(user);
			} else {
				openAjax(user);
			}

		}
		return false;
	}

	function openAjax(user) {
		if (window.XMLHttpRequest) {
			var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
			var xhr = new XHR();
		} else {
			var xhr = new ActiveXObject('Microsoft.xhr');
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				try {
					document.querySelector('#list').innerHTML = '';
					for (var key in user) {
						var li = list.appendChild(document.createElement('li'));
						li.innerHTML = user[key];
					}

					// var data = JSON.parse(xhr.responseText);
					// for (var key in data) {
					// 	var li = list.appendChild(document.createElement('li'));
					// 	li.innerHTML = data[key];
					// }

					submit.value = 'Ваши данные сохранены!';
				} catch(err) {
					console.log(err.message + ' in ' + xhr.responseText);
					return;
				}
			}
		};


		xhr.open("POST", '/data.json', true)
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(user));
		
		submit.value = 'Сохраняю...';
		submit.disabled = true;
	}


	function openWebsocket(user) {
		var socket = new WebSocket("ws://echo.websocket.org");

		socket.onopen = function(event) {
			console.log('socket open');
			socket.send(JSON.stringify(user));
			submit.value = 'Сохраняю...';
			submit.disabled = true;
		}

		socket.onmessage = function(event) {
			var obj = JSON.parse(event.data);
			document.querySelector('#list').innerHTML = '';
			for (var key in obj) {
				var li = list.appendChild(document.createElement('li'));
				li.innerHTML = obj[key];
			}
			socket.close();
			submit.value = 'Ваши данные сохранены!';
		}

		socket.onclose = function(event) {
			if (event.wasClean) {
				// document.querySelector('#errorBlock').innerHTML = 'Соединение закрыто.';
			} else {
				document.querySelector('#errorBlock').innerHTML = 'Обрыв соединения по причине: ' + event.reason;
			}
		}

		socket.onerror = function(event) {
			document.querySelector('#errorBlock').innerHTML = 'Произошла ошибка сервера.';
		}
	}

}
