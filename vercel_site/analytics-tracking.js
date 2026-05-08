// Event Tracking Script for Google Analytics GA4
document.addEventListener('DOMContentLoaded', function() {
    // Track CTA clicks on Amazon links
    document.querySelectorAll('a[href*="amazon.it"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            gtag('event', 'click', {
                'event_category': 'CTA',
                'event_label': 'Amazon Link',
                'value': 1
            });
        });
    });
    
    // Track scroll depth
    let scrollTracked = {25: false, 50: false, 75: false, 100: false};
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent >= 25 && !scrollTracked[25]) {
            gtag('event', 'scroll', {'event_category': 'Engagement', 'event_label': '25% Scroll', 'value': 25});
            scrollTracked[25] = true;
        }
        if (scrollPercent >= 50 && !scrollTracked[50]) {
            gtag('event', 'scroll', {'event_category': 'Engagement', 'event_label': '50% Scroll', 'value': 50});
            scrollTracked[50] = true;
        }
        if (scrollPercent >= 75 && !scrollTracked[75]) {
            gtag('event', 'scroll', {'event_category': 'Engagement', 'event_label': '75% Scroll', 'value': 75});
            scrollTracked[75] = true;
        }
        if (scrollPercent >= 100 && !scrollTracked[100]) {
            gtag('event', 'scroll', {'event_category': 'Engagement', 'event_label': '100% Scroll', 'value': 100});
            scrollTracked[100] = true;
        }
    });
    
    // Track time on page (every 30 seconds)
    let timeOnPage = 0;
    setInterval(function() {
        timeOnPage += 30;
        gtag('event', 'timing_complete', {
            'event_category': 'Engagement',
            'event_label': 'Time on Page',
            'value': timeOnPage
        });
    }, 30000);
});
