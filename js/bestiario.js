/* selectors y lógica adaptada a la estructura actual de `bestiario.html` */

document.addEventListener('DOMContentLoaded', () => {
  // en el HTML el input tiene id="search"
  const search = document.getElementById('search');
  if (!search) return; // nada que hacer si no existe

  // la mayoría de las tarjetas usan la clase "card" (no siempre existe "criatura")
  const cards = Array.from(document.querySelectorAll('.card'));

  function getCardName(card) {
    // intenta varias clases/etiquetas utilizadas en el HTML
    const el = card.querySelector('.card-name, h5, .name');
    return el ? el.textContent.trim().toLowerCase() : '';
  }

  function getCardDanger(card) {
    // comprueba atributo data-danger primero
    const attr = card.getAttribute('data-danger');
    if (attr) return attr;

    // si no hay atributo, busca en los elementos .meta texto que contenga la peligrosidad
    const metaEls = Array.from(card.querySelectorAll('.meta'));
    for (const m of metaEls) {
      const txt = (m.textContent || '').toLowerCase();
      // busca formatos como "4/5" o "peligrosidad: 4"
      const bySlash = txt.match(/(\d)\s*\/\s*5/);
      if (bySlash) return bySlash[1];
      const byLabel = txt.match(/peligrosidad[:\s]*([0-9])/i);
      if (byLabel) return byLabel[1];
    }
    return null;
  }

  function applyFilters() {
    const q = (search.value || '').trim().toLowerCase();

    cards.forEach(card => {
      const name = getCardName(card);
      const metaDanger = getCardDanger(card); // puede ser null
      const text = (card.innerText || '').toLowerCase();

      const matchesSearch = q === '' || name.includes(q) || text.includes(q);

      if (matchesSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  search.addEventListener('input', applyFilters);

  // aplicar una vez inicialmente para sincronizar la vista si el campo ya tiene texto
  applyFilters();
});