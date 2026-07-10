// Smart Search System - Hybrid Search with Autocomplete
class SmartSearch {
    constructor() {
        this.searchDatabase = null;
        this.searchInput = null;
        this.searchButton = null;
        this.searchResults = null;
        this.debounceTimer = null;
        this.init();
    }

    async init() {
        // Load search database
        try {
            const response = await fetch('/data/search-database.json');
            this.searchDatabase = await response.json();
        } catch (error) {
            console.error('Error loading search database:', error);
            this.searchDatabase = { niches: [], products: [] };
        }

        // Get DOM elements
        this.searchInput = document.querySelector('.navbar-search-container input');
        this.searchButton = document.querySelector('.navbar-search-container button');
        
        // Create search results container
        this.createSearchResultsContainer();
        
        // Add event listeners
        this.addEventListeners();
    }

    createSearchResultsContainer() {
        const searchContainer = document.querySelector('.navbar-search-container');
        
        this.searchResults = document.createElement('div');
        this.searchResults.className = 'search-results-container';
        this.searchResults.style.display = 'none';
        
        searchContainer.parentNode.appendChild(this.searchResults);
    }

    addEventListeners() {
        if (!this.searchInput) return;

        // Input event with debounce
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        // Focus event
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.length > 0) {
                this.handleSearch(this.searchInput.value);
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar-search-container') && 
                !e.target.closest('.search-results-container')) {
                this.hideResults();
            }
        });

        // Search button click
        if (this.searchButton) {
            this.searchButton.addEventListener('click', () => {
                this.handleSearch(this.searchInput.value);
            });
        }

        // Enter key
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(this.searchInput.value);
            }
        });
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            this.hideResults();
            return;
        }

        // Search in niches
        const nicheResults = this.searchNiches(searchTerm);
        
        // Display results
        this.displayResults(nicheResults, searchTerm);
    }

    searchNiches(searchTerm) {
        if (!this.searchDatabase || !this.searchDatabase.niches) return [];

        return this.searchDatabase.niches.filter(niche => {
            const nameMatch = niche.name.toLowerCase().includes(searchTerm);
            const keywordMatch = niche.keywords.some(keyword => 
                keyword.toLowerCase().includes(searchTerm)
            );
            return nameMatch || keywordMatch;
        }).map(niche => ({
            type: 'niche',
            name: niche.name,
            url: niche.url,
            icon: niche.icon,
            matchType: niche.name.toLowerCase().includes(searchTerm) ? 'name' : 'keyword'
        }));
    }

    displayResults(results, searchTerm) {
        if (results.length === 0) {
            this.showNoResults(searchTerm);
            return;
        }

        let html = '<div class="search-results-header">';
        html += `<span class="results-count">${results.length} risultati trovati</span>`;
        html += '<button class="close-results" onclick="smartSearch.hideResults()"><i class="fas fa-times"></i></button>';
        html += '</div>';

        html += '<div class="search-results-list">';
        
        results.forEach(result => {
            html += this.createResultItem(result, searchTerm);
        });

        html += '</div>';

        this.searchResults.innerHTML = html;
        this.searchResults.style.display = 'block';
    }

    createResultItem(result, searchTerm) {
        const icon = result.icon || 'fa-folder';
        const highlightedName = this.highlightMatch(result.name, searchTerm);
        
        return `
            <a href="${result.url}" class="search-result-item" onclick="smartSearch.hideResults()">
                <div class="result-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="result-content">
                    <div class="result-name">${highlightedName}</div>
                    <div class="result-type">${result.type === 'niche' ? 'Categoria' : 'Prodotto'}</div>
                </div>
                <div class="result-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </a>
        `;
    }

    highlightMatch(text, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    showNoResults(searchTerm) {
        let html = '<div class="search-results-header">';
        html += '<span class="results-count">Nessun risultato</span>';
        html += '<button class="close-results" onclick="smartSearch.hideResults()"><i class="fas fa-times"></i></button>';
        html += '</div>';

        html += '<div class="search-no-results">';
        html += '<i class="fas fa-search"></i>';
        html += `<p>Nessun risultato per "${searchTerm}"</p>`;
        html += '<small>Prova con termini diversi</small>';
        html += '</div>';

        this.searchResults.innerHTML = html;
        this.searchResults.style.display = 'block';
    }

    hideResults() {
        this.searchResults.style.display = 'none';
    }
}

// Initialize search when DOM is ready
let smartSearch;
document.addEventListener('DOMContentLoaded', () => {
    smartSearch = new SmartSearch();
});
