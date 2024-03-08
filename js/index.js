// Get the header element
const header = document.querySelector('header');

// Get the height of the header
const headerHeight = header.offsetHeight;

// Add smooth scroll behavior to all anchor links
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();

        // Get the target element's ID from the href attribute
        const targetId = link.getAttribute('href').slice(1);
        if (targetId == 'top') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        else {
            // Get the target element
            const targetElement = document.getElementById(targetId);

            // Calculate the scroll position, considering the header height
            const scrollPosition = targetElement.offsetTop - headerHeight;

            // Scroll smoothly to the target element
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    });
});

const keyVisualElement = document.getElementById('key-visual');
const keyVisualHeight = keyVisualElement.offsetHeight;

function updateHeader() {
    if (window.scrollY >= keyVisualHeight - headerHeight - 300) {
        header.classList.add('black-bg');
    }
    else {
        header.classList.remove('black-bg');
    }
}

window.addEventListener('load', (event) => {
    updateHeader();
});

window.addEventListener('scroll', (event) => {
    updateHeader();
});

const slideshowElement = document.getElementById('key-visual-img-slideshow');
const generateSlideshow = new Promise((resolve, reject) => {
    fetch('/data/index-slideshow.json',{cache: "no-store"})
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                const imgElement = document.createElement('img');
                imgElement.setAttribute('src', element.img);
                const captionElement = document.createElement('span');
                if (element.caption != undefined) captionElement.innerHTML = element.caption;
                slideshowElement.appendChild(imgElement);
                slideshowElement.appendChild(captionElement);
            });
        })
        .then(() => {
            const slideshowImgElementsArray = Array.from(slideshowElement.getElementsByTagName('img'));
            const slideshowCaptionElementsArray = Array.from(slideshowElement.getElementsByTagName('span'));
            let currentImage = -1;

            function changeImg() {
                currentImage += 1
                if (currentImage >= slideshowImgElementsArray.length) {
                    currentImage = 0
                }
                lastImage = currentImage - 1 >= 0 ? currentImage - 1 : slideshowImgElementsArray.length - 1;
                nextImage = currentImage + 1 <= slideshowImgElementsArray.length - 1 ? currentImage + 1 : 0;
                slideshowImgElementsArray[lastImage].classList.remove('show');
                slideshowImgElementsArray[lastImage].classList.remove('after');
                slideshowImgElementsArray[currentImage].classList.add('show');  // 初回の画像表示用
                slideshowCaptionElementsArray[currentImage].classList.add('show');  // 初回のキャプション表示用
                setTimeout(() => {
                    slideshowImgElementsArray[nextImage].classList.add('show');
                    slideshowImgElementsArray[currentImage].classList.add('after');
                    slideshowCaptionElementsArray[nextImage].classList.add('show');
                    slideshowCaptionElementsArray[currentImage].classList.remove('show');
                }, 6000);
            }

            changeImg();
            setInterval(() => {
                changeImg();
            }, 7000)
        })
        .then(() => {
            resolve();
        })
        .catch(error => console.error(error));
});

let youTubeUrl = '';

function videoPlayerSwitch() {
    const videoViewElement = document.getElementById('key-visual-player');
    if (videoViewElement.style.display == "none" || videoViewElement.classList.contains('disabled')) {
        if (videoViewElement.getAttribute('src') != '') videoViewElement.setAttribute('src', '');
    }
    else {
        if (videoViewElement.getAttribute('src') == '') videoViewElement.setAttribute('src', youTubeUrl);
    }
}

const generateVideoView = generateSlideshow.then(() => {
    return new Promise((resolve, reject) => {
        const videoViewElement = document.getElementById('key-visual-player');
        // fetch index-video.json and put the url into the videoViewElement
        fetch('/data/index-video.json',{cache: "no-store"})
            .then(response => response.json())
            .then(data => {
                youTubeUrl = 'https://www.youtube.com/embed/' + data.id + '?start=' + data.start + '&si=C_KkbHkAyLTeIPM_&controls=0&autoplay=1&mute=1&loop=1&playlist=' + data.id
                if (data["video-enabled"] == false) videoViewElement.classList.add('disabled');

                videoPlayerSwitch();
                // window.addEventListener('load', videoPlayerSwitch);
                window.addEventListener('resize', videoPlayerSwitch);
                resolve();
            })
            .catch(error => console.error(error));
    });
});
