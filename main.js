'use strict';
const thumbBar = document.querySelector('.thumb-bar');
const dotBar = document.querySelector('.dot-bar');
const slider = document.querySelector('.slider');

let size; // image width
let initSize;

let count = 10; // hardcoded for now
function parseImages(count) {
	for (let i = 1; i <= count; i++) {
		const newThumbImg = document.createElement('img');
		const newSliderImg = document.createElement('img');
		const newDot = document.createElement('span');

		newThumbImg.setAttribute('src', `./images/pic${i}.jpg`)
		newThumbImg.setAttribute('class', `idx${i}`);
		newSliderImg.setAttribute('src', `./images/pic${i}.jpg`)
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
parseImages(10);

const images = document.querySelectorAll('.slider img');

images[0].addEventListener('load', () => {
	size = images[0].clientWidth;
	initSize = -(size + size/2);
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
	counter++;
	amount = direction * size + initSize;
	slider.style.transform = `translateX(${amount}px)`;
});

prevBtn.addEventListener('click', () => {
	direction = 1;
	slider.style.transition = transitionScheme; 
	counter--;
	amount = direction * size + initSize;
	slider.style.transform = `translateX(${amount}px)`;
});

slider.addEventListener('transitionend', () => {
	if (direction === 1) {
		slider.prepend(slider.lastElementChild);
	} else if (direction === -1) {
		slider.appendChild(slider.firstElementChild);
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

function toggleActiveDot() {
	let dots = document.getElementsByClassName('dot');
	let displayIdx = counter;
	let activeDot = document.getElementsByClassName('dot active');

	activeDot[0].className = activeDot[0].className.replace(" active", "");

	if (counter > 10) {
		displayIdx = 1;
	}
	else if (counter < 1) {
		displayIdx = 10;
	}
	dots[displayIdx-1].className += " active";
}

slider.addEventListener('transitionstart', toggleActiveDot);
