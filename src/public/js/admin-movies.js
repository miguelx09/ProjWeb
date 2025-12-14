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
