const carouselWords = [
    '...',
    'real-time brain waves',
    'music generation',
    'creativity',
    'self-expression. ',
  ];
  let currentIndex = 0;
  let charIndex = 0;
  let currentText = '';
  let isDeleting = false;
  let isStopped = false;
  
  // Function to type the words with a typewriter effect
  function typeWriterEffect() {
    if (isStopped) return; // Stop typing if the end of the list is reached
  
    const carousel = document.querySelector('.carousel');
    currentText = carouselWords[currentIndex];
  
    if (isDeleting) {
      // If deleting, remove characters
      carousel.textContent = currentText.substring(0, charIndex--);
    } else {
      // If typing, add characters
      carousel.textContent = currentText.substring(0, charIndex++);
    }
  
    // If the word is completely typed, and it's the last word, stop
    if (charIndex === currentText.length && !isDeleting) {
      if (currentIndex === carouselWords.length - 1) {
        isStopped = true; // Stop after the last word
        return; // Ensure no further typing occurs
      }
      setTimeout(() => (isDeleting = true), 1500); // Pause before deleting
    }
  
    // If the word is completely deleted, move to the next word or stop
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentIndex++;
      if (currentIndex >= carouselWords.length) {
        isStopped = true; // Stop after the last word
        return; // Ensure no further typing occurs
      }
    }
  
    // Set typing speed
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeWriterEffect, typingSpeed);
  }
  
  // Start the typewriter effect on page load
  typeWriterEffect();
  
  // Fade in "Duet" and then "for + carousel"
  setTimeout(() => {
    document.querySelector('.heading').classList.add('visible');
  }, 1000); // "Duet" fades in after 1 second
  
  setTimeout(() => {
    document.querySelector('.for-container').classList.add('visible');
  }, 2000); // "for + carousel" fades in after another second (2 seconds after load)
  
  // Cursor movement listener
  const cursor = document.getElementById('cursor');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  // Mouse move listener
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Function for cursor animation
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1; // Add drag by interpolating position
    cursorY += (mouseY - cursorY) * 0.1;
  
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    
    // Create a trail effect
    const trail = document.createElement('div');
    trail.className = 'cursor-trail trail';
    trail.style.left = `${cursorX}px`;
    trail.style.top = `${cursorY}px`;
    document.body.appendChild(trail);
  
    // Fade out and remove the trail after a brief moment
    setTimeout(() => {
      trail.style.opacity = 0;
      setTimeout(() => {
        trail.remove(); // Remove from the DOM
      }, 400); // Duration for the trail fade-out
    }, 0); // Start fading immediately
  
    requestAnimationFrame(animateCursor); // Continuous animation for cursor movement
  }
  
  animateCursor(); // Start the cursor animation
  
  window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY;
    const heading = document.querySelector('.heading');
    const forContainer = document.querySelector('.for-container');
  
    // Move both "Duet" and "for + carousel" up (keep spacing)
    if (scrollPosition > 50 && scrollPosition <= 500) {
      heading.style.top = `${30 - scrollPosition / 30}%`;
      forContainer.style.top = `${40 - scrollPosition / 30}%`;
    }
  
    // Fade out "Duet" first, then fade out "for + carousel"
    if (scrollPosition >= window.innerHeight * 0.1) {
      heading.classList.add('fade-out');
    }
  
    if (scrollPosition >= window.innerHeight * 0.15) {
      forContainer.classList.add('fade-out');
    }
  
    // Remove fade-out if scrolling back up
    if (scrollPosition < window.innerHeight * 0.1) {
      heading.classList.remove('fade-out');
    }
  
    if (scrollPosition < window.innerHeight * 0.15) {
      forContainer.classList.remove('fade-out');
    }
  });
  