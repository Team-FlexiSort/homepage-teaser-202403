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