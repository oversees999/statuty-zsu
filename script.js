// script.js
(function() {
    // DOM elements
    const navBtns = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    const searchInput = document.getElementById('search');
    const searchDropdown = document.getElementById('searchDropdown');
    
    let searchIndex = [];
    
    // Build search index from all content
    function buildSearchIndex() {
        const index = [];
        
        pages.forEach(page => {
            const pageId = page.id;
            const pageName = page.querySelector('.hero h2')?.innerText || pageId;
            
            // Get all text content
            const cards = page.querySelectorAll('.card');
            cards.forEach(card => {
                const title = card.querySelector('h3')?.innerText || '';
                const desc = card.querySelector('p')?.innerText || '';
                const fullText = `${title} ${desc}`;
                
                index.push({
                    text: fullText,
                    pageId: pageId,
                    pageName: pageName,
                    type: 'card',
                    title: title
                });
            });
            
            // Hero text
            const heroText = page.querySelector('.hero p')?.innerText || '';
            if (heroText) {
                index.push({
                    text: heroText,
                    pageId: pageId,
                    pageName: pageName,
                    type: 'hero',
                    title: 'Основна інформація'
                });
            }
            
            // Info panel
            const infoText = page.querySelector('.info-panel p')?.innerText || '';
            if (infoText) {
                index.push({
                    text: infoText,
                    pageId: pageId,
                    pageName: pageName,
                    type: 'info',
                    title: 'Важливо'
                });
            }
        });
        
        return index;
    }
    
    // Switch page function
    function switchPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
            }
        });
        
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === pageId) {
                btn.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Search functionality
    function performSearch(query) {
        if (!query || query.length < 2) {
            searchDropdown.classList.remove('active');
            return;
        }
        
        const lowerQuery = query.toLowerCase();
        const results = searchIndex.filter(item => 
            item.text.toLowerCase().includes(lowerQuery)
        );
        
        renderSearchResults(results.slice(0, 8));
    }
    
    function renderSearchResults(results) {
        if (results.length === 0) {
            searchDropdown.innerHTML = '<div class="search-item">❌ НІЧОГО НЕ ЗНАЙДЕНО</div>';
            searchDropdown.classList.add('active');
            return;
        }
        
        const html = results.map(result => {
            let preview = result.text;
            if (preview.length > 80) preview = preview.substring(0, 77) + '...';
            
            return `
                <div class="search-item" data-page="${result.pageId}">
                    <strong>📄 ${result.pageName}</strong><br>
                    <span style="font-size: 11px; color: #8bb56a;">${result.title || result.type}</span><br>
                    <span style="font-size: 11px;">${preview}</span>
                </div>
            `;
        }).join('');
        
        searchDropdown.innerHTML = html;
        searchDropdown.classList.add('active');
        
        // Add click handlers to search results
        document.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', () => {
                const pageId = item.getAttribute('data-page');
                if (pageId) {
                    switchPage(pageId);
                    searchDropdown.classList.remove('active');
                    searchInput.value = '';
                }
            });
        });
    }
    
    // Event listeners
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageId = btn.getAttribute('data-page');
            switchPage(pageId);
            // Clear search
            searchInput.value = '';
            searchDropdown.classList.remove('active');
        });
    });
    
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
    
    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.remove('active');
        }
    });
    
    // Initialize
    searchIndex = buildSearchIndex();
    
    // Ensure first page is active
    switchPage('page1');
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key >= '1' && e.key <= '3') {
            e.preventDefault();
            const pages = ['page1', 'page2', 'page3'];
            switchPage(pages[parseInt(e.key) - 1]);
        }
    });
    
    console.log('✅ СТАТУТИ ЗСУ завантажено | Система готова');
})();