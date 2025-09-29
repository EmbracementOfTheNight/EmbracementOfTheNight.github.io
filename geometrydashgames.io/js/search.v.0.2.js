// Search functionality will be added here

let searchDataCache = [];
let isDataLoaded = false;

function preloadSearchData() {
  fetch('https://geometrydashgames.io/search-data.json')
    .then(res => res.json())
    .then(data => {
      searchDataCache = data;
      isDataLoaded = true;
      // check showLoadingState state
      const searchResults = document.getElementById('searchResults');
      if (searchResults && searchResults.innerHTML.includes('Loading game database')) {
        searchResults.innerHTML = '';
        searchResults.classList.add('hidden');
      }
    })
    .catch(err => console.error('Failed to load search data:', err));
}

preloadSearchData();

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const clearButton = document.getElementById('clearSearch');

  function showLoadingState() {
    searchResults.innerHTML = `
      <div class="p-3 text-gray-500 flex items-center">
        <svg class="animate-spin h-5 w-5 mr-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading game database...
      </div>
    `;
    searchResults.classList.remove('hidden');
  }

  function performSearch(query) {
    const term = query.trim().toLowerCase();
    const results = searchDataCache.filter(item => 
      item.title.toLowerCase().includes(term)
    );
    displayResults(results);
  }

  searchInput.addEventListener('input', function(e) {
    const query = e.target.value;
    const hasValue = query.length > 0;
    clearButton.classList.toggle('hidden', !hasValue);
    if (!isDataLoaded) {
      showLoadingState();
    } else {
      if (query.length > 0) {
        performSearch(query);
      } else {
        searchResults.innerHTML = '';
        searchResults.classList.add('hidden');
      }
    }
  });

  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.classList.add('hidden');
    clearButton.classList.add('hidden');
    searchInput.focus();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchInput.value) {
      clearButton.click();
    }
  });

  function displayResults(results) {
    searchResults.innerHTML = results.map(item => `
      <a href="${item.link}" class="group flex items-center p-3 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-0">
        <img loading="lazy" decoding="async" src="${item.image}" alt="${item.title}" class="w-12 h-12 mr-4 object-cover rounded-lg shadow-sm">
        <span class="text-gray-800 group-hover:text-indigo-700 font-medium">${item.title}</span>
      </a>
    `).join('');
    searchResults.classList.remove('hidden');
  }
});

// Add mobile search functionality and compatibility handling
document.addEventListener('DOMContentLoaded', function() {
	const mobileSearchBtn = document.getElementById('mobileSearchBtn');
	const mobileSearchContainer = document.getElementById('mobileSearchContainer');
	const closeMobileSearch = document.getElementById('closeMobileSearch');
	const mobileSearchInput = document.getElementById('mobileSearchInput');
	const mobileClearSearch = document.getElementById('mobileClearSearch');
	const mobileSearchResults = document.getElementById('mobileSearchResults');
	const searchInput = document.getElementById('searchInput');
	const searchIcon = document.getElementById('searchIcon');
	const mobileSearchIcon = document.getElementById('mobileSearchIcon');
	const clearSearch = document.getElementById('clearSearch');
	
	// Handle mobile search display/hide
	if(mobileSearchBtn) {
		mobileSearchBtn.addEventListener('click', function(e) {
			e.stopPropagation();
			mobileSearchContainer.classList.remove('-translate-y-full');
			mobileSearchContainer.classList.add('translate-y-0');
			setTimeout(() => mobileSearchInput.focus(), 300);
		});
	}
	
	// Close search box
	if(closeMobileSearch) {
		closeMobileSearch.addEventListener('click', function() {
			// Clear search input
			if(mobileSearchInput) {
				mobileSearchInput.value = '';
			}
			
			// Hide clear button
			if(mobileClearSearch) {
				mobileClearSearch.classList.add('hidden');
			}
			
			// Show search icon
			if(mobileSearchIcon) {
				mobileSearchIcon.classList.remove('hidden');
			}
			
			// Clear and hide search results
			if(mobileSearchResults) {
				mobileSearchResults.innerHTML = '';
				mobileSearchResults.classList.add('hidden');
			}
			
			// Close search panel
			mobileSearchContainer.classList.remove('translate-y-0');
			mobileSearchContainer.classList.add('-translate-y-full');
			
			// Synchronize and clear desktop search content
			const searchInput = document.getElementById('searchInput');
			const searchResults = document.getElementById('searchResults');
			const clearSearch = document.getElementById('clearSearch');
			const searchIcon = document.getElementById('searchIcon');
			
			if(searchInput) {
				searchInput.value = '';
			}
			
			if(clearSearch) {
				clearSearch.classList.add('hidden');
			}
			
			if(searchIcon) {
				searchIcon.classList.remove('hidden');
			}
			
			if(searchResults) {
				searchResults.innerHTML = '';
				searchResults.classList.add('hidden');
			}
		});
	}
	
	// Close search box when clicking outside
	document.addEventListener('click', function(event) {
		if (mobileSearchContainer && !mobileSearchContainer.contains(event.target) && event.target !== mobileSearchBtn) {
			mobileSearchContainer.classList.remove('translate-y-0');
			mobileSearchContainer.classList.add('-translate-y-full');
		}
	});
	
	// Synchronize mobile search box with main search box
	if (mobileSearchInput && mobileClearSearch && mobileSearchResults) {
		// Synchronize mobile search with desktop search
		const searchInput = document.getElementById('searchInput');
		const searchResults = document.getElementById('searchResults');
		const clearSearch = document.getElementById('clearSearch');
		
		// Add search functionality directly to mobile search box
		mobileSearchInput.addEventListener('input', function() {
			const query = this.value;
			
			// Sync to desktop search
			if (searchInput) {
				searchInput.value = query;
				// Trigger desktop search input event
				const event = new Event('input', { bubbles: true });
				searchInput.dispatchEvent(event);
			}
			
			// Copy from desktop search results to mobile
			setTimeout(() => {
				if (searchResults && mobileSearchResults) {
					if (searchResults.innerHTML) {
						mobileSearchResults.innerHTML = searchResults.innerHTML;
						mobileSearchResults.classList.remove('hidden');
					} else if (query.length === 0) {
						mobileSearchResults.innerHTML = '';
						mobileSearchResults.classList.add('hidden');
					}
				}
			}, 100); // Brief delay to wait for search results generation
		});
		
		// Mobile clear button functionality
		mobileClearSearch.addEventListener('click', function() {
			// Only clear search content and results, don't close search panel
			mobileSearchInput.value = '';
			mobileClearSearch.classList.add('hidden');
			mobileSearchIcon.classList.remove('hidden');
			mobileSearchResults.innerHTML = '';
			mobileSearchResults.classList.add('hidden');
			
			// Sync to desktop search
			if (searchInput && clearSearch) {
				searchInput.value = '';
				// Trigger input event to update UI state
				const event = new Event('input', { bubbles: true });
				searchInput.dispatchEvent(event);
			}
			
			// Refocus on search box for easier new input
			mobileSearchInput.focus();
		});
		
		// Mobile ESC key functionality
		mobileSearchInput.addEventListener('keydown', function(e) {
			if (e.key === 'Escape') {
				if (mobileSearchInput.value) {
					// If there's search content, clear it first
					mobileClearSearch.click();
				} else {
					// If there's no content, close the search panel
					closeMobileSearch.click();
				}
			}
		});
		
		// Handle search results click
		mobileSearchResults.addEventListener('click', function(e) {
			// Close search box
			// mobileSearchContainer.classList.remove('translate-y-0');
			// mobileSearchContainer.classList.add('-translate-y-full');
		});
	}
	
	// Ensure X button and search icon aren't displayed simultaneously - Desktop version
	if (searchInput && clearSearch && searchIcon) {
		// Initial check - If there's a value, show clear button
		if (searchInput.value.length > 0) {
			clearSearch.classList.remove('hidden');
			searchIcon.classList.add('hidden');
		}
		
		searchInput.addEventListener('input', function() {
			if (this.value.length > 0) {
				clearSearch.classList.remove('hidden');
				searchIcon.classList.add('hidden');
			} else {
				clearSearch.classList.add('hidden');
				searchIcon.classList.remove('hidden');
			}
		});
		
		clearSearch.addEventListener('click', function() {
			searchIcon.classList.remove('hidden');
			clearSearch.classList.add('hidden');
		});
	}
	
	// Ensure X button and search icon aren't displayed simultaneously - Mobile version
	if (mobileSearchInput && mobileClearSearch && mobileSearchIcon) {
		// Initial check - If there's a value, show clear button
		if (mobileSearchInput.value.length > 0) {
			mobileClearSearch.classList.remove('hidden');
			mobileSearchIcon.classList.add('hidden');
		}
		
		mobileSearchInput.addEventListener('input', function() {
			if (this.value.length > 0) {
				mobileClearSearch.classList.remove('hidden');
				mobileSearchIcon.classList.add('hidden');
			} else {
				mobileClearSearch.classList.add('hidden');
				mobileSearchIcon.classList.remove('hidden');
			}
		});
		
		mobileClearSearch.addEventListener('click', function() {
			mobileSearchIcon.classList.remove('hidden');
			mobileClearSearch.classList.add('hidden');
		});
	}
});
