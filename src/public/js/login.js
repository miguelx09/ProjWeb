document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      document.getElementById('msg').textContent = 'Login feito!';
      window.location.href = '/search.html';
    } else {
      document.getElementById('msg').textContent = data.message || 'Credenciais inválidas';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('msg').textContent = 'Erro no login';
  }
});
