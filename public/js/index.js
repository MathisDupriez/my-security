var articleTemplate = document.getElementById('articleTemplate');
const index = document.getElementById('article');

function addArticle(articleTitle, articleContent, articleImage) {
  const clone = document.importNode(articleTemplate.content, true);
  clone.getElementById('articleTitle').textContent = articleTitle || 'Article Title';
    clone.getElementById('articleContent').textContent = articleContent || 'Article Content';
    clone.getElementById('articleImage').src = articleImage || './image/no-image.png';
    clone.getElementById('articleButton').addEventListener('click', function() {

    });
  index.appendChild(clone);
}

fetch('/articles')
  .then(response => response.json())
  .then(articles => {
    articles.forEach(article => {
      addArticle(article.title, article.content, article.image);
    });
  });
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');
addArticle('Article Title', 'Article Content', '');

// post a new index
const articles = {
    title: 'Article Title',
    content: 'Article Content',
    date: new Date(),
    likes: 0,
    image: '/image/ubuntu-ufw.png'
    };

