var displayedImage = document.querySelector('.displayed-img');
var thumbBar = document.querySelector('.thumb-bar');

var btn = document.getElementById('button');
var btn_back = document.querySelector('.back');
var btn_frwd = document.querySelector('.frwd');
var overlay = document.querySelector('.overlay');


/* Looping through images */
for (let i = 1; i <= 5; i++) {
  var newImage = document.createElement('img');
  newImage.setAttribute('src', `./images/pic${i}.jpg`);
	thumbBar.appendChild(newImage);
	newImage.addEventListener('click', renderImg);
}

function renderImg(e) {
	let src = e.target.getAttribute('src');
	displayedImage.setAttribute('src', `${src}`);
}

function renderBck() {
	let src = displayedImage.getAttribute('src');
	let pos = src.charAt(src.search(/[0-9]/));

	if (pos == 1) {
		displayedImage.setAttribute('src', './images/pic5.jpg')
	}
	else {
		displayedImage.setAttribute('src', `./images/pic${--pos}.jpg`);
	}
}

function renderFwd() {
	let src = displayedImage.getAttribute('src');
	let pos = src.charAt(src.search(/[0-9]/));

	if (pos == 5) {
		displayedImage.setAttribute('src', './images/pic1.jpg')
	}
	else {
		displayedImage.setAttribute('src', `./images/pic${++pos}.jpg`);
	}
}

btn_back.addEventListener('click', renderBck);
btn_frwd.addEventListener('click', renderFwd);


/* Wiring up the Darken/Lighten button */
function changeBrightness() {
	let btn_class = btn.getAttribute('class');

	if (btn_class === 'dark') {
		btn.setAttribute('class', 'light');
		btn.textContent = 'Lighten';
		overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
	} else {
		btn.setAttribute('class', 'dark');
		btn.textContent = 'Darken';
		overlay.style.backgroundColor = 'rgba(0,0,0,0)';
	}
}
btn.addEventListener('click', changeBrightness);
