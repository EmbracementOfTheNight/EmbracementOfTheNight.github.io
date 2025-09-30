function hideContent() {
  document.body.innerHTML = '';
  document.body.style.background = '#fff';
}

async function checkPassword() {
  if (!sessionStorage.getItem('indexAccess')) {
    hideContent();
    let input = prompt("Enter the password to access this site:");
    if (!input) {
      hideContent();
      document.body.innerHTML = '<h2>Access denied.</h2>';
      throw new Error('Access denied');
    }
    try {
      const response = await fetch('/auth', { // see note 3 below!
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input })
      });
      const result = await response.json();
      if (result.success) {
        sessionStorage.setItem('indexAccess', 'true');
        location.reload();
      } else {
        hideContent();
        document.body.innerHTML = '<h2>Access denied.</h2>';
        throw new Error('Access denied');
      }
    } catch (err) {
      hideContent();
      document.body.innerHTML = '<h2>Access denied.</h2>';
      throw new Error('Access denied');
    }
  }
}
document.addEventListener('DOMContentLoaded', function() {
  checkPassword();
  window.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      sessionStorage.removeItem('indexAccess');
      hideContent();
    } else if (!sessionStorage.getItem('indexAccess')) {
      hideContent();
      checkPassword();
    }
  });
});