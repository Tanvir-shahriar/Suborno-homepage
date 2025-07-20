// =========================================================================
// ORIGINAL SCRIPT CODE
// This section contains the initial JavaScript for mobile navigation,
// the first carousel implementation, and the count-up animation.
// =========================================================================

// --- Mobile Navigation ---
// Toggles the mobile menu when the hamburger icon is clicked.
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.navbar-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the click from closing the menu immediately
    navLinks.classList.toggle('active');
  });

  // Close the menu if a click occurs outside of it
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });

  // Prevents the menu from closing when clicking inside it
  navLinks.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}


// --- Original Carousel Logic ---
// This is the first implementation of the carousel.
// It handles sliding, dots, touch events, and autoplay.
const originalTrack = document.getElementById('carousel');
if (originalTrack) {
  const dots = document.querySelectorAll('.dot');
  const items = document.querySelectorAll('.carousel-item');
  if (items.length > 0) {
    const itemCount = items.length;
    const itemWidth = items[0].offsetWidth + 20; // Includes margin-right of 20px
    let offset = 0;
    let isDragging = false;
    let startX, startY;
    let currentOffset;
    let isHorizontalScroll = false;
    let autoplayInterval;

    // Initializes the carousel
    function initCarousel() {
      updateDots();
      startAutoplay();
      setupEventListeners();
    }

    // Updates the active state of the navigation dots
    function updateDots() {
      const index = Math.round(offset / itemWidth) % itemCount;
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
    }

    // Sets up all necessary event listeners
    function setupEventListeners() {
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.dataset.index);
          goToSlide(index);
        });
      });

      originalTrack.addEventListener('touchstart', handleTouchStart, { passive: false });
      originalTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
      originalTrack.addEventListener('touchend', handleTouchEnd);
    }

    // Handles the start of a touch event
    function handleTouchStart(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentOffset = offset;
      isDragging = true;
      isHorizontalScroll = false;
      clearInterval(autoplayInterval);
      originalTrack.style.transition = 'none';
    }

    // Handles dragging during a touch event, allowing for vertical scroll
    function handleTouchMove(e) {
      if (!isDragging) return;
      
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      
      if (!isHorizontalScroll) {
        const xDiff = Math.abs(x - startX);
        const yDiff = Math.abs(y - startY);
        if (xDiff > 10 || yDiff > 10) {
          isHorizontalScroll = xDiff > yDiff;
        }
      }

      if (isHorizontalScroll) {
        const delta = x - startX;
        offset = currentOffset - delta;
        originalTrack.style.transform = `translateX(-${offset}px)`;
        e.preventDefault();
      }
    }
    
    // Snaps to the nearest slide at the end of a touch event
    function handleTouchEnd() {
      if (isDragging && isHorizontalScroll) {
        snapToClosest();
      }
      isDragging = false;
      startAutoplay();
    }

    // Navigates to a specific slide index
    function goToSlide(index) {
      offset = index * itemWidth;
      originalTrack.style.transition = 'transform 0.5s ease';
      originalTrack.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    // Snaps the carousel to the closest item after a drag
    function snapToClosest() {
      const closestIndex = Math.round(offset / itemWidth);
      offset = closestIndex * itemWidth;
      originalTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      originalTrack.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    // Starts the autoplay interval
    function startAutoplay() {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => {
        if (!isDragging) {
          const nextIndex = (Math.round(offset / itemWidth) + 1) % itemCount;
          goToSlide(nextIndex);
        }
      }, 5000);
    }
    initCarousel();
  }
}

// --- Count-Up Animation ---
// Animates numbers from 0 to a target value when the page loads.
document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll('.count-up');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-number');
      if (!target) return;
      let count = 0;
      const increment = target / 200; // Animation speed
      
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
});


// =========================================================================
// NEW CAROUSEL CLASS (OBJECT-ORIENTED APPROACH)
// This is a more modern, class-based implementation of a carousel.
// It is self-contained and manages its own state and events.
// NOTE: This will control a *different* carousel if the HTML element IDs
// (e.g., 'carouselTrack', 'prevBtn') are present on the page.
// =========================================================================

class Carousel {
    constructor() {
        // --- State Properties ---
        this.currentIndex = 0; // The current active slide index
        this.isAutoPlaying = true; // Controls whether autoplay is active
        this.touchStart = 0; // Stores the initial X position of a touch event
        this.touchEnd = 0; // Stores the final X position of a touch event
        this.autoPlayInterval = null; // Holds the setInterval ID for autoplay

        // --- DOM Elements ---
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('dotsContainer');
        this.progressBar = document.getElementById('progressBar');
        this.carouselContainer = document.querySelector('.carousel-container');
        
        // --- Carousel Items ---
        this.items = this.track ? this.track.querySelectorAll('.carousel-item') : [];
        this.totalItems = this.items.length;
        
        // --- Responsive Settings ---
        this.itemsPerView = { mobile: 1, tablet: 2, desktop: 3 };
        this.currentItemsPerView = this.getItemsPerView();
        this.maxIndex = Math.max(0, this.totalItems - this.currentItemsPerView);
        
        // --- Initialization ---
        if (this.track && this.totalItems > 0) {
            this.init();
        }
    }
    
    // Determines how many items should be visible based on viewport width
    getItemsPerView() {
        if (window.innerWidth >= 1024) return this.itemsPerView.desktop;
        if (window.innerWidth >= 768) return this.itemsPerView.tablet;
        return this.itemsPerView.mobile;
    }
    
    // Main initialization function
    init() {
        this.createDots();
        this.updateCarousel();
        this.bindEvents();
        this.startAutoPlay();
    }
    
    // Dynamically creates navigation dots based on the number of slides
    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i <= this.maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-300 hover:bg-blue-400';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    // Updates the carousel's visual state (position, dots, progress bar)
    updateCarousel() {
        const translateX = -this.currentIndex * (100 / this.currentItemsPerView);
        this.track.style.transform = `translateX(${translateX}%)`;
        this.updateDots();
        this.updateProgressBar();
    }
    
    // Highlights the dot corresponding to the current slide
    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    // Updates the width of the progress bar
    updateProgressBar() {
        if (!this.progressBar) return;
        const progress = ((this.currentIndex + 1) / (this.maxIndex + 1)) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    // --- Navigation Methods ---
    nextSlide() {
        this.currentIndex = this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentIndex = this.currentIndex <= 0 ? this.maxIndex : this.currentIndex - 1;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = Math.min(index, this.maxIndex);
        this.updateCarousel();
    }
    
    // --- Autoplay Controls ---
    startAutoPlay() {
        this.stopAutoPlay(); // Ensure no multiple intervals are running
        if (this.isAutoPlaying) {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 4000);
        }
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
    
    // --- Event Handlers ---
    // Recalculates dimensions on window resize for responsiveness
    handleResize() {
        const newItemsPerView = this.getItemsPerView();
        if (newItemsPerView !== this.currentItemsPerView) {
            this.currentItemsPerView = newItemsPerView;
            this.maxIndex = Math.max(0, this.totalItems - this.currentItemsPerView);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.createDots();
            this.updateCarousel();
        }
    }
    
    // Touch event handlers for swipe gestures
    handleTouchStart(e) { this.touchStart = e.touches[0].clientX; }
    handleTouchMove(e) { this.touchEnd = e.touches[0].clientX; }
    handleTouchEnd() {
        if (!this.touchStart || !this.touchEnd) return;
        const distance = this.touchStart - this.touchEnd;
        if (distance > 50) this.nextSlide();   // Left swipe
        if (distance < -50) this.prevSlide(); // Right swipe
        this.touchStart = 0;
        this.touchEnd = 0;
    }
    
    // Binds all event listeners to the corresponding elements
    bindEvents() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.carouselContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        
        this.carouselContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.carouselContainer.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.carouselContainer.addEventListener('touchend', () => this.handleTouchEnd());
        
        window.addEventListener('resize', () => this.handleResize());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
}

// =========================================================================
// FAQ ACCORDION CLASS
// This class handles the logic for a custom FAQ accordion.
// =========================================================================

class FAQAccordion {
    constructor() {
        this.faqButtons = document.querySelectorAll('.faq-button');
        this.init();
    }

    init() {
        this.faqButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.toggleFAQ(e.currentTarget);
            });
        });
    }

    toggleFAQ(button) {
        const targetId = button.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const arrow = button.querySelector('.faq-arrow');
        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

        // Close all other FAQs
        this.faqButtons.forEach(otherButton => {
            if (otherButton !== button) {
                const otherTargetId = otherButton.getAttribute('data-target');
                const otherContent = document.getElementById(otherTargetId);
                const otherArrow = otherButton.querySelector('.faq-arrow');
                
                otherContent.style.maxHeight = '0px';
                otherArrow.style.transform = 'rotate(0deg)';
            }
        });

        // Toggle current FAQ
        if (isOpen) {
            content.style.maxHeight = '0px';
            arrow.style.transform = 'rotate(0deg)';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            arrow.style.transform = 'rotate(180deg)';
        }
    }
}


// =========================================================================
// INITIALIZE ALL CLASSES ON DOM CONTENT LOADED
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // This will create a new Carousel instance for any carousel
    // on the page that matches the required HTML structure.
    new Carousel();

    // Initialize the new FAQ Accordion
    new FAQAccordion();
});