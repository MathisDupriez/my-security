// Your markdown content
var markdownContent = null;
console.log(`/articles/${window.location.pathname.split('/').pop()}/data`)
async function fetchArticle() {
    try {
        const response = await fetch(`/articles/${window.location.pathname.split('/').pop()}/data`);
        if (!response.ok) {
            throw new Error('Error fetching article data: ' + response.status);
        }
        const article = await response.json();
        console.log(article);
        document.getElementById('mainTitle').textContent = article.Title;
        // Assumé que tu veux aussi utiliser le markdown pour le contenu de l'article,
        // tu pourrais avoir besoin d'une bibliothèque pour convertir markdown en HTML ici,
        // sinon, simplement assigne le contenu comme texte.
        markdownContent = article.Content;

        // Convert markdown to HTML and display
        document.getElementById('articleContent').innerHTML = marked.parse(markdownContent);
        document.getElementById('description').textContent = article.Description;
        document.getElementById('date').textContent = article.Date;
        if (article.ImagePath) {
            document.getElementById('image').src = article.ImagePath;
        } else {
            document.getElementById('articleImage').src = './image/no-image.png';
        }

    } catch (error) {
        console.error('An error occurred while fetching article data:', error);
    }
}
fetchArticle();
document.querySelectorAll('code').forEach((block) => {
    hljs.highlightBlock(block);
});