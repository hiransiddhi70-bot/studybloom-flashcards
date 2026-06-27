// Simple localStorage auth - demo ke liye
const users = JSON.parse(localStorage.getItem('studybloom-users') || '{}');

// Check login
if(!window.location.pathname.includes('index.html') &&!localStorage.getItem('currentUser')) {
  window.location.href = 'index.html';
}

// Login
document.getElementById('loginBtn')?.addEventListener('click', () => {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if(users[user] === pass) {
    localStorage.setItem('currentUser', user);
    window.location.href = 'dashboard.html';
  } else {
    alert('Wrong username or password Pookie 😭');
  }
});

// Signup
document.getElementById('signupBtn')?.addEventListener('click', () => {
  const user = document.getElementById('newUsername').value;
  const pass = document.getElementById('newPassword').value;
  if(user && pass) {
    users[user] = pass;
    localStorage.setItem('studybloom-users', JSON.stringify(users));
    localStorage.setItem('currentUser', user);
    window.location.href = 'dashboard.html';
  }
});

// Toggle forms
document.getElementById('signupToggle')?.addEventListener('click', () => {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('signupForm').classList.remove('hidden');
});

document.getElementById('loginToggle')?.addEventListener('click', () => {
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
});

// Set profile name
if(document.getElementById('profileName')) {
  document.getElementById('profileName').textContent = localStorage.getItem('currentUser') || 'Pookie';
}