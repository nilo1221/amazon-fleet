// Niche Page Tracking - Universal tracking for all niche pages
// This script tracks product views, category views, scroll depth, and time on page

document.addEventListener('DOMContentLoaded', function() {
    // Track category view when page loads
    const currentPath = window.location.pathname;
    const categoryName = currentPath.split('/').filter(Boolean).pop() || 'home';
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'category_view', {
            'category_name': categoryName,
            'page_path': currentPath,
            'event_category': 'navigation',
            'event_label': categoryName
        });
    }

    // Track product views (impressions) for all products on the page
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        const productName = card.querySelector('h3, h4, h5')?.textContent.trim() || 'Unknown Product';
        const categoryBadge = card.querySelector('.category-badge')?.textContent.trim() || 'Unknown';
        const amazonLink = card.querySelector('a[href*="amazon"]');
        const productId = amazonLink ? amazonLink.href.split('/dp/')[1]?.split('?')[0] : 'unknown';
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                'item_id': productId,
                'item_name': productName,
                'item_category': categoryBadge,
                'item_list_name': categoryName,
                'item_list_position': index + 1,
                'affiliation': 'Amazon',
                'currency': 'EUR',
                'value': 0,
                'event_category': 'ecommerce',
                'event_label': 'product_impression'
            });
        }
    });

    // Track scroll depth for engagement
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll === 25 || maxScroll === 50 || maxScroll === 75 || maxScroll === 100) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_tracking', {
                        'percent_scrolled': maxScroll,
                        'page_category': categoryName,
                        'event_category': 'engagement'
                    });
                }
            }
        }
    });

    // Track time on page
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage += 30;
        if (timeOnPage === 30 || timeOnPage === 60 || timeOnPage === 120 || timeOnPage === 300) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'time_on_page', {
                    'time_seconds': timeOnPage,
                    'page_category': categoryName,
                    'event_category': 'engagement'
                });
            }
        }
    }, 30000);

    // Track Amazon product clicks
    const amazonLinks = document.querySelectorAll('a[href*="amazon"]');
    amazonLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const productName = this.textContent.trim() || 'Amazon Product';
            const url = this.href;
            const productCard = this.closest('.product-card');
            const category = productCard ? productCard.querySelector('.category-badge')?.textContent.trim() || 'Unknown' : 'Unknown';
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'select_item', {
                    'item_id': url.split('/dp/')[1]?.split('?')[0] || 'unknown',
                    'item_name': productName,
                    'item_category': category,
                    'item_list_name': categoryName,
                    'affiliation': 'Amazon',
                    'currency': 'EUR',
                    'value': 0
                });
                
                gtag('event', 'affiliate_click', {
                    'product_name': productName,
                    'product_category': category,
                    'page_category': categoryName,
                    'product_url': url,
                    'event_category': 'ecommerce',
                    'event_label': 'Amazon Affiliate'
                });
            }
        });
    });

    // Set user properties
    if (typeof gtag !== 'undefined') {
        gtag('set', 'user_properties', {
            'user_type': 'visitor',
            'page_type': 'niche',
            'niche_name': categoryName
        });
    }
});
