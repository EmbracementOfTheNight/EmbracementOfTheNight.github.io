(function () {
  const STORAGE_KEY = 'siteAuth';
  const AUTH_PAGE = '/gallery.html';  // page to redirect on success

  // Check if already authenticated
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    // Redirect instantly to gallery.html
    window.location.href = AUTH_PAGE;
    return; // stop further execution
  }

  // Hide content until auth check completes
  document.documentElement.style.visibility = 'hidden';

  function showAccessDenied() {
    document.documentElement.style.visibility = '';
    document.body.innerHTML = '<h2>Access denied.</h2>';
    document.body.style.background = '#fff';
  }

  async function promptPassword() {
    const input = prompt('Enter the password to access this site:');
    if (!input) {
      showAccessDenied();
      return;
    }

    // Hash the input to compare with stored hash
    const hash = await sha256(input);

    // Compare with your precomputed hash (example below)
    const storedHash = '512cbd0bf2b0e3cd795f17b8751c6efd8f4e716ed76875684a2276a97ab3f456';

    if (hash === storedHash) {
      localStorage.setItem(STORAGE_KEY, 'true');
      document.documentElement.style.visibility = '';
      window.location.href = AUTH_PAGE;
    } else {
      showAccessDenied();
    }
  }

  // Simple SHA-256 hashing function
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Start password prompt
  promptPassword();
})();