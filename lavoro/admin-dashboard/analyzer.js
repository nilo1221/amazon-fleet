// Sistema Analisi Dati Automatico - Smart Choices Guide
// Analizza dati Analytics/Amazon e genera suggerimenti automatici

// Dati Analytics (da memoria - in futuro integrare API)
const analyticsData = {
    totalUsers: 77,
    newUsers: 77,
    returningUsers: 0,
    totalSessions: 128,
    bounceRate: 30.4,
    avgSessionDuration: '3m 31s',
    topPages: [
        { page: 'Smart Choices Guide Homepage', views: 2100, users: 77 },
        { page: 'Cucina Moderna & Tech', views: 399, users: 9 },
        { page: 'Smart Home & Domotica', views: 50, users: 5 }
    ],
    trafficSources: [
        { source: 'Direct', users: 72, sessions: 128 },
        { source: 'Instagram', users: 3, sessions: 6 },
        { source: 'Facebook', users: 1, sessions: 1 }
    ]
};

// Dati Amazon Affiliate (da memoria - in futuro integrare API)
const amazonData = {
    totalClicks: 999,
    totalOrders: 4,
    conversionRate: 0.40,
    totalRevenue: 47.63,
    shippedItems: 1,
    totalEarnings: 0.17,
    categories: [
        { category: 'Abbigliamento', clicks: 272, percentage: 27.2 },
        { category: 'Cucina', clicks: 101, percentage: 10.1 },
        { category: 'Unknown', clicks: 90, percentage: 9.0 },
        { category: 'Casa', clicks: 72, percentage: 7.2 },
        { category: 'Computer, tablet e componenti', clicks: 59, percentage: 5.9 },
        { category: 'Sport e fitness', clicks: 49, percentage: 4.9 },
        { category: 'Valigeria', clicks: 33, percentage: 3.3 },
        { category: 'Forniture e cibo per animali', clicks: 28, percentage: 2.8 }
    ]
};

// Dati Nicchie (da memoria)
const nichesData = [
    { name: 'Cucina', products: 28, status: 'completo' },
    { name: 'Smart Home', products: 12, status: 'completo' },
    { name: 'Fitness Casa', products: 12, status: 'completo' },
    { name: 'Pet Care Intelligente', products: 23, status: 'completo' },
    { name: 'Elite Gaming Gear', products: 28, status: 'completo' },
    { name: 'Tech', products: 9, status: 'completo' },
    { name: 'Libri & E-Reader', products: 17, status: 'completo' },
    { name: 'Outdoor & Camping', products: 14, status: 'completo' },
    { name: 'Casa & Decorazione', products: 11, status: 'completo' },
    { name: 'Smartphone & Tech', products: 9, status: 'completo' },
    { name: 'Cinema & TV', products: 38, status: 'completo' },
    { name: 'Moda Donna', products: 12, status: 'completo' },
    { name: 'Moda Uomo', products: 10, status: 'completo' },
    { name: 'Accessori Moda', products: 7, status: 'completo' },
    { name: 'Mare & Spiaggia', products: 15, status: 'completo' },
    { name: 'Giochi da Tavolo', products: 8, status: 'completo' },
    { name: 'Fotografia Mobile', products: 2, status: 'da espandere' },
    { name: 'Viaggi Economici', products: 5, status: 'da espandere' }
];

// Funzione: Genera Alert Automatici
function generateAlerts() {
    const alerts = [];
    
    // Alert conversione bassa
    if (amazonData.conversionRate < 1.0) {
        alerts.push({
            type: 'high',
            icon: 'exclamation-triangle',
            message: `Conversione bassa: ${amazonData.conversionRate}% (obiettivo: 2%+)`
        });
    }
    
    // Alert traffico basso
    if (analyticsData.totalUsers < 50) {
        alerts.push({
            type: 'medium',
            icon: 'exclamation-circle',
            message: `Traffico basso: Solo ${analyticsData.totalUsers} utenti ultimi 7 giorni`
        });
    }
    
    // Alert categoria performante
    const topCategory = amazonData.categories[0];
    if (topCategory.percentage > 20) {
        alerts.push({
            type: 'good',
            icon: 'check-circle',
            message: `${topCategory.category} performante: ${topCategory.clicks} clic (${topCategory.percentage}%)`
        });
    }
    
    // Alert guadagni bassi
    if (amazonData.totalEarnings < 1.0) {
        alerts.push({
            type: 'medium',
            icon: 'exclamation-circle',
            message: `Guadagni bassi: €${amazonData.totalEarnings} (obiettivo: €10+)`
        });
    }
    
    return alerts;
}

// Funzione: Genera Suggerimenti Automatici
function generateSuggestions() {
    const suggestions = [];
    
    // Suggerimento: Espandi nicchie con pochi prodotti
    nichesData.forEach(niche => {
        if (niche.status === 'da espandere') {
            suggestions.push({
                icon: 'plus-circle',
                title: `Aggiungi prodotti in ${niche.name}`,
                message: `Solo ${niche.products} prodotti → target 6-8 prodotti per aumentare conversione`
            });
        }
    });
    
    // Suggerimento: Focalizza su categoria performante
    const topCategory = amazonData.categories[0];
    if (topCategory.percentage > 20) {
        suggestions.push({
            icon: 'chart-line',
            title: `Focalizza su ${topCategory.category}`,
            message: `Categoria più performante (${topCategory.percentage}% clic) → aggiungi più prodotti`
        });
    }
    
    // Suggerimento: Monitora nuove nicchie con timer
    const NEW_NICHE_KEY = 'bibite_bevande_created';
    if (localStorage.getItem(NEW_NICHE_KEY)) {
        suggestions.push({
            icon: 'clock',
            title: 'Monitora Bibite & Bevande',
            message: 'Timer scade tra 24 ore → controlla performance prima dello spostamento'
        });
    }
    
    // Suggerimento: Aumenta traffico da social
    const socialTraffic = analyticsData.trafficSources.filter(s => 
        s.source === 'Instagram' || s.source === 'Facebook'
    ).reduce((sum, s) => sum + s.users, 0);
    
    if (socialTraffic < 10) {
        suggestions.push({
            icon: 'share-alt',
            title: 'Aumenta traffico da social',
            message: `Solo ${socialTraffic} utenti da Instagram/Facebook → crea più contenuti social`
        });
    }
    
    return suggestions;
}

// Funzione: Calcola Performance Totale
function calculateOverallPerformance() {
    let score = 0;
    let maxScore = 100;
    
    // Traffico (30 punti)
    if (analyticsData.totalUsers > 100) score += 30;
    else if (analyticsData.totalUsers > 50) score += 20;
    else if (analyticsData.totalUsers > 20) score += 10;
    
    // Conversione (30 punti)
    if (amazonData.conversionRate > 2.0) score += 30;
    else if (amazonData.conversionRate > 1.0) score += 20;
    else if (amazonData.conversionRate > 0.5) score += 10;
    
    // Guadagni (20 punti)
    if (amazonData.totalEarnings > 10) score += 20;
    else if (amazonData.totalEarnings > 5) score += 15;
    else if (amazonData.totalEarnings > 1) score += 10;
    else if (amazonData.totalEarnings > 0.5) score += 5;
    
    // Engagement (20 punti)
    if (analyticsData.bounceRate < 30) score += 20;
    else if (analyticsData.bounceRate < 50) score += 15;
    else if (analyticsData.bounceRate < 70) score += 10;
    
    return {
        score: score,
        maxScore: maxScore,
        percentage: Math.round((score / maxScore) * 100)
    };
}

// Funzione: Esporta Report
function exportReport() {
    const performance = calculateOverallPerformance();
    const alerts = generateAlerts();
    const suggestions = generateSuggestions();
    
    const report = {
        date: new Date().toISOString(),
        performance: performance,
        analytics: analyticsData,
        amazon: amazonData,
        alerts: alerts,
        suggestions: suggestions
    };
    
    // Download come JSON
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'smart-choices-report-' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Funzione: Aggiorna Dashboard
function updateDashboard() {
    // Aggiorna statistiche
    document.getElementById('total-users').textContent = analyticsData.totalUsers;
    document.getElementById('total-clicks').textContent = amazonData.totalClicks;
    document.getElementById('conversion-rate').textContent = amazonData.conversionRate + '%';
    document.getElementById('total-revenue').textContent = '€' + amazonData.totalEarnings;
    
    // Aggiorna alert
    const alertsContainer = document.getElementById('alerts-container');
    const alerts = generateAlerts();
    alertsContainer.innerHTML = alerts.map(alert => {
        const alertClass = alert.type === 'high' ? 'alert-high' : 
                           alert.type === 'medium' ? 'alert-medium' : 'alert-good';
        return `
            <div class="${alertClass}">
                <i class="fas fa-${alert.icon} me-2"></i>
                <strong>${alert.message}</strong>
            </div>
        `;
    }).join('');
    
    // Aggiorna suggerimenti
    const suggestionsContainer = document.getElementById('suggestions-container');
    const suggestions = generateSuggestions();
    suggestionsContainer.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-card">
            <h5><i class="fas fa-${suggestion.icon} me-2"></i>${suggestion.title}</h5>
            <p class="mb-0">${suggestion.message}</p>
        </div>
    `).join('');
    
    // Aggiorna performance categorie
    const categoriesContainer = document.getElementById('categories-performance');
    categoriesContainer.innerHTML = amazonData.categories.slice(0, 5).map(cat => `
        <div class="mb-3">
            <div class="d-flex justify-content-between mb-1">
                <span>${cat.category}</span>
                <span>${cat.clicks} clic (${cat.percentage}%)</span>
            </div>
            <div class="progress progress-bar-custom">
                <div class="progress-bar progress-bar-fill" style="width: ${cat.percentage}%"></div>
            </div>
        </div>
    `).join('');
    
    // Calcola e mostra performance totale
    const performance = calculateOverallPerformance();
    const performanceElement = document.getElementById('overall-performance');
    if (performanceElement) {
        performanceElement.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${performance.percentage}%</div>
                <div class="stat-label">Performance Totale</div>
            </div>
        `;
    }
}

// Esporta funzioni per uso globale
window.AnalyticsAnalyzer = {
    generateAlerts,
    generateSuggestions,
    calculateOverallPerformance,
    exportReport,
    updateDashboard
};
