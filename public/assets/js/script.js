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

// Dynamic Product Carousel
let allProducts = [];
let currentPage = 0;
const productsPerPage = 6; // Show 6 products per page (3x2 grid)

// Load products from products.json
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        renderProducts();
        updateProductCount();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render products for current page
function renderProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    container.innerHTML = '';

    const startIndex = currentPage * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = allProducts.slice(startIndex, endIndex);

    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });

    // Update navigation buttons visibility
    updateNavigationButtons();
}

// Create product card HTML
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-6';

    const card = document.createElement('div');
    card.className = 'card h-100 border-0 shadow-sm';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body p-4 text-center';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'text-primary mb-3';
    iconDiv.innerHTML = `<i class="fas ${product.icon || 'fa-box'} fa-3x"></i>`;

    const title = document.createElement('h5');
    title.className = 'card-title fw-bold';
    title.textContent = product.name;

    const category = document.createElement('p');
    category.className = 'card-text text-muted small';
    category.textContent = product.category;

    const link = document.createElement('a');
    link.href = product.link;
    link.target = '_blank';
    link.rel = 'nofollow noopener';
    link.className = 'btn btn-warning fw-bold mt-3';
    link.innerHTML = '<i class="fab fa-amazon me-2"></i>Vedi su Amazon';

    cardBody.appendChild(iconDiv);
    cardBody.appendChild(title);
    cardBody.appendChild(category);
    cardBody.appendChild(link);

    card.appendChild(cardBody);
    col.appendChild(card);

    return col;
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-products');
    const nextBtn = document.getElementById('next-products');

    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
        prevBtn.style.opacity = currentPage === 0 ? '0.5' : '1';
    }

    if (nextBtn) {
        const maxPage = Math.ceil(allProducts.length / productsPerPage) - 1;
        nextBtn.disabled = currentPage >= maxPage;
        nextBtn.style.opacity = currentPage >= maxPage ? '0.5' : '1';
    }
}

// Navigation handlers
function goToNextPage() {
    const maxPage = Math.ceil(allProducts.length / productsPerPage) - 1;
    if (currentPage < maxPage) {
        currentPage++;
        renderProducts();
    }
}

function goToPrevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderProducts();
    }
}

// Update product count display
function updateProductCount() {
    const countElements = document.querySelectorAll('.product-count');
    countElements.forEach(el => {
        el.textContent = allProducts.length;
    });
}

// Initialize carousel on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();

    // Navigation button listeners
    const prevBtn = document.getElementById('prev-products');
    const nextBtn = document.getElementById('next-products');

    if (prevBtn) {
        prevBtn.addEventListener('click', goToPrevPage);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextPage);
    }
});

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
    const filterButtons = document.querySelectorAll('.category-filter');
    const siteCards = document.querySelectorAll('.category-item');
    
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
                    card.style.display = '';
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filterValue) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
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
