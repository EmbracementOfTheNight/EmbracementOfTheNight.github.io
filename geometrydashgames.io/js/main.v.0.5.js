const burger = document.querySelector('.burger');
const mobileNav = document.querySelector('.mobile-nav');
const body = document.body;

burger.addEventListener('click', () => {
    mobileNav.classList.toggle('-translate-x-full');
    body.classList.toggle('overflow-hidden');
    burger.classList.toggle('active');
});

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    burger.children[0].classList.toggle('rotate-45');
    burger.children[0].classList.toggle('translate-y-1.5');
    burger.children[1].classList.toggle('opacity-0');
    burger.children[2].classList.toggle('-rotate-45');
    burger.children[2].classList.toggle('-translate-y-1.5');
});

function toggleMobileLanguage() {
    const menu = document.getElementById('mobile-language-menu');
    menu.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', function() {
	// Get all tab buttons and content panels
	const tabButtons = document.querySelectorAll('.tab-button');
	const tabPanes = document.querySelectorAll('.tab-pane');
	
	// Function to activate the specified tab
	function activateTab(tabId) {
		// Hide all content panels
		tabPanes.forEach(pane => {
			pane.classList.add('hidden');
			pane.classList.remove('active');
		});
		
		// Show the selected content panel
		const activePane = document.getElementById(tabId + '-content');
		if (activePane) {
			activePane.classList.remove('hidden');
			activePane.classList.add('active');
		}
		
		// Update button styles
		tabButtons.forEach(button => {
			if (button.getAttribute('data-tab') === tabId) {
				button.classList.add('border-indigo-600', 'text-indigo-600');
				button.classList.remove('border-transparent', 'text-gray-500');
			} else {
				button.classList.remove('border-indigo-600', 'text-indigo-600');
				button.classList.add('border-transparent', 'text-gray-500');
			}
		});
	}
	
	// Add click event listeners to tab buttons
	tabButtons.forEach(button => {
		button.addEventListener('click', function() {
			const tabId = this.getAttribute('data-tab');
			activateTab(tabId);
		});
	});
	
	// Check for hash in URL on page load
	function checkHash() {
		if (window.location.hash) {
			const tabId = window.location.hash.substring(1);
			const validTabs = ['about', 'features', 'how-to', 'history', 'community', 'faq'];
			if (validTabs.includes(tabId)) {
				activateTab(tabId);
				return true;
			}
		}
		return false;
	}
	
	// If no valid hash in URL, default to first tab
	if (!checkHash()) {
		activateTab('about');
	}
});