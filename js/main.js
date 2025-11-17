let cart = [];
let currentSlide = 0;
let currentFilter = 'all';
let currentSort = 'title';

// Enhanced Cart Functions
function loadCart() {
    const saved = localStorage.getItem('comicverse-cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
        }
    } else {
        cart = [];
    }
    updateCartCount();
}

function saveCart() {
    try {
        localStorage.setItem('comicverse-cart', JSON.stringify(cart));
        updateCartCount(); // Always update count after saving
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
    
    console.log('Cart updated. Total items:', count, 'Cart contents:', cart);
}

// Enhanced Add to Cart function with animation
function addToCart(id) {
    const comic = comicsData.find(c => c.id === id);
    if (!comic) {
        console.error('Comic not found with id:', id);
        return;
    }

    // Make sure cart is loaded
    if (cart.length === 0) {
        loadCart();
    }

    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
        console.log('Increased quantity for:', comic.title, 'New quantity:', existingItem.quantity);
    } else {
        cart.push({ 
            id: comic.id,
            title: comic.title,
            publisher: comic.publisher,
            issue: comic.issue,
            price: comic.price,
            cover: comic.cover,
            quantity: 1 
        });
        console.log('Added new item to cart:', comic.title);
    }
    
    saveCart();
    showButtonAnimation(event);
    showModal();
    
    // Debug log
    console.log('Current cart after add:', cart);
}

// Button animation function
function showButtonAnimation(event) {
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Add animation class
    button.classList.add('adding-to-cart');
    
    // Change button text temporarily
    button.innerHTML = '✓ Added!';
    button.style.backgroundColor = '#28a745';
    
    // Animate cart icon
    animateCartIcon();
    
    // Reset button after animation
    setTimeout(() => {
        button.classList.remove('adding-to-cart');
        button.innerHTML = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// Cart icon animation
function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        // Add bounce animation
        cartIcon.style.transform = 'scale(1.3)';
        cartIcon.style.transition = 'transform 0.3s ease';
        
        // Add floating effect
        cartIcon.style.animation = 'floatToCart 0.6s ease';
        
        // Reset after animation
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
            cartIcon.style.animation = '';
        }, 600);
    }
}

// Hero Carousel
function startCarousel() {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % 3;
        setSlide(currentSlide);
    }, 5000);
}

function setSlide(index) {
    currentSlide = index;
    document.querySelectorAll('.hero-slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.hero-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Load Home Comics
function loadHomeComics() {
    const newReleases = comicsData.filter(c => c.badge === 'NEW').slice(0, 4);
    const popular = comicsData.filter(c => c.badge === 'POPULAR').slice(0, 4);
    
    renderComicGrid('new-releases', newReleases);
    renderComicGrid('popular-series', popular);
}

// Render Comic Grid
function renderComicGrid(containerId, comics) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = comics.map(comic => `
        <a href="comic-detail.html?id=${comic.id}" class="comic-card" data-id="${comic.id}">
            <div class="comic-cover">
                <img src="${comic.cover}" alt="${comic.title}">
                ${comic.badge ? `<div class="comic-badge">${comic.badge}</div>` : ''}
            </div>
            <div class="comic-info">
                <div class="comic-publisher">${comic.publisher}</div>
                <div class="comic-title">${comic.title}</div>
                <div class="comic-issue">${comic.issue}</div>
                <div class="comic-footer">
                    <div class="comic-price">$${comic.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" onclick="event.preventDefault(); addToCart(${comic.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </a>
    `).join('');
}

// Browse Comics
function loadBrowseComics() {
    let filtered = currentFilter === 'all' 
        ? [...comicsData] 
        : comicsData.filter(c => c.publisher === currentFilter);
    
    filtered = sortComicsArray(filtered, currentSort);
    renderComicGrid('browse-grid', filtered);
}

function filterComics(publisher) {
    currentFilter = publisher;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    loadBrowseComics();
}

function sortComics(sortType) {
    currentSort = sortType;
    loadBrowseComics();
}

function sortComicsArray(comics, sortType) {
    const sorted = [...comics];
    switch(sortType) {
        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'date':
            return sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        default:
            return sorted;
    }
}

// Comic Detail
function showDetail(id) {
    const comic = comicsData.find(c => c.id === id);
    if (!comic) return;

    const detailContent = document.getElementById('detail-content');
    if (!detailContent) return;

    detailContent.innerHTML = `
        <div class="detail-image">
            <img src="${comic.cover}" alt="${comic.title}">
        </div>
        <div class="detail-content">
            <h1>${comic.title}</h1>
            <div class="detail-meta">
                <span><strong>Publisher:</strong> ${comic.publisher}</span>
                <span><strong>Issue:</strong> ${comic.issue}</span>
                <span><strong>Genre:</strong> ${comic.genre}</span>
            </div>
            <div class="detail-price">$${comic.price.toFixed(2)}</div>
            
            <div class="detail-section">
                <h3>Synopsis</h3>
                <p>${comic.synopsis}</p>
            </div>
            
            <div class="detail-section">
                <h3>Creative Team</h3>
                <p><strong>Writer:</strong> ${comic.writer}</p>
                <p><strong>Artist:</strong> ${comic.artist}</p>
            </div>
            
            <div class="detail-section">
                <h3>Release Date</h3>
                <p>${new Date(comic.releaseDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</p>
            </div>
            
            <div class="detail-actions">
                <button class="detail-btn detail-btn-primary" onclick="addToCart(${comic.id})">
                    Add to Cart - $${comic.price.toFixed(2)}
                </button>
                <a href="browse.html" class="detail-btn detail-btn-secondary" style="text-decoration: none; text-align: center;">
                    Back to Browse
                </a>
            </div>
        </div>
    `;
}

// Modal Functions
function showModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Reset Search
function resetSearch() {
    const searchInput = document.getElementById('search');
    const suggestionsBox = document.getElementById('suggestions');
    
    if (searchInput) searchInput.value = '';
    if (suggestionsBox) {
        suggestionsBox.style.display = 'none';
        suggestionsBox.innerHTML = '';
    }
    
    document.querySelectorAll('.comic-card').forEach(card => {
        card.style.display = 'block';
        card.classList.remove('pop-out');
    });
}