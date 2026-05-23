// Dynamic Category Data Loader
// Loads category information from external JSON file

class CategoryLoader {
    constructor() {
        this.categories = [];
        this.dataLoaded = false;
    }

    async loadCategories() {
        try {
            const response = await fetch('/data/categories.json');
            this.categories = await response.json();
            this.dataLoaded = true;
            return this.categories;
        } catch (error) {
            console.error('Error loading category data:', error);
            return [];
        }
    }

    getCategoryById(id) {
        return this.categories.categories?.find(cat => cat.id === id);
    }

    getAllCategories() {
        return this.categories.categories || [];
    }

    getCategoryGradient(id) {
        const category = this.getCategoryById(id);
        return category ? category.headerGradient : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    getCategoryColor(id) {
        const category = this.getCategoryById(id);
        return category ? category.primaryColor : '#667eea';
    }
}

// Initialize global instance
window.categoryLoader = new CategoryLoader();

// Auto-load on page ready
document.addEventListener('DOMContentLoaded', () => {
    window.categoryLoader.loadCategories();
});
