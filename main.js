(function() { 
'use strict';

// Main Elements
const thumbBar = document.querySelector('.thumb-bar');
const slider = document.querySelector('.slider');
const container = document.querySelector('.container');

// Buttons
const nextBtn = document.querySelector('.nextBtn');
const prevBtn = document.querySelector('.prevBtn');
const nextThumb = document.querySelector('.nextThumb');
const prevThumb = document.querySelector('.prevThumb');

let size = 640;
// let size; // image width; TOFIX: displacement will vary each image size
// required for initial positioning of slider
let initSize; /** TODO: give a decent name -- initDisplacement ? */

const transitionScheme = 'transform 0.5s ease-in-out';

// Local Variables 
let counter = 0; // current position on slider
/** number of images to transition over 
 *  used to calculate individual size of all images used in translation
 */
let moveAmount = 0;
// direction no longer used, moving everything based on displacement on X
// let direction; // movement direction based on next/prev buttons
let imageCount; // total number of images
let thumbCount = 0; // counter for thumbBar images

function init() {
	getJSON("http://localhost:5000/images")
		.then(parseJSON)
		.catch(function (err) {
			console.log(err);
		})
    .then(generateElements);
		// .then(autoSlide);
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

function parseJSON(xhr) {
  /**
   *  TODO: handle status codes based on class (2xx, 3xx, etc)
   */
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

function moveSlider() {
  slider.style.transition = transitionScheme;
  let amount = (counter * -size) + initSize;
  slider.style.transform = `translateX(${amount}px)`;
}

function moveThumb() {
  /** TODO:
   *  i) move transition scheme to CSS (it's always the same)
   *  ii) handle case where active image is not on thumbar current view
   */
  thumbBar.style.transition = transitionScheme;
  let amount = -(thumbCount * (640/4));
  thumbBar.style.transform = `translateX(${amount}px)`;
}

function getDisplayIndex(counter, imgCount) {
  let displayIdx;

	if (counter >= 0) {
		displayIdx = counter % imgCount;
	} else if (counter < 0) {
		displayIdx = imgCount - (Math.abs(counter) % imgCount);
		if (displayIdx === imgCount) displayIdx = 0;
  }

  return displayIdx;
}

function renderImg(e) {
  if (e) {
    const currentImage = getDisplayIndex(counter, imageCount);
    const chosenImage = whichChild(e.target);
    const delta = chosenImage - currentImage;
    counter += delta;
    // console.log(counter);

    // console.log(
    //   `render: chosenImg ${chosenImage},
    //   counter ${counter},
    //   currentImg ${currentImage}`
    //  );

    moveAmount = chosenImage - currentImage;
    if (moveAmount < 0) {
      // direction = 1;
    } else if (moveAmount > 0) {
      // direction = -1;
    }
    // moveAmount = Math.abs(moveAmount);
    // console.log(`moveAmount: ${moveAmount}`);
  }

  moveSlider();
}

function whichChild(elem) {
  let i = 0;
  while ((elem = elem.previousSibling) != null) i += 1;
  return i;
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

function generateElements(jsonData) {
	imageCount = jsonData.data.length;
  // const sliderImages = generateSlider(jsonData, imageCount);
  generateSlider(jsonData, imageCount);
  addSliderExtremities();
  const sliderImages = document.querySelectorAll('.slider img');
	alignSliderImages(sliderImages[0]);
  generateThumbBar(jsonData, imageCount);

	container.insertAdjacentHTML('beforeend', '<p class="image-current"></p>');
	container.insertAdjacentHTML('beforeend', '<p class="image-name"></p>');
  container.insertAdjacentHTML('beforeend', '<p class="image-description"></p>');
  
  toggleActive(counter, imageCount);
  
	slider.addEventListener('transitionend', () => {
		toggleActive(counter, imageCount);
  });	
}

function addSliderExtremities() {
 // clone sliderImages 0 and 1
 // clone sliderImages length and length-1
 const children = [...slider.children];
 const len = children.length;
 const clone0 = children[0].cloneNode(true)
 const clone1 = children[1].cloneNode(true)
 const cloneN = children[len-1].cloneNode(true)
 const cloneN1 = children[len-2].cloneNode(true)
 clone0.setAttribute('class', 'cloneZERO');
 slider.appendChild(clone0);
 slider.appendChild(clone1);
 slider.appendChild(cloneN1);
 slider.appendChild(cloneN);
 slider.prepend(slider.lastElementChild);
 slider.prepend(slider.lastElementChild);
}

function alignSliderImages(firstImage) {
	firstImage.addEventListener('load', () => {
    const images = document.querySelectorAll('.slider img');
    // console.log(images);
    const one = images[0].clientWidth;
    const two = images[1].clientWidth;
    const three = images[2].clientWidth;
    // console.log(`window: ${window.innerWidth}`);
    // console.log(`
    //   sizeC1 ${one}
    //   sizeC ${two}
    //   sizeDisp ${three}
    // `);
    initSize = -(one + two + three/2) + 1280/2;
    // TODO: for fullscreen version use window.innerWidth instead of 1280px
    slider.style.transform = `translateX(${initSize}px)`;
	});
}

function generateSlider(jsonData, count) {
	if (count === 0) {
		// handle no image
	}	else if (count === 1) {
		// handle one image
	}	else {
		for (let i = 0; i < count; i++) {
      const sliderDiv = document.createElement('div');
      const sliderImg = document.createElement('img');
      const sliderImgName = document.createElement('p');
      const sliderImgDescr = document.createElement('p');
      const displayIdx = getDisplayIndex(i, count);

      if (i === 0) {
        sliderDiv.setAttribute('class', ' activeS');
      }
			sliderImg.setAttribute('src', `${jsonData.data[i].url}`);
      sliderImg.setAttribute('alt', `${jsonData.data[i].name}`);
      sliderImgName.setAttribute('class', 'img-name');
      sliderImgDescr.setAttribute('class', 'img-description');
      sliderImgName.textContent = `${jsonData.data[displayIdx].name}`;
      sliderImgDescr.textContent = `${jsonData.data[displayIdx].short_description}`;
      /** TODO: make text disappear if it 'overflows'
       *  only show text on current active image
       */
			sliderDiv.appendChild(sliderImg);
			sliderDiv.appendChild(sliderImgName);
      sliderDiv.appendChild(sliderImgDescr);
      slider.appendChild(sliderDiv);
		}

		// append clone elements to slider for correct behaviour 
		const children = [...slider.children];
		while (count < 5) {
			const clones = children.map(child => child.cloneNode(true));
			clones.forEach(clone => slider.appendChild(clone));
			count += clones.length;
		}
  }
  
	// return document.querySelectorAll('.slider img'); 
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
	
function toggleActive(counter, imgCount) {
	const imgCurrent = document.querySelector('.image-current');
  const images = document.querySelectorAll('.thumb-bar img');
  const displayIdx = getDisplayIndex(counter, imgCount);
  const activeImage = document.getElementsByClassName("active");

	activeImage[0].className = activeImage[0].className.replace(" active", "");
  images[displayIdx].className += " active";

  imgCurrent.textContent = `Image ${displayIdx + 1} of ${imgCount}`;
}

/** Event Listeners */
// Buttons
nextBtn.addEventListener('click', () => {
  if (counter > imageCount) return;
  counter += 1;
  moveAmount += 1;

  moveSlider();
});

prevBtn.addEventListener('click', () => {
  if (counter < 0) return;
  counter -= 1;
  moveAmount -= 1;
  
  moveSlider();
});

nextThumb.addEventListener('click', () => {
  // 4 images displayed at 1st, so max 6 movements, hardcoded for now
  if (thumbCount === 6) return;
  else thumbCount += 1;

  moveThumb();
})

prevThumb.addEventListener('click', () => {
  if (thumbCount === 0) return;
  else thumbCount -= 1;

  moveThumb();
})

// Slider
slider.addEventListener('transitionend', function() {
  let amount = 0;
  if (counter < 0) {
    slider.style.transition = 'none';
    counter = imageCount - 1;
    amount = initSize - size * counter;
    slider.style.transform = `translateX(${amount}px)`;
  } else if (counter >= imageCount) {
    slider.style.transition = 'none';
    counter = 0;
    amount = initSize;
    slider.style.transform = `translateX(${amount}px)`;
  }
});

/** Initialize app */
init();
}());