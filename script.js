// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.navbar-links');

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  navLinks.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('active') && !navLinks.contains(e.target)) {
    navLinks.classList.remove('active');
  }
});

navLinks.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Improved Carousel with Better Touch Handling
const track = document.getElementById('carousel');
if (track) {
  const dots = document.querySelectorAll('.dot');
  const items = document.querySelectorAll('.carousel-item');
  const itemCount = items.length;
  const itemWidth = items[0].offsetWidth;
  let offset = 0;
  let isDragging = false;
  let startX, startY;
  let currentOffset;
  let isHorizontalScroll = false;
  let autoplayInterval;

  // Initialize carousel
  function initCarousel() {
    updateDots();
    startAutoplay();
    setupEventListeners();
  }

  function updateDots() {
    const index = Math.round(offset / itemWidth) % itemCount;
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  }

  function setupEventListeners() {
    // Dot navigation
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(dot.dataset.index);
        goToSlide(index);
      });
    });

    // Touch events - modified to allow vertical scrolling
    track.addEventListener('touchstart', handleTouchStart, { passive: false });
    track.addEventListener('touchmove', handleTouchMove, { passive: false });
    track.addEventListener('touchend', handleTouchEnd);
  }

  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    currentOffset = offset;
    isDragging = true;
    isHorizontalScroll = false;
    clearInterval(autoplayInterval);
    track.style.transition = 'none';
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    
    // Check if movement is primarily horizontal
    if (!isHorizontalScroll) {
      const xDiff = Math.abs(x - startX);
      const yDiff = Math.abs(y - startY);
      
      // Determine scroll direction (10px threshold)
      if (xDiff > 10 || yDiff > 10) {
        isHorizontalScroll = xDiff > yDiff;
      }
    }

    if (isHorizontalScroll) {
      const delta = x - startX;
      offset = currentOffset - delta;
      track.style.transform = `translateX(-${offset}px)`;
      e.preventDefault(); // Only prevent default for horizontal scrolls
    }
    // Allow vertical scrolls to propagate
  }

  function handleTouchEnd() {
    if (isDragging && isHorizontalScroll) {
      snapToClosest();
    }
    isDragging = false;
    startAutoplay();
  }

  function goToSlide(index) {
    offset = index * itemWidth;
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function snapToClosest() {
    const closestIndex = Math.round(offset / itemWidth);
    offset = closestIndex * itemWidth;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function startAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      if (!isDragging) {
        offset += itemWidth;
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
      }
    }, 5000);
  }

  // Initialize when DOM is loaded
  document.addEventListener("DOMContentLoaded", function() {
    // Count up animation
    const counters = document.querySelectorAll('.count-up');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-number');
      let count = 0;
      const increment = target / 200;
      
      function updateCounter() {
        count += increment;
        if (count < target) {
          counter.textContent = Math.ceil(count).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }
      updateCounter();
    });

    // Start carousel if it exists on page
    if (track) {
      initCarousel();
    }
  });
}