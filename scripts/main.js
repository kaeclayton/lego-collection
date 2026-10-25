
function initNavigation() {
    const hamButton = document.getElementById('ham-button');
    const nav = document.querySelector('nav');

    if (hamButton) {
        hamButton.innerHTML = '<span></span><span></span><span></span>'

        if (window.innerWidth < 768) {
            nav.classList.remove('active');
        }

        hamButton.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamButton.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!hamButton.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('active');
                hamButton.classList.remove('active');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                nav.classList.remove('active');
                hamButton.classList.remove('active');
            }
        });
    }
}

function initPreferences() {
    if (!localStorage.getItem('legoTheme')) {
        localStorage.setItem('legoTheme', 'all');
    }
}

function updatePreferences(theme) {
    localStorage.setItem('legoTheme', theme);
    applyStoredPreferences();
}

function initFormActionPage() {
    if (window.location.pathname.includes('form-action.html')) {

        const detailsDiv = document.getElementById('submission-details');

        if (detailsDiv) {
            const urlParams = new URLSearchParams(window.location.search);

            if (urlParams.toString()) {
                const list = document.createElement('ul');
                for (const [key, value] of urlParams) {
                    if (value && value.trim() !== '') {
                        const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        const item = document.createElement('li');
                        const strong = document.createElement('strong');
                        strong.textContent = `${label}:`;
                        item.append(strong, ` ${value}`);
                        list.appendChild(item);
                    }
                }
                detailsDiv.replaceChildren(list);
            } else {
                detailsDiv.innerHTML = '<p>No form data received.  Please go back and try again.</p>';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPreferences();
    initFormActionPage();
});

export { initNavigation, initPreferences, updatePreferences };