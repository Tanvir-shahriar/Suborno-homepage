const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.navbar-links');
      
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', (e) => {
          e.stopPropagation(); // prevent closing when hamburger is clicked
          navLinks.classList.toggle('active');
        });
      
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (navLinks.classList.contains('active') && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
          }
        });
      
        // Optional: prevent closing when clicking inside the nav
        navLinks.addEventListener('click', (e) => {
          e.stopPropagation();
        });

        // animation for carousel with smooth sliding functionality and autoplay
const track = document.getElementById('carousel');
const dots = document.querySelectorAll('.dot');
const itemCount = 7;
const itemWidth = 320;
let offset = 0;
const speed = 1;
let isDragging = false;
let startX;
let currentOffset;
let velocity = 0;
let isScrolling = false;
const friction = 0.95;
let autoplayInterval;

// Total scrollable width = double item count (due to duplication)
const totalWidth = itemCount * itemWidth * 2;

function animateCarousel() {
  if (!isDragging && isScrolling) {
    velocity *= friction;
    offset += velocity;
    if (Math.abs(velocity) < 0.01) isScrolling = false;
  }

  if (offset >= itemCount * itemWidth) {
    offset = 0;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${offset}px)`;
    void track.offsetWidth;
    track.style.transition = 'transform 0.3s linear';
  } else if (offset < 0) {
    offset = (itemCount - 1) * itemWidth;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${offset}px)`;
    void track.offsetWidth;
    track.style.transition = 'transform 0.3s linear';
  } else {
    track.style.transform = `translateX(-${offset}px)`;
  }

  updateDots();
  requestAnimationFrame(animateCarousel);
}

function updateDots() {
  const index = Math.floor(offset / itemWidth) % itemCount;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.dataset.index);
    offset = index * itemWidth;
    track.style.transition = 'transform 0.3s ease';
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  });
});

// --- Swipe/Drag functionality ---
track.addEventListener('mousedown', (e) => {
  isDragging = true;
  clearInterval(autoplayInterval);
  startX = e.pageX;
  currentOffset = offset;
  velocity = 0;
  track.style.transition = 'none';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const delta = e.pageX - startX;
  offset = currentOffset - delta;
  velocity = -delta * 0.1;
  track.style.transform = `translateX(-${offset}px)`;
});

window.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    isScrolling = true;
    snapToClosest();
    startAutoplay();
  }
});

// Touch events for mobile
track.addEventListener('touchstart', (e) => {
  isDragging = true;
  clearInterval(autoplayInterval);
  startX = e.touches[0].pageX;
  currentOffset = offset;
  velocity = 0;
  track.style.transition = 'none';
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const delta = e.touches[0].pageX - startX;
  offset = currentOffset - delta;
  velocity = -delta * 0.1;
  track.style.transform = `translateX(-${offset}px)`;
});

window.addEventListener('touchend', () => {
  if (isDragging) {
    isDragging = false;
    isScrolling = true;
    snapToClosest();
    startAutoplay();
  }
});

// --- Autoplay ---
function startAutoplay() {
  autoplayInterval = setInterval(() => {
    if (!isDragging) {
      offset += itemWidth;
      if (offset >= itemCount * itemWidth) {
        offset = 0;
      }
      track.style.transition = 'transform 0.5s ease';
      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }
  }, 5000); // Scroll every 3 seconds
}

// --- Snap to closest card ---
function snapToClosest() {
  offset = Math.round(offset / itemWidth) * itemWidth;
  track.style.transition = 'transform 0.3s ease';
  track.style.transform = `translateX(-${offset}px)`;
  updateDots();
}

// Start autoplay and smooth animation loop
startAutoplay();
requestAnimationFrame(animateCarousel);


// --- Touch events for mobile with smoother handling ---
track.addEventListener('touchstart', (e) => {
  isDragging = true;
  clearInterval(autoplayInterval);
  startX = e.touches[0].pageX;
  currentOffset = offset;
  velocity = 0;
  track.style.transition = 'none';
  e.preventDefault(); // Prevent page scrolling
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return;

  // Adding a damping effect to reduce sensitivity
  const delta = (e.touches[0].pageX - startX) * 0.5; // 0.5 slows it down
  offset = currentOffset - delta;

  // Limit maximum scroll speed
  velocity = Math.max(-15, Math.min(15, -delta * 0.1));

  track.style.transform = `translateX(-${offset}px)`;
  e.preventDefault();
});

window.addEventListener('touchend', () => {
  if (isDragging) {
    isDragging = false;
    isScrolling = true;
    snapToClosest();
    startAutoplay();
  }
});

// --- Snap to closest card with smooth scrolling ---
function snapToClosest() {
  const closestIndex = Math.round(offset / itemWidth);
  offset = closestIndex * itemWidth;

  track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Smooth scroll
  track.style.transform = `translateX(-${offset}px)`;
  updateDots();
}
        

        // Count up animation
            document.addEventListener("DOMContentLoaded", function () {
        const counters = document.querySelectorAll('.count-up');

        counters.forEach(counter => {
        const target = +counter.getAttribute('data-number');
        let count = 0;
        const increment = target / 200; // Adjust speed by changing divisor

        function updateCounter() {
        count += increment;
        if (count < target) {
            counter.textContent = Math.ceil(count).toLocaleString(); // Adds comma formatting
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target.toLocaleString();
        }
        }

        updateCounter();
    });
    });
