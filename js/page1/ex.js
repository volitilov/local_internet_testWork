window.onload = function() {

	// получаю все необходимые DOM эленменты
	var form = document.forms.page1_form;
	var inp_surname = form.elements.surname;
	var inp_firstName = form.elements.firstName;
	var inp_middleName = form.elements.middle_name;
	var inp_age = form.elements.age;
	var submit = form.elements.save;
	var mas_inp = [inp_surname, inp_firstName, inp_middleName];
	var count = 0;


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
				co
			} else {
				this.className = '';
			}
		}
	}


	// вешую обработчик на кнопку отправки данных
	submit.onclick = function(event) {
		var event = event || window.event;
		event.preventDefault();
		var carma = 0;

		// перебераю инпуты и смотрю, чтобы они не были больше 15 символов 
		// и небыли пустыми и если всё норм, то плюс 1 к карме) 
		for (var i = 0; i < mas_inp.length; i++) {
			if (mas_inp[i].value.length < 15 && mas_inp[i].value.length != '') {
				carma++;
			}
		}

		// проверяю возраст, чтобы был не больше 18 и не старше 50 и если 
		// всё норм, то плюс 1 к карме.
		if (inp_age.value < 18 || inp_age.value > 50) {
			inp_age.className = 'input-error';
		} else {
			inp_age.className = '';
			carma++;
		}

		// если количество провереных полей 4, то можно отправлять данные на
		// сервер
		if (carma == 4) {
			// создаю тестовый объект
			var user = {
				surname: inp_surname.value,
				firstname: inp_firstName.value,
				middleName: inp_middleName.value,
				age: inp_age.value + ' лет',
				balans: "745 руб."
			}

			// проверяю если браузер поддерживает сокеты, то устанавлюваю
			// соеденение, через сокет, так это быстрее, надёжнее, иначе
			// через ajax/
			if (WebSocket) {
				openWebsocket(user);
			} else {
				openAjax(user);
			}

		}
		return false;
	}

	// отправка данных через аякс
	function openAjax(user) {
		// проверяю поддерживает ли браузер объект XMLHttpRequest
		if (window.XMLHttpRequest) {
			var xhr = new XMLHttpRequest();
		} else {
			// для старых "експ"
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

	// отправка данных через websocket
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
