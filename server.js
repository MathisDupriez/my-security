const express = require('express');
const fs = require('fs');
const path = require('path');
const imageSize = require('image-size');
const multer = require('multer');
const bodyParser = require("body-parser");


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


// Route pour recevoir et traiter les données du formulaire et télécharger l'image
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







app.get('/articles', async (req, res) => {
    res.json(await databaseManager.getAllFromTable('Articles'));
});
// Routes for other database tables
app.get('/sections', async (req, res) => {
    res.json(await databaseManager.getAllFromTable('sections'));
});

app.post('/sections', async (req, res) => {
    await databaseManager.insertIntoTable('sections', req.body);
    res.json({ message: 'Section added successfully.' });
});

app.get('/downloadables', async (req, res) => {
    res.json(await databaseManager.getAllFromTable('downloadables'));
});

app.post('/downloadables', async (req, res) => {
    await databaseManager.insertIntoTable('downloadables', req.body);
    res.json({ message: 'Downloadable added successfully.' });
});

app.get('/article_page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'Article.html'));
});
// Endpoint pour obtenir la liste des noms de fichiers d'image avec une hauteur définie
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
//route pour avoir le path de toute les image dans le dossier image
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
