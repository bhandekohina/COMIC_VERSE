// Advanced Search Functionality
function initSearch() {
    const searchInput = document.getElementById('search');
    const suggestionsBox = document.getElementById('suggestions');

    if (!searchInput || !suggestionsBox) return;

    function showSuggestions(matches) {
        if (!matches || matches.length === 0) {
            suggestionsBox.style.display = 'none';
            suggestionsBox.innerHTML = '';
            return;
        }
        
        suggestionsBox.style.display = 'block';
        suggestionsBox.innerHTML = matches.slice(0, 8).map(match => `
            <div class="suggestion-item" data-id="${match.id}" onclick="onSuggestionClick(${match.id})">
                <img src="${match.cover}" alt="${match.title}">
                <div class="suggestion-info">
                    <div class="suggestion-title">${match.title}</div>
                    <div class="suggestion-meta">${match.publisher} • $${match.price.toFixed(2)}</div>
                </div>
            </div>
        `).join('');
    }

    function clearPopouts() {
        document.querySelectorAll('.comic-card.pop-out').forEach(el => {
            el.classList.remove('pop-out');
        });
        
        // Show all cards if search is cleared
        if (!searchInput.value.trim()) {
            document.querySelectorAll('.comic-card').forEach(card => {
                card.style.display = 'block';
            });
        }
    }

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim().toLowerCase();
        
        if (!value) {
            suggestionsBox.style.display = 'none';
            clearPopouts();
            return;
        }

        // Find matches
        const matches = comicsData.filter(comic => 
            comic.title.toLowerCase().includes(value) || 
            comic.publisher.toLowerCase().includes(value) ||
            comic.writer.toLowerCase().includes(value)
        );

        showSuggestions(matches);

        // Highlight matches with pop-out effect
        clearPopouts();
        matches.forEach(match => {
            const element = document.querySelector(`.comic-card[data-id="${match.id}"]`);
            if (element) {
                element.classList.add('pop-out');
            }
        });

        // Hide non-matching cards
        document.querySelectorAll('.comic-card').forEach(card => {
            const title = card.querySelector('.comic-title').textContent.toLowerCase();
            const publisher = card.querySelector('.comic-publisher').textContent.toLowerCase();
            const shouldShow = title.includes(value) || publisher.includes(value);
            card.style.display = shouldShow ? 'block' : 'none';
        });

        // Auto-scroll to first match if there's only one
        if (matches.length === 1) {
            const element = document.querySelector(`.comic-card[data-id="${matches[0].id}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            if (!query) return;
            
            const match = comicsData.find(comic => 
                comic.title.toLowerCase().includes(query)
            );
            
            if (match) {
                onSuggestionClick(match.id);
            } else {
                // Visual feedback for no results
                searchInput.style.transform = 'translateX(-5px)';
                setTimeout(() => {
                    searchInput.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        searchInput.style.transform = '';
                    }, 100);
                }, 100);
            }
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}

function onSuggestionClick(id) {
    const suggestionsBox = document.getElementById('suggestions');
    const searchInput = document.getElementById('search');
    
    if (suggestionsBox) suggestionsBox.style.display = 'none';
    if (searchInput) searchInput.value = '';
    
    // Find and highlight the comic card
    const element = document.querySelector(`.comic-card[data-id="${id}"]`);
    if (element) {
        element.classList.add('pop-out');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            element.classList.remove('pop-out');
        }, 2000);
    }
    
    // Navigate to detail page
    window.location.href = `comic-detail.html?id=${id}`;
}