'use strict';
const thumbBar = document.querySelector('.thumb-bar');
const dotBar = document.querySelector('.dot-bar');
const slider = document.querySelector('.slider');
const images = document.querySelectorAll('.slider img');

// const transitionScheme = 'transform 1.5s ease-in-out';
const transitionScheme = 'transform 0.5s ease-in-out';

// Buttons
var nextBtn = document.querySelector('.nextBtn');
var prevBtn = document.querySelector('.prevBtn');

// Counter
let counter = 1;
const initSize = images[0].clientWidth/2;
const size = images[0].clientWidth;
// initial positioning of main display image
slider.style.transform = 'translateX(' + (-initSize * counter) + 'px)';

// Button Listeners
nextBtn.addEventListener('click', () => {
	if (counter >= images.length - 1) return;	
	slider.style.transition = transitionScheme; 
	counter++;
	slider.style.transform = 'translateX(' + ((-size * counter)+initSize) + 'px)';
});

prevBtn.addEventListener('click', () => {
	if (counter <= 0) return; 
	slider.style.transition = transitionScheme; 
	counter--;
	slider.style.transform = 'translateX(' + ((-size * counter)+initSize) + 'px)';
});

slider.addEventListener('transitionend', () => {
	if (images[counter].id === 'last') {
		slider.style.transition = 'none';
		counter = images.length - 2; // minus the first and last clone
		slider.style.transform = 'translateX(' + ((-size * counter)+initSize) + 'px)';
	}
	if (images[counter].id === 'first') {
		slider.style.transition = 'none';
		counter = images.length - counter; // plus the first and last clone
		slider.style.transform = 'translateX(' + ((-size * counter)+initSize) + 'px)';
	}
})

/* Looping through images */
for (let i = 1; i <= 5; i++) {
	// thumbBar elements
	const newImage = document.createElement('img');
	newImage.setAttribute('src', `./images/pic${i}.jpg`);
	newImage.setAttribute('class', `idx${i}`);
	thumbBar.appendChild(newImage);
	newImage.addEventListener('click', renderImg);

	// dots elements
	const newDot = document.createElement('span');
	if (i === 1) {
		newDot.setAttribute('class', `dot idx${i} active`);
	} else {
		newDot.setAttribute('class', `dot idx${i}`);
	}
	dotBar.appendChild(newDot);
	newDot.addEventListener('click', renderImg);
}

function renderImg(e) {
	let src = e.target.getAttribute('class');
	let pos = src.charAt(src.search(/[0-9]+/));
	// console.log(`pos-counter = ${pos-counter} .. ${Math.floor(5/2)}`);
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

	if (counter > 5) {
		displayIdx = 1;
	}
	else if (counter < 1) {
		displayIdx = 5;
	}
	dots[displayIdx-1].className += " active";
}

toggleActiveDot();
slider.addEventListener('transitionstart', toggleActiveDot);

// /* Wiring up the Darken/Lighten button */
// function changeBrightness() {
// 	let btn_class = btn.getAttribute('class');

// 	if (btn_class === 'dark') {
// 		btn.setAttribute('class', 'light');
// 		btn.textContent = 'Lighten';
// 		overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
// 	} else {
// 		btn.setAttribute('class', 'dark');
// 		btn.textContent = 'Darken';
// 		overlay.style.backgroundColor = 'rgba(0,0,0,0)';
// 	}
// }
// btn.addEventListener('click', changeBrightness);
