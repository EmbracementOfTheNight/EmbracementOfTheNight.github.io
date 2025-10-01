function hideContent() {
  document.body.innerHTML = '<h2>Access denied.</h2>';
  document.body.style.background = '#fff';
}

async function checkPassword() {
  if (!sessionStorage.getItem('indexAccess')) {
    hideContent();
    let input = prompt("Enter the password to access this site:");
    if (!input) {
      hideContent();
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/auth', {
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
      }
    } catch (err) {
      console.error('Error:', err);
      hideContent();
    }
  }
}

document.addEventListener('DOMContentLoaded', checkPassword);