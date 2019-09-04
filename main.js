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
	paused = true;
	setInterval( () => paused = false, 5000 );
	slider.style.transition = transitionScheme; 
	// counter++;
	amount = direction * size + initSize;
	slider.style.transform = `translateX(${amount}px)`;
});

prevBtn.addEventListener('click', () => {
	direction = 1;
	paused = true;
	setInterval( () => paused = false, 5000 );
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

// auto slide 5 sec 
let paused = false;
let interval = setInterval( () => {
	(!paused) && nextBtn.click();
}, 5000);
