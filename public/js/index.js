// Sélection de l'élément template et de l'endroit où les articles seront ajoutés
var articleTemplate = document.getElementById('articleTemplate');
const index = document.getElementById('article');

// Fonction pour ajouter un nouvel article à la page
function addArticle(articleTitle, articleContent, articleImage) {
    const clone = document.importNode(articleTemplate.content, true);
    clone.getElementById('articleTitle').textContent = articleTitle || 'Article Title';
    clone.getElementById('articleContent').textContent = articleContent || 'Article Content';
    clone.getElementById('articleImage').src = articleImage || './image/no-image.png';
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
        addArticle(article.Title, article.Content, article.ImagePath);
    });
}

// Appel de la fonction principale pour charger les articles
loadArticles();

// Ajout d'articles factices pour tester (facultatif)
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');

// Fonction pour ajouter un nouvel article (non utilisée dans ce code)
function postNewArticle() {
    // Vous pouvez implémenter ici la logique pour ajouter un nouvel article en envoyant une requête POST au serveur
}
