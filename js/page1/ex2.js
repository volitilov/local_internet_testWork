var form = document.forms.page1_form;

var surname 		= form.elements.surname;
var name 			= form.elements.name;
var middle_name 	= form.elements.middle_name;
var age 			= form.elements.age;
var submit 			= form.elements.save;

var mas_element 	= [];
mas_element.push(surname);
mas_element.push(name);
mas_element.push(middle_name);


form.addEventListener('keydown', function(event) {
	event = event || window.event;
	if(event.keyCode == 13) {
		event.preventDefault();
	}
});


function MessageError() {
	var main_block 			= document.getElementById('block');
	this.block 				= document.createElement('div');
	this.message 			= '';

	this.showMessage = function() {
		this.block.innerHTML = this.message;
		this.block.className = 'error-message';

		main_block.appendChild(this.block);
	}
}


// кросбраузерный способ получить введённый символ
function getChar(event) {
	// IE
	if (event.which == null) {
		// спец. символ
		if (event.keyCode < 32) return null;
		return String.fromCharCode(event.keyCode)
	}
	// все кроме IE
	if (event.which != 0 && event.charCode != 0) {
		// спец. символ
		if (event.which < 32) return null;
		// остальные
		return String.fromCharCode(event.which);
	}

	// спец. символ
	return null; 
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

	if (checkSize(surname, 15) == false) {
		// создаём новый объект ошибки
		var error = new MessageError();
		// задаём сообщения
		error.message = '{ ' + surname.name + ' }' + ' должен быть не больше ' + 15 + ' символов';
		// добавляем стилизованный класс для инпута
		surname.className = 'input-error';
		// выводим сообщения об ошибке
		error.showMessage();
	}
	

	return false;
}
