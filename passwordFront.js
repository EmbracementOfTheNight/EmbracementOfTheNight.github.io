// script.js (frontend)
(() => {
  // REPLACE this with your Render backend URL:
  const API_BASE = 'https://embracementofthenight-github-io.onrender.com'; // <-- change this

  const enterBtn = document.getElementById('enterBtn');
  const messageDiv = document.getElementById('message');

  async function promptAndAuth() {
    messageDiv.textContent = '';
    const input = prompt('Enter the password to access this site:');
    if (!input) {
      messageDiv.textContent = 'Access denied.';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input })
      });

      if (!res.ok) {
        messageDiv.textContent = 'Server error. Try again later.';
        console.error('Non-200 response:', res.status, await res.text());
        return;
      }

      const result = await res.json();

      if (result && result.success) {
        // Redirect to dashboard (relative page within Netlify site)
        window.location.href = 'gallery.html';
      } else {
        messageDiv.textContent = 'Access denied. Wrong password.';
      }
    } catch (err) {
      console.error('Fetch error:', err);
      messageDiv.textContent = 'Access denied. (Network or server error)';
    }
  }

  enterBtn.addEventListener('click', promptAndAuth);

  // Optionally prompt immediately on page load:
  // window.addEventListener('DOMContentLoaded', promptAndAuth);
})();
