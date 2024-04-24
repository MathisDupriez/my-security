// Sélection de l'élément template et de l'endroit où les articles seront ajoutés
var articleTemplate = document.getElementById('articleTemplate');
const index = document.getElementById('article');
// Fonction asynchrone pour vérifier si une image existe
async function imageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Fonction pour ajouter un nouvel article à la page
async function addArticle(articleTitle, articleContent,articleDate,articleLikes,articleImage) {
    const clone = document.importNode(articleTemplate.content, true);
    clone.getElementById('articleTitle').textContent = articleTitle || 'Article Title';
    clone.getElementById('articleContent').textContent = articleContent || 'Article Content';
    clone.getElementById('articleLike').textContent = articleLikes + " 👍" || 'Erreur';
    clone.getElementById('articleDate').textContent = articleDate || 'Date inconnue';
    // Vérifier si l'image existe
    const exists = await imageExists(articleImage);

    if (exists) {
        clone.getElementById('articleImage').src = articleImage;
    } else {
        clone.getElementById('articleImage').src = './image/no-image.png'; // Utilisation d'une image par défaut si l'image n'existe pas
    }
    clone.getElementById("articleButton").addEventListener("click", function() {
        //redirect to article page
        window.location.href = "/article_page";
    });
    index.appendChild(clone);
}



// Fonction asynchrone pour récupérer les articles depuis le serveur
async function fetchArticles() {
    try {
        const response = await fetch('/articles');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des articles : ' + response.status);
        }
        const articles = await response.json();
        return articles;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des articles :', error);
        return [];
    }
}

// Fonction principale asynchrone pour charger les articles
async function loadArticles() {
    const articles = await fetchArticles();
    // Parcours des articles et ajout à la page
    articles.forEach(article => {
        addArticle(article.Title, article.Content, article.Date, article.Likes, article.ImagePath);
    });
}

(async () => {
    try {
        // Récupérer les image du serveur Express
        const response = await fetch('/images');
        const images = await response.json();

        const carouselInner = document.querySelector('.carousel-inner');

        // Parcourir la liste des image et créer les éléments correspondants
        for (const image of images) {
            const index1 = images.indexOf(image);
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            if (index1 === 0) {
                carouselItem.classList.add('active');
            }

            const img = document.createElement('img');
            const exists = await imageExists('/image/' + image);
            if (exists) {
                img.src = '/image/' + image;
            } else {
                img.src= '/image/no-image.png'; // Utilisation d'une image par défaut si l'image n'existe pas
            }
            img.classList.add('d-block', 'w-100');
            img.alt = 'Image ' + index1;

            carouselItem.appendChild(img);
            carouselInner.appendChild(carouselItem);
        }
    } catch (error) {
        console.error('Une erreur est survenue : ', error);
    }
})();

// Appel de la fonction principale pour charger les articles
loadArticles();

