(function () {
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

  // Local Variables 
  let sliderPosition = 0;
  let thumbBarPosition = 0;
  let initialDisplacement = 0;
  let currentDisplacement = 0;
  let rotationDisplacement = 0;
  const transitionScheme = 'transform 0.5s ease-in-out';

  let loadedImages = 0; // loaded images count
  const totalImages = 10; // used as value of count parameter in url
  const url = `https://api.unsplash.com/photos/random/?client_id=e68b2f2480be25aee3cb4b64b08a9bc79bd9eddf1489b7e12c2da671d70b6e35&count=${totalImages}`;

  function init() {
    getJSON(url)
      .then(parseJSON)
      .catch(function (err) {
        console.log(err);
      })
      .then(generateElements)
    // .then(autoSlide);
  }

  function getJSON(url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest;

      xhr.onload = function () { // 404 goes here aswell
        resolve(this);
      };

      xhr.onerror = function () {
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
    const images = document.querySelectorAll('.slider img');
    // create array of slider images without clones 
    const imagesArray = [...images].slice(2, images.length - 2);

    currentDisplacement = 0;
    rotationDisplacement = 0;

    let amount = 0;
    if (sliderPosition === -1) {
      currentDisplacement -= imagesArray[0].clientWidth / 2;
      currentDisplacement -= imagesArray[totalImages - 1].clientWidth / 2;

      let i = 0;
      rotationDisplacement -= imagesArray[i].clientWidth / 2;
      for (i = 1; i < totalImages - 1; i++) {
        rotationDisplacement -= imagesArray[i].clientWidth;
      }
      rotationDisplacement -= imagesArray[i].clientWidth / 2;

      amount = -(currentDisplacement) + initialDisplacement;
    } else if (sliderPosition === 0) {
      amount = initialDisplacement;
    } else {
      let i = 0;

      currentDisplacement += imagesArray[i].clientWidth / 2;
      for (i = 1; i < sliderPosition; i++) {
        currentDisplacement += imagesArray[i].clientWidth;
      }

      if (sliderPosition === totalImages) {
        currentDisplacement += imagesArray[0].clientWidth / 2;
      } else {
        currentDisplacement += imagesArray[sliderPosition].clientWidth / 2;
      }

      amount = -(currentDisplacement) + initialDisplacement;
    }


    slider.style.transform = `translateX(${amount}px)`;
  }

  function moveThumb() {
    /** TODO:
     *  i) move transition scheme to CSS (it's always the same)
     *  ii) handle case where active image is not on thumbar current view
     */
    // thumbBar.style.transition = transitionScheme;
    // let amount = -(thumbBarPosition * (640/4));
    // thumbBar.style.transform = `translateX(${amount}px)`;
  }

  function renderImg(e) {
    const currentImage = sliderPosition;
    const chosenImage = whichChild(e.target);
    const delta = chosenImage - currentImage;
    sliderPosition += delta;

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
    generateSlider(jsonData);
    addSliderExtremities();

    const sliderImages = document.querySelectorAll('.slider img');
    console.log(`sliderImages ${sliderImages.length}`);
    // if images loaded -> do magical things below
    // else, do whatever while loadingggggggggggg
    [].forEach.call(sliderImages, function(img) {
      img.addEventListener('load', imageLoaded);
    })
  
    function imageLoaded() {
      loadedImages += 1;
      console.log(`loadedImages ${loadedImages}`);
      if (loadedImages === sliderImages.length) {
        allImagesLoaded();
      } else {
        // insert loading message or whatever
        console.log('images still loading');
      }
    }
    
    function allImagesLoaded() {
      console.log('all images loaded');

      alignSliderImages(sliderImages[0]);
      generateThumbBar(jsonData);

      container.insertAdjacentHTML('beforeend', '<p class="image-current"></p>');
      container.insertAdjacentHTML('beforeend', '<p class="image-name"></p>');
      container.insertAdjacentHTML('beforeend', '<p class="image-description"></p>');

      toggleActive();

      slider.addEventListener('transitionend', () => {
        toggleActive();
      });
    }
  }

  function addSliderExtremities() {
    const children = [...slider.children];
    const len = children.length;
    const clone0 = children[0].cloneNode(true);
    const clone1 = children[1].cloneNode(true);
    const cloneN = children[len - 1].cloneNode(true);
    const cloneN1 = children[len - 2].cloneNode(true);

    slider.appendChild(clone0);
    slider.appendChild(clone1);
    slider.appendChild(cloneN1);
    slider.appendChild(cloneN);
    slider.prepend(slider.lastElementChild);
    slider.prepend(slider.lastElementChild);
  }

  function alignSliderImages(firstImage) {
    // firstImage.addEventListener('load', () => {
      console.log('----> aligned');
      const images = document.querySelectorAll('.slider img');
      const firstImgWidth = images[0].clientWidth;
      const secondImgWidth = images[1].clientWidth;
      const mainImgWidth = images[2].clientWidth;
      const mainImgCentered = mainImgWidth / 2;

      initialDisplacement = -(firstImgWidth + secondImgWidth + mainImgCentered) + window.innerWidth / 2;
      slider.style.transform = `translateX(${initialDisplacement}px)`;
    // });
  }



  function generateSlider(jsonData) {
    let count = totalImages;
    for (let i = 0; i < count; i++) {
      const sliderDiv = document.createElement('div');
      const sliderImg = document.createElement('img');
      const sliderImgName = document.createElement('p');
      const sliderImgDescr = document.createElement('p');

      sliderImg.setAttribute('src', `${jsonData[i].urls.full}`);
      sliderImg.setAttribute('alt', `${jsonData[i].id}`);
      sliderImgName.setAttribute('class', 'img-name');
      sliderImgDescr.setAttribute('class', 'img-description');
      sliderImgName.textContent = `${jsonData[i].id}`;
      sliderImgDescr.textContent = `${jsonData[i].alt_description}`;
      /** TODO: make text disappear if it 'overflows'
       *  only show text on current active image
       */
      sliderDiv.appendChild(sliderImg);
      sliderDiv.appendChild(sliderImgName);
      sliderDiv.appendChild(sliderImgDescr);
      slider.appendChild(sliderDiv);
    }
    /** TOFIX: was working for old slider implementation */
    // append clone elements to slider for correct behaviour 
    const children = [...slider.children];
    while (count < 5) {
      const clones = children.map(child => child.cloneNode(true));
      clones.forEach(clone => slider.appendChild(clone));
      count += clones.length;
    }
  }

  function generateThumbBar(jsonData) {
    let count = totalImages;
    for (let i = 0; i < count; i++) {
      const newThumbImg = document.createElement('img');
      newThumbImg.setAttribute('src', `${jsonData[i].urls.full}`);
      newThumbImg.setAttribute('alt', `${jsonData[i].id}`);
      if (i === 0) {
        newThumbImg.setAttribute('class', ' active');
      }
      newThumbImg.addEventListener('click', renderImg);
      thumbBar.appendChild(newThumbImg);
    }
  }

  function toggleActive() {
    const imgCurrent = document.querySelector('.image-current');
    const images = document.querySelectorAll('.thumb-bar img');
    const activeImage = document.getElementsByClassName("active");

    activeImage[0].className = activeImage[0].className.replace(" active", "");
    images[sliderPosition].className += " active";

    imgCurrent.textContent = `Image ${sliderPosition + 1} of ${totalImages}`;
  }

  /** Event Listeners */
  // Buttons
  nextBtn.addEventListener('click', () => {
    if (sliderPosition > totalImages - 1) return;
    sliderPosition += 1;

    if (sliderPosition >= 4 && sliderPosition < totalImages) {
      thumbBarPosition += 1;
      moveThumb();
    } else if (sliderPosition === totalImages) {
      thumbBarPosition = 0;
      moveThumb();
    };

    moveSlider();
  });

  prevBtn.addEventListener('click', () => {
    if (sliderPosition < 0) return;
    sliderPosition -= 1;

    if (sliderPosition >= 3) {
      thumbBarPosition -= 1;
      moveThumb();
    } else if (sliderPosition < 0) {
      thumbBarPosition = totalImages - 4;
      moveThumb();
    };

    moveSlider();
  });

  nextThumb.addEventListener('click', () => {
    // 4 images displayed at 1st, so max 6 movements, hardcoded for now
    if (thumbBarPosition === 6) return;
    else thumbBarPosition += 1;

    moveThumb();
  });

  prevThumb.addEventListener('click', () => {
    if (thumbBarPosition === 0) return;
    else thumbBarPosition -= 1;

    moveThumb();
  });

  // Slider
  slider.addEventListener('transitionend', () => {
    if (sliderPosition < 0) {
      slider.style.transition = 'none';
      sliderPosition = totalImages - 1;
      rotationDisplacement += initialDisplacement;
      slider.style.transform = `translateX(${rotationDisplacement}px)`;
    } else if (sliderPosition >= totalImages) {
      slider.style.transition = 'none';
      sliderPosition = 0;
      rotationDisplacement = initialDisplacement;
      slider.style.transform = `translateX(${rotationDisplacement}px)`;
    }
  });

  // Reload window on resize
  window.addEventListener('resize', () => {
   location.reload();
  });

  /** Initialize app */
  init();
}());