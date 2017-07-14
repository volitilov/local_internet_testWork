var form = document.forms.page1_form;

var surname 		= form.elements.surname;
var name 			= form.elements.name;
var middle_name 	= form.elements.middle_name;
var age 			= form.elements.age;


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



function checkChar(element) {
	var error1 = new MessageError();

	var badString = '[]{}!@#$%^&*()+= |?/.,\'<>~`":;№»';
	var mas_badString = [];
	for (var i = 0; i < badString.length; i++) {
		mas_badString.push(badString[i]);
	}


	// element.onkeypress = function() {
	// 	for (var a = 0; a < mas_badString.length; a++) {
	// 		if (getChar(event) == mas_badString[a]) {
	// 			error1.message = 'текст не должен содержать { ' + getChar(event) + ' }';
	// 			// добавляем стилизованный класс для инпута
	// 			this.className = 'input-error';
	// 			// выводим сообщения об ошибке
	// 			error1.showMessage();
	// 		} else {
	// 			// // очищаем стили сообщения об ошибке
	// 			// error1.block.className = '';
	// 			// // убираем текст ошибки
	// 			// error1.block.innerHTML = '';
	// 			// // убираем добавленные стили инпута
	// 			// this.className = '';
	// 		}
	// 	}
	// }
	element.onkeypress = function() {
		for (var a = 0; a < mas_badString.length; a++) {
			if ( this.value.search( /mas_badString[a]/ig ) ) {
				error1.message = 'текст не должен содержать { ' + getChar(event) + ' }';
				// добавляем стилизованный класс для инпута
				this.className = 'input-error';
				// выводим сообщения об ошибке
				error1.showMessage();
			} else {
				// // очищаем стили сообщения об ошибке
				error1.block.className = '';
				// // убираем текст ошибки
				error1.block.innerHTML = '';
				// // убираем добавленные стили инпута
				this.className = '';
			}
		}
	}
}



// суть функции состоит в том чтобы проверять поле ввода на колличество
// введённых символов и в случае если кол-во введённых символов превышает
// задданый праметр, то сгенерируем и выведем ошибку. Функции срабатывает,
// при каждой нажатой клавише
function checkSize(element, size) {
	// создаём новый объект ошибки
	var error = new MessageError();
	// задаём сообщения
	error.message = '{ ' + element.name + ' }' + ' должен быть не больше ' + size + ' символов';
	
	// считаем каждый введённый символ
	element.oninput = function() {
		// если длина введённого значения больше заданного параметра, то:
		if (this.value.length > size) {
			// добавляем стилизованный класс для инпута
			this.className = 'input-error';
			// выводим сообщения об ошибке
			error.showMessage();
		// если длина введённого значения меньше заданного параметра, то:
		} else {
			// очищаем стили сообщения об ошибке
			error.block.className = '';
			// убираем текст ошибки
			error.block.innerHTML = '';
			// убираем добавленные стили инпута
			this.className = '';
		}
	}
};


// checkSize(surname, 15);
checkChar(surname);
