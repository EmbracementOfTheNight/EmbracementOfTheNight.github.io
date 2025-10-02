(function () {
  const STORAGE_KEY = 'indexAccess'; // your localStorage key
  const PERSIST = true; // whether to use localStorage or sessionStorage
  const storage = PERSIST ? localStorage : sessionStorage;

  // If authorized, reveal the page (or do nothing)
  if (storage.getItem(STORAGE_KEY) === 'true') {
    document.documentElement.style.visibility = ''; // show page content
    return; // allow user to stay on the current page
  }

  // Hide content until authenticated
  document.documentElement.style.visibility = 'hidden';

  function denyAccess() {
    document.documentElement.style.visibility = '';
    document.body.innerHTML = '<h2>Access denied.</h2>';
    document.body.style.background = '#fff';
  }

  async function promptPassword() {
    const input = prompt('Enter the password to access this site:');
    if (!input) {
      denyAccess();
      return;
    }

    try {
      const response = await fetch('/auth', { // your backend endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input })
      });

      const result = await response.json();

      if (result && result.success) {
        storage.setItem(STORAGE_KEY, 'true');
        document.documentElement.style.visibility = '';
        // Stay on the current page after successful login
      } else {
        denyAccess();
      }
    } catch (err) {
      console.error('Auth error:', err);
      denyAccess();
    }
  }

  promptPassword();
})();