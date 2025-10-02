(function () {
  const STORAGE_KEY = 'indexAccess';
  const PERSIST = true;
  const storage = PERSIST ? localStorage : sessionStorage;

  // Pages allowed without password prompt once authenticated
  const allowedPages = ['gallery.html', 'index.html']; // add more if needed
  const currentPage = window.location.pathname.split('/').pop();

  // If already authorized
  if (storage.getItem(STORAGE_KEY) === 'true') {
    // If on index.html or another page that should redirect, redirect to gallery.html
    if (currentPage === 'index.html' || currentPage === '') {
      window.location.href = 'gallery.html';
    } else {
      // Allow access to other pages if authenticated
      document.documentElement.style.visibility = '';
    }
    return;
  }

  // Hide page immediately to prevent flash
  document.documentElement.style.visibility = 'hidden';

  // Prompt for password
  const correctPassword = 'p422w0rd'; // your password here
  const input = prompt('Enter the password to access this site:');

  if (!input || input !== correctPassword) {
    // Access denied message
    document.documentElement.style.visibility = '';
    document.body.innerHTML = '<h2 style="text-align:center; margin-top:20vh;">Access denied.</h2>';
    document.body.style.background = '#fff';
    return;
  }

  // Password correct
  storage.setItem(STORAGE_KEY, 'true');

  // If on index or root, redirect to gallery, else show page
  if (currentPage === 'index.html' || currentPage === '') {
    window.location.href = 'gallery.html';
  } else {
    document.documentElement.style.visibility = '';
  }
})();