// Show loading overlay
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1500);
    }
}

// Bootstrap 5 Dropdown Submenu Support
document.addEventListener('DOMContentLoaded', function() {
    // Enable dropdown submenus in Bootstrap 5
    const dropdownSubmenus = document.querySelectorAll('.dropdown-submenu');
    
    dropdownSubmenus.forEach(function(submenu) {
        const toggle = submenu.querySelector('.dropdown-toggle');
        const menu = submenu.querySelector('.dropdown-menu');
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other open submenus
            document.querySelectorAll('.dropdown-submenu .dropdown-menu.show').forEach(function(openMenu) {
                if (openMenu !== menu) {
                    openMenu.classList.remove('show');
                }
            });
            
            // Toggle current submenu
            menu.classList.toggle('show');
        });
        
        // Close submenu when clicking outside
        document.addEventListener('click', function(e) {
            if (!submenu.contains(e.target)) {
                menu.classList.remove('show');
            }
        });
    });
});

// Category Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    const siteCards = document.querySelectorAll('.site-card');
    
    // Add data-category to site cards based on badge-category
    siteCards.forEach(card => {
        const badge = card.querySelector('.badge-category');
        if (badge) {
            const category = badge.textContent.trim();
            // Map categories to filter groups
            let filterGroup = 'all';
            if (category === 'Sport') filterGroup = 'Sport';
            else if (category === 'Tech' || category === 'Gaming' || category === 'Foto' || category === 'Kindle' || category === 'Illuminazione') filterGroup = 'Tech';
            else if (category === 'Elettrodomestici' || category === 'Caffè & Tè' || category === 'Casa & Decorazione') filterGroup = 'Casa';
            else if (category === 'Cinema & TV' || category === 'Abbigliamento Lusso' || category === 'Moda Maschile' || category === 'Accessori' || category === 'Skincare') filterGroup = 'Moda';
            else if (category === 'Viaggi' || category === 'Viaggi Low-Cost') filterGroup = 'Viaggi';
            else if (category === 'Benessere' || category === 'Outdoor' || category === 'Giardino' || category === 'Animali') filterGroup = 'Benessere';
            else if (category === 'Ufficio') filterGroup = 'Ufficio';
            
            card.setAttribute('data-category', filterGroup);
        }
    });
    
    // Filter button click handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide site cards based on filter
            siteCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filterValue) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

    // GA4 Event Tracking
    // Track Amazon product clicks
    const amazonLinks = document.querySelectorAll('a[href*="amazon"]');
    amazonLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const productName = this.textContent.trim() || 'Amazon Product';
            const url = this.href;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'product_click', {
                    'product_name': productName,
                    'product_url': url,
                    'event_category': 'ecommerce',
                    'event_label': productName
                });
            }
        });
    });

    // Track category navigation
    const categoryLinks = document.querySelectorAll('a[href*="/sites/"]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const category = this.textContent.trim() || 'Category';
            const url = this.href;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'category_click', {
                    'category_name': category,
                    'category_url': url,
                    'event_category': 'navigation',
                    'event_label': category
                });
            }
        });
    });

    // Track filter clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const filterValue = this.getAttribute('data-filter');
            if (typeof gtag !== 'undefined') {
                gtag('event', 'filter_click', {
                    'filter_value': filterValue,
                    'event_category': 'navigation',
                    'event_label': filterValue
                });
            }
        });
    });

    // Set user ID if available (for future use)
    if (typeof gtag !== 'undefined') {
        gtag('set', 'user_properties', {
            'user_type': 'visitor',
            'page_type': 'home'
        });
    }

    // Product Rotation System - Real-time rotation
    const ROTATION_INTERVAL = 5 * 1000; // 5 seconds for testing (change to 29 * 60 * 1000 for production)
    const STORAGE_KEY = 'product_rotation';
    
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    function rotateProducts() {
        const productContainers = document.querySelectorAll('.row:has(.product-card)');
        
        productContainers.forEach(container => {
            const products = Array.from(container.querySelectorAll('.product-card'));
            if (products.length <= 1) return;
            
            // Shuffle products
            const shuffledProducts = shuffleArray(products);
            
            // Re-append in shuffled order
            shuffledProducts.forEach(product => {
                container.appendChild(product);
            });
            
            console.log('Products rotated for container');
        });
    }
    
    // Run rotation immediately on page load
    rotateProducts();
    
    // Run rotation automatically every X seconds
    setInterval(rotateProducts, ROTATION_INTERVAL);
});
