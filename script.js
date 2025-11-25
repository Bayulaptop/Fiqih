// Presentation Controller
class FiqhPresentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.currentSlide = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.updateSlideCounter();
        this.createSlideIndicators();
        this.setupEventListeners();
        this.updateProgress();
        this.setupAccessibility();
    }

    createSlideIndicators() {
        const dotsContainer = document.getElementById('slide-dots');
        dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = i === 0 ? 'active' : '';
            dot.setAttribute('aria-label', `Lompat ke slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('next').addEventListener('click', () => this.nextSlide());
        document.getElementById('prev').addEventListener('click', () => this.prevSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowRight':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
                case '1': case '2': case '3': case '4': case '5':
                case '6': case '7': case '8': case '9':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        const slideNum = parseInt(e.key) - 1;
                        if (slideNum < this.totalSlides) {
                            this.goToSlide(slideNum);
                        }
                    }
                    break;
            }
        });

        // Touch gestures for mobile
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        // Update progress on window resize
        window.addEventListener('resize', () => this.updateProgress());
    }

    setupAccessibility() {
        // Add ARIA labels for better screen reader support
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'region');
            slide.setAttribute('aria-label', `Slide ${index + 1}`);
        });
    }

    goToSlide(n) {
        if (n < 0 || n >= this.totalSlides) return;

        // Hide current slide
        this.slides[this.currentSlide].classList.remove('active');

        // Update current slide
        this.currentSlide = n;

        // Show new slide
        this.slides[this.currentSlide].classList.add('active');

        // Update UI
        this.updateProgress();
        this.updateSlideCounter();
        this.updateIndicators();
        this.announceSlideChange();

        // Scroll to top for mobile
        window.scrollTo(0, 0);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    updateProgress() {
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
    }

    updateSlideCounter() {
        document.getElementById('current-slide').textContent = this.currentSlide + 1;
        document.getElementById('total-slides').textContent = this.totalSlides;
    }

    updateIndicators() {
        const indicators = document.querySelectorAll('#slide-dots button');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    announceSlideChange() {
        const currentSlideElement = this.slides[this.currentSlide];
        const slideTitle = currentSlideElement.querySelector('.slide-title')?.textContent || `Slide ${this.currentSlide + 1}`;

        // Create and announce live region for screen readers
        let liveRegion = document.getElementById('slide-announcement');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'slide-announcement';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }

        liveRegion.textContent = `Sedang menampilkan: ${slideTitle}`;
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new FiqhPresentation();

    // Make presentation globally available for debugging
    window.presentation = presentation;
});

// Error handling
window.addEventListener('error', (event) => {
    console.error('Presentation error:', event.error);
});