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
        console.log('Articles récupérés avec succès :', articles);
        return articles;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des articles :', error);
        return [];
    }
}

// Fonction principale asynchrone pour charger les articles
async function loadArticles() {
    const articles = await fetchArticles();
    console.log(articles);
    // Parcours des articles et ajout à la page
    articles.forEach(article => {
        addArticle(article.Title, article.Content, article.Date, article.Likes, article.ImagePath);
    });
}

// Appel de la fonction principale pour charger les articles
loadArticles();

