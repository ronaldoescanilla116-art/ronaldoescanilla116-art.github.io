/*const boton = document.getElementById("btnBuscar");
const campo = document.getElementById("buscar aqui");*/

document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('buscar');
  const filterDanger = document.getElementById('filterDanger');
  const cards = Array.from(document.querySelectorAll('.criatura'));

  function applyFilters() {
    const q = search.value.trim().toLowerCase();
    const danger = filterDanger.value;

    cards.forEach(card => {
      const name = card.querySelector('.name').textContent.toLowerCase();
      const metaDanger = card.getAttribute('data-danger'); // '1'..'5'
      const text = card.innerText.toLowerCase();

      const matchesSearch = q === '' || name.includes(q) || text.includes(q);
      const matchesDanger = (danger === 'all') || (metaDanger === danger);

      if (matchesSearch && matchesDanger) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  search.addEventListener('input', applyFilters);
  filterDanger.addEventListener('change', applyFilters);
});