const linkData = {
    "Social": [
        { name: "Facebook", url: "https://www.facebook.com" },
        { name: "Instagram", url: "https://www.instagram.com" },
        { name: "LinkedIn", url: "https://www.linkedin.com" },
        { name: "Pinterest", url: "https://www.pinterest.com" }
    ],
    "Media": [
        { name: "Youtube", url: "https://www.youtube.com" },
        { name: "Twitch", url: "https://www.twitch.com" }
    ],
    "Outils": [
        { name: "GitHub", url: "https://www.github.com" },
        { name: "Connected", url: "https://connected.helha.be" }
    ],
    "Admin-sys": [
        { name: "admin-sys", url: "https://admin-sys.be" },
        { name: "cloud", url: "https://cloud.admin-sys.be" },
        { name: "project", url: "https://project.admin-sys.be" },
        { name: "wiki", url: "https://wiki.admin-sys.be" }
    ],
    "Administration / monitoring": [
        { name: "sensor", url: "https://sensor.admin-sys.be" },
        { name: "cockpit", url: "https://cockpit.admin-sys.be" },
        { name: "sq", url: "https://sq.admin-sys.be" },
        { name: "spam-control", url: "https://spam-control.admin-sys.be" }
    ]
};

// Fonction pour extraire le domaine principal
function extractDomain(url) {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    if (parts.length > 2) {
        return parts.slice(-2).join('.'); // Prend les 2 derniers segments pour les domaines principaux
    }
    return hostname; // Cas où le domaine est déjà principal
}

// Fonction pour vérifier si l'image est en cache
function checkImageCache(url, callback) {
    const img = new Image();
    img.src = url;
    img.onload = function() {
        // Si l'image se charge correctement, elle est en cache
        callback(true);
    };
    img.onerror = function() {
        // Si l'image ne se charge pas, elle n'est pas en cache ou inaccessible
        callback(false);
    };
}

// Fonction pour créer les catégories
function createCategories() {
    const contentContainer = document.querySelector('.content');

    Object.keys(linkData).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.dataset.category = category; // Ajout de la catégorie pour le filtrage

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);

        const linksContainer = document.createElement('div');
        linksContainer.classList.add('links-container');

        linkData[category].forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.target = "_blank";
            linkElement.classList.add('link-item');

            const containerElement = document.createElement('div');
            containerElement.classList.add('link-container');

            const imgElement = document.createElement('img');
            const domain = extractDomain(link.url);

            // Condition pour utiliser l'image par défaut pour les domaines admin-sys.be
            const isAdminSysDomain = domain.includes('admin-sys.be');
            const faviconUrl = isAdminSysDomain ? 'default.svg' : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

            // Vérifiez si l'image est en cache
            if (!isAdminSysDomain) {
                checkImageCache(faviconUrl, function(isCached) {
                    if (isCached) {
                        imgElement.src = faviconUrl;
                    } else {
                        imgElement.src = 'default.svg'; // Assurez-vous d'avoir une image par défaut
                    }
                });
            } else {
                imgElement.src = faviconUrl; // Utiliser l'image par défaut directement
            }

            imgElement.alt = link.name;

            const textElement = document.createElement('span');
            textElement.textContent = link.name;

            containerElement.appendChild(imgElement);
            containerElement.appendChild(textElement);
            linkElement.appendChild(containerElement);
            linksContainer.appendChild(linkElement);
        });

        categoryDiv.appendChild(linksContainer);
        contentContainer.appendChild(categoryDiv);
    });
}

// Fonction pour filtrer les catégories
function filterCategories() {
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', function() {
        const searchTerm = searchBar.value.toLowerCase();
        const categories = document.querySelectorAll('.category');

        categories.forEach(categoryDiv => {
            const links = categoryDiv.querySelectorAll('.link-item');
            const categoryTitle = categoryDiv.dataset.category.toLowerCase();
            const hasVisibleLinks = Array.from(links).some(link => link.textContent.toLowerCase().includes(searchTerm));

            // Affiche la catégorie si elle correspond ou si elle contient des liens visibles
            if (categoryTitle.includes(searchTerm) || hasVisibleLinks) {
                categoryDiv.style.display = 'block';
            } else {
                categoryDiv.style.display = 'none';
            }
        });
    });
}

// Fonction pour gérer la sélection du moteur de recherche
function handleSearchEngineChange() {
    const form = document.getElementById('internetSearchForm');
    const select = document.getElementById('searchEngineSelect');
    const input = document.getElementById('internetSearchBar');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire
        const selectedEngine = select.value;
        const query = encodeURIComponent(input.value.trim());
        if (query) {
            window.location.href = `${selectedEngine}?q=${query}`;
        }
    });

    select.addEventListener('change', function() {
        form.action = select.value;
    });
}

// Initialiser la page en créant les catégories, en ajoutant le filtrage et en gérant la sélection du moteur de recherche
createCategories();
filterCategories();
handleSearchEngineChange();
