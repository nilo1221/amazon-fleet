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

// Category Menu Interactive
const categoriesData = {
    casa: {
        color: '#FF9900',
        niches: [
            {name: 'Cucina Tech', path: 'cucina-elettrodomestici', icon: 'fa-utensils', count: 28},
            {name: 'Smart Home', path: 'smart-home-domotica', icon: 'fa-box', count: 12},
            {name: 'Arredamento', path: 'arredamento-casa', icon: 'fa-couch', count: 15}
        ]
    },
    tech: {
        color: '#3498DB',
        niches: [
            {name: 'Gaming Gear', path: 'elite-gaming-gear', icon: 'fa-gamepad', count: 28},
            {name: 'Smartphone', path: 'smartphone-tech', icon: 'fa-mobile-alt', count: 20},
            {name: 'Tech', path: 'tech', icon: 'fa-microchip', count: 25},
            {name: 'Fotografia', path: 'fotografia-mobile', icon: 'fa-camera', count: 18}
        ]
    },
    moda: {
        color: '#E74C3C',
        niches: [
            {name: 'Moda Donna', path: 'moda-donna', icon: 'fa-female', count: 22},
            {name: 'Moda Uomo', path: 'moda-uomo', icon: 'fa-male', count: 18},
            {name: 'Accessori', path: 'accessori-moda', icon: 'fa-gem', count: 15},
            {name: 'Profumi', path: 'profumi-bellezza', icon: 'fa-spray-can', count: 12},
            {name: 'Benessere', path: 'benessere-cura-personale', icon: 'fa-spa', count: 20},
            {name: 'Cinema & TV', path: 'cinema-tv', icon: 'fa-film', count: 38},
            {name: 'Hair Styling', path: 'hair-styling-barber-shop', icon: 'fa-cut', count: 15}
        ]
    },
    sport: {
        color: '#27AE60',
        niches: [
            {name: 'Fitness', path: 'fitness-casa', icon: 'fa-dumbbell', count: 25},
            {name: 'Outdoor', path: 'outdoor-camping', icon: 'fa-campground', count: 18},
            {name: 'Mare & Spiaggia', path: 'mare-spiaggia', icon: 'fa-umbrella-beach', count: 15},
            {name: 'Softair', path: 'softair', icon: 'fa-crosshairs', count: 20}
        ]
    },
    intrattenimento: {
        color: '#9B59B6',
        niches: [
            {name: 'Giochi da Tavolo', path: 'giochi-da-tavolo', icon: 'fa-dice', count: 16},
            {name: 'DVD & Blu-ray', path: 'dvd-bluray', icon: 'fa-compact-disc', count: 14},
            {name: 'Libri & E-reader', path: 'libri-ereader', icon: 'fa-book', count: 20},
            {name: 'Manga & Anime', path: 'manga-anime', icon: 'fa-star', count: 25}
        ]
    },
    altro: {
        color: '#95A5A6',
        niches: [
            {name: 'Viaggi', path: 'viaggi-vacanze', icon: 'fa-plane', count: 18},
            {name: 'Ufficio', path: 'ufficio-produttivo', icon: 'fa-briefcase', count: 15},
            {name: 'Pet Care', path: 'pet-care-intelligente', icon: 'fa-paw', count: 12},
            {name: 'Sostenibilità', path: 'sostenibilita-eco-friendly', icon: 'fa-leaf', count: 10},
            {name: 'Abbigliamento Lavoro', path: 'abbigliamento-lavoro', icon: 'fa-hard-hat', count: 8}
        ]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const nichesDisplay = document.getElementById('nichesDisplay');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const categoryData = categoriesData[category];
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update CSS variable for color
            nichesDisplay.style.setProperty('--category-color', categoryData.color);
            
            // Generate niches HTML
            let nichesHTML = '<div class="niches-grid">';
            categoryData.niches.forEach(niche => {
                nichesHTML += `
                    <a href="${niche.path}/index.html" class="niche-card-modern">
                        <div class="niche-icon-modern">
                            <i class="fas ${niche.icon}"></i>
                        </div>
                        <div class="niche-info-modern">
                            <div class="niche-name-modern">${niche.name}</div>
                            <div class="niche-count-modern">${niche.count} prodotti</div>
                        </div>
                        <div class="niche-arrow-modern">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </a>
                `;
            });
            nichesHTML += '</div>';
            
            // Update display with animation
            nichesDisplay.innerHTML = nichesHTML;
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
});
