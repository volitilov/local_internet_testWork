window.onload = function() {
	var form = document.forms.page1_form;
	var surname = form.elements.surname;
	var firstName = form.elements.firstName;
	var middle_name = form.elements.middle_name;
	var age = form.elements.age;
	var submit = form.elements.save;



	form.addEventListener('keydown', function(event) {
		event = event || window.event;
		if(event.keyCode == 13) {
			event.preventDefault();
		}
	});

	function MessageError() {
		var main_block = document.getElementById('block');
		this.block = document.createElement('div');
		this.message = '';

		this.showMessage = function() {
			this.block.innerHTML = this.message;
			this.block.className = 'error-message';

			main_block.appendChild(this.block);
		}
	}



	function checkValue(element) {
		var badString = '[]{}!@#$%^&*()+= |?/.,\'<>~`":;№»';

		for (var i = 0; i < badString.length; i++) {
			for (var a = 0; a < element.value.length; a++) {
				if (element.value[a] === badString[i]) {
					return false;
				}
			}
		}
	}



	function checkSize(element, size) {
		if (element.value.length > size) {
			return false;
		}
		if (element.value.length == '') {
			return false;
		}
	};


	submit.onclick = function(event) {
		event = event || window.event;
		event.preventDefault();

		if(age.value < 18 || age.value > 50) {
			var params = age.value;
		}

		loadPhones();
		
	}

	function loadPhones() {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', 'phones.json', false);
		xhr.send();

		if (xhr.status != 200) {
			// обработать ошибку
			alert('Ошибка ' + xhr.status + ': ' + xhr.statusText);
		} else {
			// вывести результат
			alert(xhr.responseText);
		}
	}
}
