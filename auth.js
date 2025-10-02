// auth.js - include this in <head> on every page (no defer)
(function(){
  const STORAGE_KEY = 'siteAccess';

  // If already authorized, just show the page
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    return; // allow page to load normally
  }

  // Hide page immediately to avoid content flash
  // (use visibility so layout remains but nothing is visible until we allow it)
  document.documentElement.style.visibility = 'hidden';

  // Prompt for password
  const pw = prompt('Enter the password to access this site:');
  if (!pw) {
    document.body.innerHTML = '<h2>Access denied.</h2>';
    document.documentElement.style.background = '#fff';
    return;
  }

  // Validate with your existing Netlify function
  fetch('/.netlify/functions/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: pw })
  })
  .then(res => res.json())
  .then(result => {
    if (result && result.success) {
      // Remember for future pages/tabs
      localStorage.setItem(STORAGE_KEY, 'true');

      // Reveal the page
      document.documentElement.style.visibility = '';
      // Optionally redirect to a specific page:
      // if (location.pathname === '/' || location.pathname.endsWith('index.html')) {
      //   location.href = 'gallery.html';
      // }
    } else {
      document.body.innerHTML = '<h2>Access denied.</h2>';
      document.documentElement.style.background = '#fff';
    }
  })
  .catch(err => {
    console.error('Auth error:', err);
    document.body.innerHTML = '<h2>Access denied.</h2>';
    document.documentElement.style.background = '#fff';
  });
})();
