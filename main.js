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
const nextThumb = document.querySelector('.nextThumb');
const prevThumb = document.querySelector('.prevThumb');

// Counter
let counter = 0;
let moveAmount = 0;
let direction;
let imageCount;

let thumbCount = 0;
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

function moveThumb() {
  thumbBar.style.transition = transitionScheme;
  let amount = -(thumbCount * (640/4));
  thumbBar.style.transform = `translateX(${amount}px)`;
}

// Button Listeners
nextBtn.addEventListener('click', () => {
  direction = -1;
  counter += 1;
  moveAmount += 1;
  moveSlider();
});

prevBtn.addEventListener('click', () => {
  direction = 1;
  counter -= 1;
  moveAmount += 1;
  moveSlider();
});

function moveSlider() {
  slider.style.transition = transitionScheme;

  // console.log(`dir ${direction} moveAm ${moveAmount}`);
  let amount = (direction * moveAmount * size) + initSize;

  slider.style.transform = `translateX(${amount}px)`;
}

/** PROTOTYPE
 *  an attempt to fix buggy translation when
 *  doing a translation >= 8 slides
 */
// function moveSlider() {
//   amount = (direction * (moveAmount-1) * size) + initSize;
//   // amount = direction * moveAmount * size;
//     console.log(`moveAm ${moveAmount}, size ${size}`);
//   let x = counter; 
//   slider.style.transition = 'none';
//   while (moveAmount > 0) {
//     slider.appendChild(slider.firstElementChild);
//     moveAmount -= 1;
//   }
//   slider.style.transform = `translate(${initSize + (size*x)}px)`;
//     console.log(
//       `initSize ${initSize}
//       size ${size}
//       x ${x}`
//     );

// 	setTimeout( () => {
//     slider.style.transition = transitionScheme;
//     slider.style.transform = `translateX(${amount}px)`;
// 	});
// }

slider.addEventListener('transitionend', () => {
  while (moveAmount > 0) {
    if (direction === 1) { // backwards
      slider.prepend(slider.lastElementChild);
    } else if (direction === -1) { // forwards
      slider.appendChild(slider.firstElementChild);
    }
      moveAmount -= 1;
  }

	slider.style.transition = 'none';
	slider.style.transform = `translate(${initSize}px)`;
	setTimeout( () => {
		slider.style.transition = transitionScheme;
	})
});

function getDisplayIndex(counter, imgCount) {
  let displayIdx;

	if (counter >= 0) {
		displayIdx = Math.abs(counter) % imgCount;
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

    console.log(
      `render: chosenImg ${chosenImage},
      counter ${counter},
      currentImg ${currentImage}`
     );

    moveAmount = chosenImage - currentImage;
    if (moveAmount < 0) {
      direction = 1;
    } else if (moveAmount > 0) {
      direction = -1;
    }
    moveAmount = Math.abs(moveAmount);
    console.log(`moveAmount: ${moveAmount}`);
  }

  moveSlider();
}

function whichChild(elem){
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
    .then(generateElements);
		// .then(autoSlide);
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
	imageCount = jsonData.data.length;
	const sliderImages = generateSlider(jsonData, imageCount);
	alignSliderImages(sliderImages[0]);
  generateThumbBar(jsonData, imageCount);
 
	container.insertAdjacentHTML('beforeend', '<p class="image-current"></p>');
	container.insertAdjacentHTML('beforeend', '<p class="image-name"></p>');
  container.insertAdjacentHTML('beforeend', '<p class="image-description"></p>');
  
  toggleActive(counter, imageCount);
  
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
      /** TODO: make text disappear if overflows in CSS
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
	
function toggleActive(counter, imgCount) {
	const imgCurrent = document.querySelector('.image-current');
  const images = document.querySelectorAll('.thumb-bar img');
  const displayIdx = getDisplayIndex(counter, imgCount);
  const activeImage = document.getElementsByClassName("active");

	activeImage[0].className = activeImage[0].className.replace(" active", "");
  images[displayIdx].className += " active";

  imgCurrent.textContent = `Image ${displayIdx + 1} of ${imgCount}`;
}

init();