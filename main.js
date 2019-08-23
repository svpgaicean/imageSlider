var thumbBar = document.querySelector('.thumb-bar');

const slider = document.querySelector('.slider');
const images = document.querySelectorAll('.slider img');

const transitionScheme = 'transform 1.5s ease-in-out';
// const transitionScheme = 'transform 0.5s ease-in-out';

// Buttons
var nextBtn = document.querySelector('.nextBtn');
var prevBtn = document.querySelector('.prevBtn');

// Counter
let counter = 1;
const size = images[0].clientWidth;
slider.style.transform = 'translateX(' + (-size * counter) + 'px)';

// Button Listeners
nextBtn.addEventListener('click', () => {
	if (counter >= images.length - 1) return;	
	slider.style.transition = transitionScheme; 
	counter++;
	slider.style.transform = 'translateX(' + (-size * counter) + 'px)';
});

prevBtn.addEventListener('click', () => {
	if (counter <= 0) return;	
	slider.style.transition = transitionScheme; 
	counter--;
	slider.style.transform = 'translateX(' + (-size * counter) + 'px)';
});

slider.addEventListener('transitionend', () => {
	if (images[counter].id === 'last') {
		slider.style.transition = 'none';
		counter = images.length - 2; // minus the first and last clone
		slider.style.transform = 'translateX(' + (-size * counter) + 'px)';
	}
	if (images[counter].id === 'first') {
		slider.style.transition = 'none';
		counter = images.length - counter; // plus the first and last clone
		slider.style.transform = 'translateX(' + (-size * counter) + 'px)';
	}
})

/* Looping through images */
// for (let i = 1; i <= 5; i++) {
//   var newImage = document.createElement('img');
//   newImage.setAttribute('src', `./images/pic${i}.jpg`);
// 	thumbBar.appendChild(newImage);
// 	newImage.addEventListener('click', renderImg);
// }

// function renderImg(e) {
// 	let src = e.target.getAttribute('src');
// 	displayedImage.setAttribute('src', `${src}`);
// }

// function renderBck() {
// 	let src = displayedImage.getAttribute('src');
// 	let pos = src.charAt(src.search(/[0-9]/));

// 	if (pos == 1) {
// 		displayedImage.setAttribute('src', './images/pic5.jpg')
// 	}
// 	else {
// 		displayedImage.setAttribute('src', `./images/pic${--pos}.jpg`);
// 	}
// }

// function renderFwd() {
// 	let src = displayedImage.getAttribute('src');
// 	let pos = src.charAt(src.search(/[0-9]/));

// 	if (pos == 5) {
// 		displayedImage.setAttribute('src', './images/pic1.jpg')
// 	}
// 	else {
// 		displayedImage.setAttribute('src', `./images/pic${++pos}.jpg`);
// 	}
// }

// btn_back.addEventListener('click', renderBck);
// btn_frwd.addEventListener('click', renderFwd);


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
