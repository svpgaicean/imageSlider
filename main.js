'use strict';
const thumbBar = document.querySelector('.thumb-bar');
const dotBar = document.querySelector('.dot-bar');
const slider = document.querySelector('.slider');
const container = document.querySelector('.container');

let size; // image width
let initSize;

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

function autoSlide() {
	let intervalId;
	function resetInterval() {
		intervalId = setInterval(nextSlide, 5000);
	}

	function nextSlide() {
		nextBtn.click();
	}

	function pauseSlide() {
		clearInterval(intervalId);
		resetInterval();
	}

	nextBtn.addEventListener('click', pauseSlide);
	prevBtn.addEventListener('click', pauseSlide);
	window.addEventListener('load', resetInterval);
}

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

function init() {
	getJSON("http://localhost:5000/images")
		.then(parseJSON)
		.catch(function (err) {
			console.log(err);
		})
		.then(generateElements)
		.then(autoSlide)
}

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

function generateElements(jsonData) {
	const imageCount = jsonData.data.length;
	const sliderImages = generateSlider(jsonData, imageCount);
	alignSliderImages(sliderImages[0]);
	generateThumbBar(jsonData, imageCount);

	container.insertAdjacentHTML('beforeend', '<p class="image-current"></p>');
	container.insertAdjacentHTML('beforeend', '<p class="image-name"></p>');
	container.insertAdjacentHTML('beforeend', '<p class="image-description"></p>');
	toggleActive(jsonData, counter, imageCount);
	slider.addEventListener('transitionend', () => {
		toggleActive(jsonData, counter, imageCount);
	});	
}

function alignSliderImages(firstImage) {
	firstImage.addEventListener('load', () => {
		size = firstImage.clientWidth;
		initSize = -(size + size/2);
		slider.prepend(slider.lastElementChild);
		slider.prepend(slider.lastElementChild);
		slider.style.transform = `translateX(${initSize}px)`;
	});
}

function generateSlider(jsonData, count) {
	if (count === 0) {
		// handle no image
	}
	else if (count === 1) {
		// handle one image
	}
	else {
		for (let i = 0; i < count; i++) {
			const newSliderImg = document.createElement('img');
			newSliderImg.setAttribute('src', `${jsonData.data[i].url}`);
			newSliderImg.setAttribute('alt', `${jsonData.data[i].name}`);
			slider.appendChild(newSliderImg);
		}

		// append clone elements to slider for correct behaviour 
		const children = [...slider.children];
		while (count < 5) {
			const clones = children.map(child => child.cloneNode(true));
			clones.forEach(clone => slider.appendChild(clone));
			count += clones.length;
		}
	}
	return document.querySelectorAll('.slider img'); 
}

function generateThumbBar(jsonData, count) {
	for (let i = 0; i < count; i++) {
		const newThumbImg = document.createElement('img');
		newThumbImg.setAttribute('src', `${jsonData.data[i].url}`);
		newThumbImg.setAttribute('alt', `${jsonData.data[i].name}`);
		if (i === 0) {
			newThumbImg.setAttribute('class', ' active');
		}
		newThumbImg.addEventListener('click', renderImg);
		thumbBar.appendChild(newThumbImg);
	}
}
	
function toggleActive(jsonData, counter, imgCount) {
	const imgCurrent = document.querySelector('.image-current');
	const imgName = document.querySelector('.image-name');
	const imgDescr = document.querySelector('.image-description');
	let images = document.querySelectorAll('.thumb-bar img');
	let displayIdx;
	let activeImage = document.getElementsByClassName("active");
	activeImage[0].className = activeImage[0].className.replace(" active", "");

	if (counter >= 0) {
		displayIdx = Math.abs(counter) % imgCount;
	}
	else if (counter < 0) {
		displayIdx = imgCount - (Math.abs(counter) % imgCount);
		if (displayIdx === imgCount) displayIdx = 0;
	}
	images[displayIdx].className += " active";
	imgCurrent.textContent = `Image ${displayIdx + 1} of ${imgCount}`;
	imgName.textContent = `${jsonData.data[displayIdx].name}`;
	imgDescr.textContent = `${jsonData.data[displayIdx].short_description}`;
}

init();