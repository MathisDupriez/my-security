const express = require('express');
const fs = require('fs');
const path = require('path');
const imageSize = require('image-size');
const multer = require('multer');
const bcrypt = require('bcrypt');

const app = express();
const port = 54404;

app.use(express.static('public'));
app.use(express.static('image'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour parser les données de formulaire de type 'application/x-www-form-urlencoded'

const Database = require('./database/openDataBase.js');
const databaseManager = new Database('./database.db');


/**
 * Crée un middleware d'upload pour Multer avec un nom de fichier spécifié.
 *
 * @param {string} fieldName Le nom du champ du formulaire pour le fichier.
 * @param {string} desiredFilename Le nom de fichier désiré pour l'image sauvegardée.
 * @returns Middleware Multer pour gérer l'upload de fichiers.
 */
function multerUpload(fieldName, desiredFilename) {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            // Définir le répertoire de destination des fichiers
            cb(null, path.join(__dirname, 'public', 'image'));
        },
        filename: function(req, file, cb) {
            // Construire le nom de fichier final avec son extension originale
            const filename = req.body.name ? req.body.name + path.extname(file.originalname) : desiredFilename + path.extname(file.originalname);
            cb(null, filename);
        }
    });

    // Créer le middleware Multer pour le champ spécifié
    return multer({ storage }).single(fieldName);
}

const upload = multerUpload('image', 'no-named-image-' + Date.now());


// Route pour poster un nouvel article soit en postant une nouvelle image soit en choisissant une image existante
app.post('/articles',upload, async (req, res) => {
    try {
        var { title, content,description, date, likes,imagePath } = req.body;
        if(req.file){
            imagePath = '/image/' + req.body.name + path.extname(req.file.originalname)
        }
        await databaseManager.insertIntoTable('Articles', {
            title,
            content,
            description,
            date,
            likes: parseInt(likes, 10),
            imagePath
        });
        res.json({ message: 'Article publié avec succès.', success: true });
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        res.json({ message: 'Une erreur s\'est produite lors de la soumission de l\'article.', success: false });
    }
});

// Route pour obtenir la liste des articles et les afficher sur la page d'accueil
app.get('/articles', async (req, res) => {
    res.json(await databaseManager.getAllFromTable('Articles'));
});

// Route pour la page d'affichage d'un article en précisant l'url
app.get('/articles/:articleId', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'Article.content'));
});

// Route pour obtenir les données d'un article spécifique
app.get('/articles/:articleId/data', async (req, res) => {
    databaseManager.getByIdFromTable('Articles', req.params.articleId).then(article => {
        if (article) {
            console.log(article);
            res.json(article);
        } else {
            res.status(404).json({ message: 'Article non trouvé.' });
        }
    });
});










// Route pour obtenir la liste des images qui ont une hauteur entre 250 et 600 pixels
app.get('/images', async (req, res) => {
    const imagesDir = path.join(__dirname, 'public', 'image');
    try {
        const files = fs.readdirSync(imagesDir);
        const filteredImages = files.filter(file => {
            const filePath = path.join(imagesDir, file);
            const dimensions = imageSize(fs.readFileSync(filePath));
            return dimensions.height >= 250 && dimensions.height <= 600;
        });
        res.json(filteredImages);
    } catch (err) {
        console.error('Erreur lors de la lecture du dossier des images :', err);
        res.status(500).send('Erreur lors de la lecture du dossier des images');
    }
});
// Route pour avoir le path de toute les image dans le dossier image
app.get('/imagesPath', async (req, res) => {
    const imagesDir = path.join(__dirname, 'public', 'image');
    try {
        const files = fs.readdirSync(imagesDir);
        const filteredImages = files.map(file => {
            return '/image/' + file;
        });
        res.json(filteredImages);
    } catch (err) {
        console.error('Erreur lors de la lecture du dossier des images :', err);
        res.status(500).send('Erreur lors de la lecture du dossier des images');
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


async function hashPassword(password) {
    const saltRounds = 10; // Plus ce nombre est élevé, plus le hash est sécurisé et long à calculer
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error('Hashing error:', error);
        throw error; // Propager l'erreur pour une gestion ultérieure si nécessaire
    }
}