document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    document.getElementById('msg').textContent = data.message || 'Registado!';
  } catch (err) {
    console.error(err);
    document.getElementById('msg').textContent = 'Erro no registo';
  }
});
