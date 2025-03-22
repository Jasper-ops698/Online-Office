// Theme Management
const ThemeManager = {
    STORAGE_KEY: 'preferred-theme',
    DARK_THEME: 'dark',
    LIGHT_THEME: 'light',
    TRANSITION_CLASS: 'theme-transition',
    
    // DOM Elements
    elements: {
        html: document.documentElement,
        toggle: document.getElementById('theme-toggle'),
        icon: document.querySelector('#theme-toggle i'),
        text: document.querySelector('.theme-toggle-text')
    },

    // Initialize theme management
    init() {
        // Apply initial theme without transition
        this.applyTheme(this.getInitialTheme(), false);
        this.setupEventListeners();
        this.setupMediaQueryListener();
    },

    // Get initial theme based on priority:
    // 1. Previously saved preference
    // 2. System preference
    // 3. Light theme as default
    getInitialTheme() {
        return (
            this.getSavedTheme() ||
            this.getSystemTheme() ||
            this.LIGHT_THEME
        );
    },

    // Get theme from localStorage
    getSavedTheme() {
        return localStorage.getItem(this.STORAGE_KEY);
    },

    // Get system color scheme preference
    getSystemTheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return this.DARK_THEME;
        }
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            return this.LIGHT_THEME;
        }
        return null;
    },

    // Save theme preference to localStorage
    saveTheme(theme) {
        localStorage.setItem(this.STORAGE_KEY, theme);
    },

    // Apply theme to the document
    applyTheme(theme, withTransition = true) {
        if (withTransition) {
            // Add transition class
            this.elements.html.classList.add(this.TRANSITION_CLASS);
            
            // Remove transition class after animation completes
            setTimeout(() => {
                this.elements.html.classList.remove(this.TRANSITION_CLASS);
            }, 500);
        }

        // Update data attribute
        this.elements.html.setAttribute('data-theme', theme);

        // Update toggle button
        if (this.elements.icon && this.elements.text) {
            if (theme === this.DARK_THEME) {
                this.elements.icon.classList.replace('fa-moon', 'fa-sun');
                this.elements.text.textContent = 'Light Mode';
            } else {
                this.elements.icon.classList.replace('fa-sun', 'fa-moon');
                this.elements.text.textContent = 'Dark Mode';
            }
        }

        // Save preference
        this.saveTheme(theme);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme, withTransition } 
        }));
    },

    // Toggle between light and dark themes
    toggleTheme() {
        const currentTheme = this.elements.html.getAttribute('data-theme');
        const newTheme = currentTheme === this.DARK_THEME ? this.LIGHT_THEME : this.DARK_THEME;
        this.applyTheme(newTheme, true);
    },

    // Setup event listeners
    setupEventListeners() {
        // Theme toggle button click
        if (this.elements.toggle) {
            this.elements.toggle.addEventListener('click', () => {
                this.toggleTheme();
            });

            // Add keyboard support
            this.elements.toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }

        // Listen for theme change events
        window.addEventListener('themechange', (e) => {
            console.log(`Theme changed to ${e.detail.theme} ${e.detail.withTransition ? 'with' : 'without'} transition`);
        });
    },

    // Setup system theme preference listener
    setupMediaQueryListener() {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Listen for system theme changes
        darkModeMediaQuery.addEventListener('change', (e) => {
            // Only update if there's no saved preference
            if (!this.getSavedTheme()) {
                this.applyTheme(e.matches ? this.DARK_THEME : this.LIGHT_THEME, true);
            }
        });
    }
};

// Typing Effect
const typingEffect = () => {
    const texts = [
        "Technology Enthusiast",
        "Problem Solver",
        "Web Developer",
        "Innovation Driven"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 200;
    let erasingDelay = 100;
    let newTextDelay = 2000;

    function type() {
        const currentText = texts[textIndex];
        const typedText = document.querySelector('.typed-text');
        
        if (isDeleting) {
            typedText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = erasingDelay;
        } else {
            typedText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 200;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingDelay = newTextDelay;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(type, typingDelay);
    }

    type();
};

// Project Carousel
class ProjectCarousel {
    constructor(element, options = {}) {
        this.carousel = element;
        this.options = {
            autoplayDelay: options.autoplayDelay || 5000,
            slidesToShow: options.slidesToShow || 1,
            autoplay: options.autoplay !== undefined ? options.autoplay : true,
            ...options
        };
        this.track = this.carousel.querySelector('.carousel-track');
        this.slides = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.populateSlides();
        this.setupAutoplay();
    }

    populateSlides() {
        const projects = [
            { title: 'Project 1', description: 'Description of project 1', icon: 'fas fa-project-diagram' },
            { title: 'Project 2', description: 'Description of project 2', icon: 'fas fa-code-branch' },
            { title: 'Project 3', description: 'Description of project 3', icon: 'fas fa-mobile-alt' }
        ];

        projects.forEach((project, index) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            slide.innerHTML = `<div class='portfolio-item'>\n<i class='${project.icon}'></i>\n<h3>${project.title}</h3>\n<p>${project.description}</p>\n</div>`;
            this.track.appendChild(slide);
            this.slides.push(slide);
        });
    }

    setupAutoplay() {
        if (this.options.autoplay) {
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, this.options.autoplayDelay);
        }
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlides();
    }

    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.style.display = index === this.currentIndex ? 'block' : 'none';
        });
    }
}

// Initialize the project carousel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.project-carousel');
    if (carousel) {
        new ProjectCarousel(carousel);
    }
});

// Blog Manager
class BlogManager {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.loading = false;
        this.hasMore = true;
        
        // Cache DOM elements
        this.blogGrid = document.querySelector('.blog-grid');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        
        // Bind methods
        this.loadPosts = this.loadPosts.bind(this);
        this.createBlogCard = this.createBlogCard.bind(this);
        this.formatDate = this.formatDate.bind(this);
        
        // Initialize
        this.init();
    }

    init() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', this.loadPosts);
        }
        
        // Load initial posts
        this.loadPosts();
        
        // Add intersection observer for infinite scroll
        this.setupInfiniteScroll();
    }

    setupInfiniteScroll() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loading && this.hasMore) {
                    this.loadPosts();
                }
            });
        }, options);

        if (this.loadMoreBtn) {
            observer.observe(this.loadMoreBtn);
        }
    }

    async loadPosts() {
        if (this.loading || !this.hasMore) return;

        this.setLoading(true);
        
        // Show skeleton loading state
        this.showSkeletonLoading();

        try {
            // Simulate API call with sample data
            const posts = await this.fetchPosts();
            
            // Remove skeleton loading
            this.removeSkeletonLoading();
            
            // Render posts
            posts.forEach(post => {
                const card = this.createBlogCard(post);
                this.blogGrid.appendChild(card);
            });

            // Update state
            this.currentPage++;
            this.hasMore = posts.length === this.postsPerPage;
            
            // Update UI
            if (!this.hasMore && this.loadMoreBtn) {
                this.loadMoreBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            // Show error state
            this.showErrorState();
        } finally {
            this.setLoading(false);
        }
    }

    async fetchPosts() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Sample blog posts data
        const samplePosts = [
            {
                id: 1,
                title: 'Getting Started with Web Development',
                excerpt: 'Learn the fundamentals of web development and start building your first website.',
                date: '2025-02-15',
                image: 'path/to/blog1.jpg',
                url: '#'
            },
            {
                id: 2,
                title: 'Modern JavaScript Techniques',
                excerpt: 'Explore advanced JavaScript concepts and improve your coding skills.',
                date: '2025-02-10',
                image: 'path/to/blog2.jpg',
                url: '#'
            },
            {
                id: 3,
                title: 'Responsive Design Best Practices',
                excerpt: 'Master the art of creating websites that look great on any device.',
                date: '2025-02-05',
                image: 'path/to/blog3.jpg',
                url: '#'
            }
            // Add more sample posts as needed
        ];

        // Simulate pagination
        const start = (this.currentPage - 1) * this.postsPerPage;
        return samplePosts.slice(start, start + this.postsPerPage);
    }

    createBlogCard(post) {
        const card = document.createElement('article');
        card.className = 'blog-card';
        card.innerHTML = `
            <img class="blog-card-image" src="${post.image}" alt="${post.title}">
            <div class="blog-card-content">
                <h3 class="blog-card-title">${post.title}</h3>
                <time class="blog-card-date" datetime="${post.date}">${this.formatDate(post.date)}</time>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <a href="${post.url}" class="blog-card-link">
                    Read More
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        return card;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    showSkeletonLoading() {
        for (let i = 0; i < 3; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'blog-card skeleton';
            skeleton.innerHTML = `
                <div class="blog-card-image"></div>
                <div class="blog-card-content">
                    <div class="blog-card-title"></div>
                    <div class="blog-card-date"></div>
                    <div class="blog-card-excerpt"></div>
                </div>
            `;
            this.blogGrid.appendChild(skeleton);
        }
    }

    removeSkeletonLoading() {
        const skeletons = this.blogGrid.querySelectorAll('.skeleton');
        skeletons.forEach(skeleton => skeleton.remove());
    }

    showErrorState() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Failed to load posts. Please try again later.';
        this.blogGrid.appendChild(errorMessage);
    }

    setLoading(isLoading) {
        this.loading = isLoading;
        if (this.loadMoreBtn) {
            this.loadMoreBtn.classList.toggle('loading', isLoading);
        }
    }
}

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});

// Mobile Navigation
const mobileNav = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    
    if (toggle) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        links.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }
};

// Smooth Scrolling
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Scroll Animations
const scrollAnimations = () => {
    const elements = document.querySelectorAll('.section, .card, .project-card, .blog-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
};

// Active Navigation Link
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
};

// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error(`Target element not found: ${targetId}`);
            }
        });
    });

    // Other initializations
    ThemeManager.init();
    typingEffect();
    mobileNav();
    smoothScroll();
    scrollAnimations();
    updateActiveNavLink();
});
// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
// Smooth Scrolling for Navigation Links
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth' });
    });
});// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Other initializations
    ThemeManager.init();
    typingEffect();
    mobileNav();
    smoothScroll();
    scrollAnimations();
    updateActiveNavLink();
});// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error(`Target element not found: ${targetId}`);
            }
        });
    });

    // Other initializations
    ThemeManager.init();
    typingEffect();
    mobileNav();
    smoothScroll();
    scrollAnimations();
    updateActiveNavLink();
});// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error(`Target element not found: ${targetId}`);
            }
        });
    });

    // Other initializations
    ThemeManager.init();
    typingEffect();
    mobileNav();
    smoothScroll();
    scrollAnimations();
    updateActiveNavLink();
});
