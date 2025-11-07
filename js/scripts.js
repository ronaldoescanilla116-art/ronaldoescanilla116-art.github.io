
// Script: búsqueda en la barra para filtrar cada criatura
// Busca por nombre ('.card-name') y por cualquier texto dentro de la tarjeta

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('search'); // id definido en la navbar
    if (!input) return; // no hay campo de búsqueda en esta página

    // Selecciona todas las tarjetas que contienen criaturas
    // Usamos '.card' que es la clase que tienen las tarjetas en `bestiario.html`
    const cards = Array.from(document.querySelectorAll('.card'));

        // Elemento para mostrar mensaje cuando no hay resultados
        const NO_RESULTS_ID = 'no-results-msg';
        let noResultsEl = null;

        // Extrae los <p class="meta"> de cada tarjeta y los transforma en atributos data-*
        function enrichCardsWithData() {
            cards.forEach(card => {
                const metas = Array.from(card.querySelectorAll('.meta'));
                metas.forEach(p => {
                    const txt = p.textContent.trim();
                    const parts = txt.split(':');
                    if (parts.length >= 2) {
                        const key = parts[0].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
                        const val = parts.slice(1).join(':').trim();
                        if (key) card.dataset[key] = val.toLowerCase();
                    }
                });
            });
        }

        // Crea o retorna el elemento que muestra el mensaje 'no results'
        function ensureNoResultsMessage() {
            if (noResultsEl) return noResultsEl;
            noResultsEl = document.getElementById(NO_RESULTS_ID);
            if (!noResultsEl) {
                noResultsEl = document.createElement('div');
                noResultsEl.id = NO_RESULTS_ID;
                noResultsEl.textContent = 'No se encontraron criaturas que coincidan con la búsqueda.';
                // estilos simples; puedes mover esto a CSS si prefieres
                noResultsEl.style.display = 'none';
                noResultsEl.style.textAlign = 'center';
                noResultsEl.style.padding = '0.75rem 1rem';
                noResultsEl.style.color = '#003300';
                noResultsEl.style.background = '#e6ffd6';
                noResultsEl.style.border = '1px solid #bfffb0';
                noResultsEl.style.borderRadius = '6px';
                noResultsEl.style.margin = '1rem 0';

                // Insertar antes del <main> si existe, o antes del footer
                const container = document.querySelector('.container');
                if (container) {
                    const main = container.querySelector('main');
                    if (main) container.insertBefore(noResultsEl, main);
                    else container.appendChild(noResultsEl);
                } else {
                    const footer = document.getElementById('footer');
                    if (footer && footer.parentNode) footer.parentNode.insertBefore(noResultsEl, footer);
                    else document.body.insertBefore(noResultsEl, document.body.firstChild);
                }
            }
            return noResultsEl;
        }

    function normalize(text) {
        return (text || '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    }

    function filterCards() {
        const q = normalize(input.value.trim());
        if (q === '') {
                cards.forEach(c => c.style.display = '');
                ensureNoResultsMessage().style.display = 'none';
                return;
        }

        const matched = [];
        cards.forEach(card => {
            const nameEl = card.querySelector('.card-name');
            const name = nameEl ? normalize(nameEl.textContent) : '';
            const text = normalize(card.innerText);

            const match = name.includes(q) || text.includes(q);
            card.style.display = match ? '' : 'none';
            // Añadir/remover clase highlight según corresponda
            if (match) matched.push(card);
            card.classList.toggle('highlight', match);
        });

        // Si hay coincidencias, desplazar la primera al centro de la pantalla
        if (matched.length > 0) {
            // dar un breve delay para que layout se estabilice antes del scroll
            setTimeout(() => {
                matched[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 120);
        }

        // Mostrar mensaje si no hay tarjetas visibles
        const anyVisible = matched.length > 0;
        ensureNoResultsMessage().style.display = anyVisible ? 'none' : '';
    }

    // Escuchar cambios y filtrar en tiempo real
    input.addEventListener('input', filterCards);

    // Permitir búsqueda al presionar Enter (opcional)
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterCards();
        }
    });
        // Enriquecer tarjetas con atributos data-* para uso futuro
        enrichCardsWithData();
        // Crear el mensaje «no results» oculto inicialmente
        ensureNoResultsMessage();
});


