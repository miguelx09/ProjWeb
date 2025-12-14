async function loadMovies() {
  try {
    const res = await fetch('/api/movies');
    const movies = await res.json();

    const tbody = document.getElementById('movies-body');
    tbody.innerHTML = '';

    movies.forEach(m => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${m.id_movie || m.id}</td>
        <td>${m.title}</td>
        <td>${m.release_year || ''}</td>
        <td>
          ${m.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w92${m.poster_path}" alt="${m.title}">`
            : ''}
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erro a carregar filmes:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadMovies);


async function searchTmdb() {
  const q = document.getElementById('tmdb-query').value.trim();
  if (!q) return;

  try {
    const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(q)}`);
    const data = await res.json();
    const results = data.results || data; // depende do formato da lib

    const tbody = document.getElementById('tmdb-results-body');
    tbody.innerHTML = '';

    results.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.title}</td>
        <td>${r.release_date ? r.release_date.slice(0, 4) : ''}</td>
        <td>
          ${r.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w92${r.poster_path}" alt="${r.title}">`
            : ''}
        </td>
        <td><button data-id="${r.id}" class="import-btn">Importar</button></td>
      `;
      tbody.appendChild(tr);
    });

    // ligar eventos aos botões Importar
    document.querySelectorAll('.import-btn').forEach(btn => {
      btn.addEventListener('click', () => importFromTmdb(btn.dataset.id));
    });
  } catch (err) {
    console.error('Erro a pesquisar na TMDB:', err);
  }
}

async function importFromTmdb(tmdbId) {
  try {
    const res = await fetch(`/api/tmdb/import/${tmdbId}`, {
      method: 'POST'
    });
    const data = await res.json();
    console.log('Import:', data);

    // recarrega a lista da BD
    await loadMovies();
  } catch (err) {
    console.error('Erro a importar da TMDB:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadMovies();

  const btn = document.getElementById('tmdb-search-btn');
  btn.addEventListener('click', searchTmdb);
});
