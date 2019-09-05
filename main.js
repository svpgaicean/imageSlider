'use strict';
const thumbBar = document.querySelector('.thumb-bar');
const dotBar = document.querySelector('.dot-bar');
const slider = document.querySelector('.slider');
const container = document.querySelector('.container');

let size; // image width
let initSize;

let imgCount = 10; // hardcoded for now
function parseImages(count) {
	for (let i = 1; i <= count; i++) {
		const newThumbImg = document.createElement('img');
		const newSliderImg = document.createElement('img');
		const newDot = document.createElement('span');

		newThumbImg.setAttribute('src', `./images/pic${i}.jpg`);
		newThumbImg.setAttribute('class', `idx${i}`);
		newSliderImg.setAttribute('src', `./images/pic${i}.jpg`);
		if (i === 1) {
			newDot.setAttribute('class', `dot idx${i} active`);
		} else {
			newDot.setAttribute('class', `dot idx${i}`);
		}
		
		thumbBar.appendChild(newThumbImg);
		newThumbImg.addEventListener('click', renderImg);
		dotBar.appendChild(newDot);
		newDot.addEventListener('click', renderImg);

		slider.appendChild(newSliderImg);
	}
}
parseImages(imgCount);

const images = document.querySelectorAll('.slider img');

images[0].addEventListener('load', () => {
	size = images[0].clientWidth;
	initSize = -(size + size/2);
	// initSize = -size/2;
	slider.prepend(slider.lastElementChild);
	slider.prepend(slider.lastElementChild);
	slider.style.transform = `translateX(${initSize}px)`;
});

const transitionScheme = 'transform 0.5s ease-in-out';

// Buttons
const nextBtn = document.querySelector('.nextBtn');
const prevBtn = document.querySelector('.prevBtn');

// Counter
let counter = 0;
let amount;
let direction;

// Button Listeners
nextBtn.addEventListener('click', () => {
	direction = -1;
	slider.style.transition = transitionScheme; 
	// counter++;
	amount = direction * size + initSize;
	slider.style.transform = `translateX(${amount}px)`;
});

prevBtn.addEventListener('click', () => {
	direction = 1;
	slider.style.transition = transitionScheme; 
	// counter--;
	amount = direction * size + initSize;
	slider.style.transform = `translateX(${amount}px)`;
});

slider.addEventListener('transitionend', () => {
	if (direction === 1) { // backwards
		slider.prepend(slider.lastElementChild);
		counter--;
	} else if (direction === -1) { // forwards
		slider.appendChild(slider.firstElementChild);
		counter++;
	}

	slider.style.transition = 'none';
	slider.style.transform = `translate(${initSize}px)`;
	setTimeout( () => {
		slider.style.transition = transitionScheme;
	})
});

function renderImg(e) {
	let src = e.target.getAttribute('class');
	let pos = src.charAt(src.search(/[0-9]+/));
	if (pos > counter) {
		while (counter < pos) {
			nextBtn.click();
		}
	} else if (pos < counter) {
		while (counter > pos) {
			prevBtn.click();
		}
	} else {
		// do nothing
	}
}

function toggleActiveDot(counter, imgCount) {
	let dots = document.getElementsByClassName('dot');
	let displayIdx;
	let activeDot = document.getElementsByClassName('dot active');

	activeDot[0].className = activeDot[0].className.replace(" active", "");

	if (counter >= 0) {
		displayIdx = Math.abs(counter) % imgCount;
	}
	else if (counter < 0) {
		displayIdx = imgCount - (Math.abs(counter) % imgCount);
		if (displayIdx === imgCount) displayIdx = 0;
	}
	dots[displayIdx].className += " active";
}

slider.addEventListener('transitionend', () => {
	toggleActiveDot(counter, imgCount);
});

container.insertAdjacentHTML('beforeend',
'<p class="current-image"></p>');
const p = document.querySelector('.current-image');
p.textContent = `Image ${1} of ${imgCount}`;

function toggleActive(counter, imgCount) {
	let displayIdx;

	if (counter >= 0) {
		displayIdx = Math.abs(counter) % imgCount;
	}
	else if (counter < 0) {
		displayIdx = imgCount - (Math.abs(counter) % imgCount);
		if (displayIdx === imgCount) displayIdx = 0;
	}
	p.textContent = `Image ${displayIdx + 1} of ${imgCount}`;
}

slider.addEventListener('transitionend', () => {
	toggleActive(counter, imgCount);
});

// --- autoslide ---
let intervalId;

function autoSlide() {
	intervalId = setInterval(nextSlide, 5000);
}

function nextSlide() {
	nextBtn.click();
}

function pauseSlide() {
	clearInterval(intervalId);
	autoSlide();
}

nextBtn.addEventListener('click', pauseSlide);
prevBtn.addEventListener('click', pauseSlide);
window.addEventListener('load', autoSlide);

// ------- AJAX ------
// const xhr = new XMLHttpRequest;
// xhr.onreadystatechange = function () {
// 	if (xhr.readyState === 4) {
// 		if (xhr.status === 200) {
// 			console.log(xhr.responseText);
// 		}
		
// 		if (xhr.status === 404) {
// 			console.log('File or resource not found');
// 		}
// 	}
// }
// xhr.open('get', 'http://localhost:5000/images');
// xhr.send();

// --------- AJAX promise version ---------
function getJSON(url) {
	return new Promise(function(resolve, reject) {
		const xhr = new XMLHttpRequest;

		xhr.onload = function() { // 404 goes here aswell
			resolve(this);
		};

		xhr.onerror = function() {
			reject(new Error("Network error"));
		}

		xhr.open('get', url);
		xhr.send();
	});
}

getJSON("http://localhost:5000/images")
	// .then(getXHR)
	.then(parseJSON)
	.catch(function (err) {
		console.log(err);
	})
	.then(parseImages2)

function parseJSON(xhr) {
	if (xhr.status !== 200) {
		console.log("File or resource not found");
	} else {
		try {
			return JSON.parse(xhr.responseText);
		} catch (err) {
			console.log(err);
		}
	}
}

// rename to "generateSlider"
function parseImages2(jsonData) {
	const count = jsonData.data.length; 
	for (let i = 0; i < count; i++) {
		const newSliderImg = document.createElement('img');
		newSliderImg.setAttribute('src', `${jsonData.data[i].url}`);
		slider.appendChild(newSliderImg);
	}
}