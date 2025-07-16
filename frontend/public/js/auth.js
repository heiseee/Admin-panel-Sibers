document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('error'); 
  
  

    try {
      const response = await fetch('http://localhost:3500/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/admin';
      } else {
        errorElement.textContent = data.message || 'Login failed';
        errorElement.classList.add('show');      }
    } catch (error) {
      console.error('Login error:', error);
    }
  });