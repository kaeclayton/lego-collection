import { getMyCollection } from "./data.js";

const FAVORITES_KEY = 'legoFavorites';
let allSets = [];

function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}

function toggleFavorite(setNum) {
    let favorites = getFavorites();
    if (favorites.includes(setNum)) {
        favorites = favorites.filter(num => num !== setNum);
    } else {
        favorites.push(setNum);
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function favoriteLabel(isFavorited) {
    return isFavorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites';
}

const sorters = {
    'name': (a, b) => a.name.localeCompare(b.name),
    'pieces-desc': (a, b) => b.num_parts - a.num_parts,
    'pieces-asc': (a, b) => a.num_parts - b.num_parts,
    'year-desc': (a, b) => b.year - a.year,
    'year-asc': (a, b) => a.year - b.year
};

function populateThemeFilter() {
    const select = document.getElementById('theme-filter');
    const themes = [...new Set(allSets.map(set => set.theme).filter(Boolean))].sort();
    select.insertAdjacentHTML('beforeend',
        themes.map(theme => `<option value="${theme}">${theme}</option>`).join('')
    );
}

function getVisibleSets() {
    const theme = document.getElementById('theme-filter').value;
    const sortOrder = document.getElementById('sort-order').value;
    const favoritesOnly = document.getElementById('favorites-only').checked;
    const favorites = getFavorites();

    return allSets
        .filter(set => theme === 'all' || set.theme === theme)
        .filter(set => !favoritesOnly || favorites.includes(set.set_num))
        .sort(sorters[sortOrder]);
}

function showSetDetails(set) {
    const dialog = document.getElementById('lego-modal');
    const isFavorited = getFavorites().includes(set.set_num);

    dialog.innerHTML = `
        <div class="modal-content">
            <button type="button" class="modal-close" aria-label="Close">&times;</button>
            <h2>${set.name}</h2>
            <img class="modal-image" src="${set.lrg_img}" alt="${set.name}">
            <div class="modal-details">
                <p><strong>Set Number:</strong> ${set.set_num}</p>
                <p><strong>Year:</strong> ${set.year}</p>
                <p><strong>Pieces:</strong> ${set.num_parts.toLocaleString()}</p>
                ${set.theme ? `<p><strong>Theme:</strong> ${set.theme}</p>` : ''}
                <button type="button" class="favorite-btn">${favoriteLabel(isFavorited)}</button>
            </div>
        </div>
    `;

    dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());

    const favoriteBtn = dialog.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => {
        toggleFavorite(set.set_num);
        const nowFavorited = getFavorites().includes(set.set_num);
        favoriteBtn.textContent = favoriteLabel(nowFavorited);
        renderSets();
    });

    dialog.showModal();
}

function renderSets() {
    const container = document.getElementById('all-sets');
    const favorites = getFavorites();

    if (allSets.length === 0) {
        container.innerHTML = '<p>No LEGO sets found.</p>';
        return;
    }

    const visibleSets = getVisibleSets();
    document.getElementById('results-count').textContent =
        `Showing ${visibleSets.length} of ${allSets.length} sets`;
    
    if (visibleSets.length === 0) {
        container.innerHTML = '<p class="no-results">No sets match these filters. Try another theme or turn off Favorites only.</p>';
        return;
    }

    container.innerHTML = visibleSets.map(set => `
        <button type="button" class="gallery-card" data-set-num="${set.set_num}">
            <img src="${set.set_img}" alt="" loading="lazy" width="180" height="180">
            <span class="card-title">${set.name}</span>
            ${favorites.includes(set.set_num) ? '<span class="favorite-indicator">❤️ Favorite</span>' : ''}
        </button>
    `).join('');
}

async function initGallery() {
    const container = document.getElementById('all-sets');
    if (!container) return;

    allSets = await getMyCollection();
    populateThemeFilter();
    renderSets();

    ['theme-filter', 'sort-order', 'favorites-only'].forEach(id => {
        document.getElementById(id).addEventListener('change', renderSets);
    });

    // One listener for every card (event delegation)
    container.addEventListener('click', (event) => {
        const card = event.target.closest('.gallery-card');
        if (!card) return;
        const set = allSets.find(s => s.set_num === card.dataset.setNum);
        if (set) showSetDetails(set);
    });
}

document.addEventListener('DOMContentLoaded', initGallery);
