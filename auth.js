(function () {
  const STORAGE_KEY = 'siteAuthed_v1'; // change to expire existing logins
  const PERSIST = true;                 // true = localStorage (persists across browser sessions)
  const storage = PERSIST ? localStorage : sessionStorage;

  // the password hash approach is recommended — but for simplicity this example uses plaintext check.
  // Replace with a hash-check if you prefer (I can provide that).
  const CORRECT_PASSWORD = 'p422w0rd'; // TEMP: replace or use hashed-check

  // Run early: hide the document to avoid flashing protected content
  document.documentElement.style.visibility = 'hidden';

  function showDenied() {
    document.documentElement.style.visibility = '';
    document.body.innerHTML = '<h2 style="text-align:center; margin-top:20vh">Access denied.</h2>';
    document.body.style.background = '#fff';
  }

  function showPage() {
    // reveal the page after successful auth
    document.documentElement.style.visibility = '';
  }

  async function promptAndAuth() {
    const input = prompt('Enter the password to access this site:');
    if (!input) { showDenied(); return false; }
    // If you are storing a hash instead of plaintext, hash 'input' and compare.
    if (input === CORRECT_PASSWORD) {
      storage.setItem(STORAGE_KEY, 'true');
      return true;
    } else {
      showDenied();
      return false;
    }
  }

  (async function main() {
    try {
      // If we already marked the user as authorized, immediately show page
      if (storage.getItem(STORAGE_KEY) === 'true') {
        showPage();
        return;
      }

      // Not authorized yet -> prompt
      const ok = await promptAndAuth();
      if (ok) {
        showPage();
      }
    } catch (err) {
      console.error('Auth error', err);
      showDenied();
    }
  })();
})();