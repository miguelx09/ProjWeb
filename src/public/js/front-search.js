async function searchTmdb() {
  const q = document.getElementById('tmdb-query').value.trim();
  if (!q) return;

  try {
    const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(q)}`);
    const data = await res.json();
    const results = data.results || data;

    const tbody = document.getElementById('tmdb-results-body');
    tbody.innerHTML = '';

    results.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.title}</td>
        <td>${r.release_date ? r.release_date.slice(0, 4) : ''}</td>
        <td>
          ${r.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w92${r.poster_path}" alt="${r.title}">`
            : ''}
        </td>
        <td>
          <button onclick="addFavoriteFromTmdb(${r.id})">Favorito</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erro a pesquisar na TMDB:', err);
  }
}

async function addFavoriteFromTmdb(tmdbId) {
  try {
    const importRes = await fetch(`/api/tmdb/import/${tmdbId}`, { method: 'POST' });
    const importData = await importRes.json();
    const movieId = importData.movieId;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Precisas de fazer login.');
      return;
    }

    const favRes = await fetch(`/api/favorites/${movieId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const favData = await favRes.json();
    alert(favData.message || 'Favorito adicionado');
  } catch (err) {
    console.error('Erro ao adicionar favorito:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tmdb-search-btn').addEventListener('click', searchTmdb);

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  });
});
