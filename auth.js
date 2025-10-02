(function () {
  const STORAGE_KEY = 'indexAccess'; // change to something unique if you want
  const PERSIST = true; // set true to use localStorage (persists across browser sessions)

  const storage = PERSIST ? localStorage : sessionStorage;

  // If already authorized, redirect to gallery immediately
  if (storage.getItem(STORAGE_KEY) === 'true') {
    window.location.href = 'gallery.html';
    return;
  }

  // Hide page immediately to avoid flashing protected content
  // Use visibility so CSS/layout remains but nothing is shown until auth completes.
  document.documentElement.style.visibility = 'hidden';

  function hideDenied() {
    document.documentElement.style.visibility = ''; // show the plain message
    document.body.innerHTML = '<h2>Access denied.</h2>';
    document.body.style.background = '#fff';
  }

  async function checkPassword() {
    // prompt for password
    const input = prompt('Enter the password to access this site:');
    if (!input) {
      hideDenied();
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input })
      });

      const result = await response.json();

      if (result && result.success) {
        storage.setItem(STORAGE_KEY, 'true');
        // reveal the page now that it's authorized
        document.documentElement.style.visibility = '';
        window.location.href = 'gallery.html';
      } else {
        hideDenied();
      }
    } catch (err) {
      console.error('Error during auth:', err);
      hideDenied();
    }
  }

  checkPassword();
})();