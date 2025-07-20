 
        class Carousel {
            constructor() {
                this.currentIndex = 0;
                this.isAutoPlaying = true;
                this.touchStart = 0;
                this.touchEnd = 0;
                this.autoPlayInterval = null;
                
                this.track = document.getElementById('carouselTrack');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.dotsContainer = document.getElementById('dotsContainer');
                this.progressBar = document.getElementById('progressBar');
                this.carouselContainer = document.querySelector('.carousel-container');
                
                this.items = document.querySelectorAll('.carousel-item');
                this.totalItems = this.items.length;
                
                this.itemsPerView = {
                    mobile: 1,
                    tablet: 2,
                    desktop: 3
                };
                
                this.currentItemsPerView = this.getItemsPerView();
                this.maxIndex = Math.max(0, this.totalItems - this.currentItemsPerView);
                
                this.init();
            }
            
            getItemsPerView() {
                if (window.innerWidth >= 1024) return this.itemsPerView.desktop;
                if (window.innerWidth >= 768) return this.itemsPerView.tablet;
                return this.itemsPerView.mobile;
            }
            
            init() {
                this.createDots();
                this.updateCarousel();
                this.bindEvents();
                this.startAutoPlay();
            }
            
            createDots() {
                this.dotsContainer.innerHTML = '';
                for (let i = 0; i <= this.maxIndex; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'dot w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-300 hover:bg-blue-400';
                    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                    dot.addEventListener('click', () => this.goToSlide(i));
                    this.dotsContainer.appendChild(dot);
                }
            }
            
            updateCarousel() {
                const translateX = -this.currentIndex * (100 / this.currentItemsPerView);
                this.track.style.transform = `translateX(${translateX}%)`;
                
                this.updateDots();
                this.updateProgressBar();
            }
            
            updateDots() {
                const dots = this.dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    if (index === this.currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
            
            updateProgressBar() {
                const progress = ((this.currentIndex + 1) / (this.maxIndex + 1)) * 100;
                this.progressBar.style.width = `${progress}%`;
            }
            
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
            
            startAutoPlay() {
                if (this.isAutoPlaying) {
                    this.autoPlayInterval = setInterval(() => {
                        this.nextSlide();
                    }, 4000);
                }
            }
            
            stopAutoPlay() {
                if (this.autoPlayInterval) {
                    clearInterval(this.autoPlayInterval);
                    this.autoPlayInterval = null;
                }
            }
            
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
            
            handleTouchStart(e) {
                this.touchStart = e.touches[0].clientX;
            }
            
            handleTouchMove(e) {
                this.touchEnd = e.touches[0].clientX;
            }
            
            handleTouchEnd() {
                if (!this.touchStart || !this.touchEnd) return;
                
                const distance = this.touchStart - this.touchEnd;
                const isLeftSwipe = distance > 50;
                const isRightSwipe = distance < -50;
                
                if (isLeftSwipe) this.nextSlide();
                if (isRightSwipe) this.prevSlide();
                
                this.touchStart = 0;
                this.touchEnd = 0;
            }
            
            bindEvents() {
                // Navigation buttons
                this.prevBtn.addEventListener('click', () => this.prevSlide());
                this.nextBtn.addEventListener('click', () => this.nextSlide());
                
                // Auto-play controls
                this.carouselContainer.addEventListener('mouseenter', () => {
                    this.isAutoPlaying = false;
                    this.stopAutoPlay();
                });
                
                this.carouselContainer.addEventListener('mouseleave', () => {
                    this.isAutoPlaying = true;
                    this.startAutoPlay();
                });
                
                // Touch events
                this.carouselContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e));
                this.carouselContainer.addEventListener('touchmove', (e) => this.handleTouchMove(e));
                this.carouselContainer.addEventListener('touchend', () => this.handleTouchEnd());
                
                // Resize handling
                window.addEventListener('resize', () => this.handleResize());
                
                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.prevSlide();
                    if (e.key === 'ArrowRight') this.nextSlide();
                });
            }
        }
        
        // Initialize carousel when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new Carousel();
        }); 