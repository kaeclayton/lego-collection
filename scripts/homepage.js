import { getMyCollection } from "./data.js";

async function displayFeaturedSets() {
    let container;
    try {
        const allSets = await getMyCollection();
        container = document.getElementById('featured-sets');

        if (!container) {
            return;
        }
        if (allSets.length === 0) {
            return;
        }

        const largeSets = allSets.filter(set => set.num_parts > 1000);

        const shuffled = shuffleArray(largeSets);
        const featured = shuffled.slice(0, 3);

        container.innerHTML = featured.map(set => `
            <div class= "set">
                <h3>${set.set_num}: ${set.name}</h3>
                <img src="${set.set_img}" alt="${set.name}" loading="lazy">
                <p><strong>Pieces:</strong> ${set.num_parts.toLocaleString()}</p>
                <p><strong>Year:</strong> ${set.year}</p>
            </div> 
            `).join('');
    } catch (error) {
        if (container) {
            container.innerHTML = '<p>Unable to load featured sets at this time.</p>';
        }    
    }    
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

if (document.getElementById('featured-sets')) {
    document.addEventListener('DOMContentLoaded', displayFeaturedSets);
}    

async function displayDiscoverSets() {
    const container = document.getElementById('discover-sets');
    if (!container) return;

    try {
        const response = await fetch('data/discover-sets.json');
        if (!response.ok) throw new Error(response.status);
        const sets = await response.json();

        const picks = shuffleArray(sets).slice(0, 3);
        container.innerHTML = picks.map(set => `
            <a class="set" href="${set.url}" target="_blank" rel="noopener"
                <h3>${set.name}</h3>
                <img src-"${set.set_img}" alt="${set.name}" loading="lazy">
                <p><strong>Pieces:</strong> ${set.num_parts.toLocaleString()}</p>
                <p><strong>Year:</strong> ${set.year}</p>
            </a>
            `).join('');
    } catch (error) {
        container.closest('section').hidden = true;
    }
}

document.addEventListener('DOMContentLoaded', displayDiscoverSets);