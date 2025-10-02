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

    const storedHash = '512cbd0bf2b0e3cd795f17b8751c6efd8f4e716ed76875684a2276a97ab3f456'; // Replace with your SHA-256 password hash

    if (hashHex === storedHash) {
      storage.setItem(STORAGE_KEY, 'true');
      document.documentElement.style.visibility = '';

    
      const currentPage = window.location.pathname;
      if (currentPage === '/' || currentPage.endsWith('/index.html')) {
        window.location.href = '/gallery.html';
      }
    } else {
      denyAccess();
    }
  }

  promptPassword();
})();