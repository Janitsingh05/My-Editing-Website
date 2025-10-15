
document.addEventListener('DOMContentLoaded', (event) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Check if the element is currently visible in the viewport
            if (entry.isIntersecting) {
                // If visible, add the 'is-visible' class to trigger the CSS transition
                entry.target.classList.add('is-visible');
                // Stop observing this element once it has been revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Options for the Intersection Observer
        threshold: 0.1 // Triggers when 10% of the element is visible
    });

    // Get all elements that need the fade-in animation
    const fadeElements = document.querySelectorAll('.animate-fade-in');

    // Start observing each element
    fadeElements.forEach(element => {
        observer.observe(element);
    });
