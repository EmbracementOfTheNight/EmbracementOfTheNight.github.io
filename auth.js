(function () {
  const STORAGE_KEY = 'indexAccess';
  const PERSIST = true;
  const storage = PERSIST ? localStorage : sessionStorage;

  if (storage.getItem(STORAGE_KEY) === 'true') {
    document.documentElement.style.visibility = '';
    return;
  }

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

    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const storedHash = 'c235ab8126351c993b1c89e1fa37e4426f1569b6c6e7d5d81ebc8c6a1d490128'; // ← hash of "p422w0rd"

    if (hashHex === storedHash) {
      storage.setItem(STORAGE_KEY, 'true');
      document.documentElement.style.visibility = '';

      const currentPage = window.location.pathname;
      if (currentPage === '/' || currentPage.endsWith('/index.html')) {
        window.location.href = 'gallery.html';
      }
    } else {
      denyAccess();
    }
  }

  promptPassword();
})();