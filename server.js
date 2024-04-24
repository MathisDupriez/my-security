const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const imageSize = require('image-size');


const app = express();
const port = 54404;

app.use(express.static('public'));
app.use(express.static('image'));
app.use(bodyParser.urlencoded({ extended: true }));

const Database = require('./database/openDataBase.js');
const databaseManager = new Database('./database.db');

// Endpoint pour obtenir la liste des noms de fichiers d'image avec une hauteur définie
app.get('/images', async (req, res) => {
    const imagesDir = path.join(__dirname, 'public', 'image');
    try {
        // Lire le contenu du dossier des images
        const files = fs.readdirSync(imagesDir);

        // Filtrer les fichiers pour ne garder que les fichiers d'image avec une hauteur entre 250 et 600 pixels
        const filteredImages = [];
        for (const file of files) {
            const filePath = path.join(imagesDir, file);
            const dimensions = imageSize(fs.readFileSync(filePath));
            if (dimensions.height >= 250 && dimensions.height <= 600) {
                filteredImages.push(file);
            }
        }

        // Renvoyer la liste des noms de fichiers d'image filtrées
        res.json(filteredImages);
    } catch (err) {
        console.error('Erreur lors de la lecture du dossier des images :', err);
        res.status(500).send('Erreur lors de la lecture du dossier des images');
    }
});
// routes for the articles table
app.get('/articles', async (req, res) => {
    const articles = await databaseManager.getAllFromTable('articles');
    res.json(articles);
});
app.post('/articles', async (req, res) => {
    try {
        // Récupération des données du formulaire
        const { title, content, date, likes, imagePath } = req.body;
        // Initialisation de la base de données

        // Insertion des données dans la base de données
        await databaseManager.insertIntoTable('Articles', {
            Title: title,
            Content: content,
            Date: date,
            Likes: likes,
            ImagePath: imagePath
        });

        // Réponse de succès
        res.json({ message: 'Article publier avec succes.', success: true });
    } catch (error) {
        // Gestion des erreurs
        console.error('Une erreur s\'est produite :', error);
        res.json({ message: 'Une erreur s\'est produite lors de la soumission de l\'article.' });
    }
});

// routes for the sections table
app.get('/sections', async (req, res) => {
    const sections = await databaseManager.getAllFromTable('sections');
    res.json(sections);
});
app.post('/sections', async (req, res) => {
    const section = req.body;
    await databaseManager.insertIntoTable('sections', section);
    res.json({ message: 'Section added successfully.' });
});

// routes for the downloadables table
app.get('/downloadables', async (req, res) => {
    const downloadables = await databaseManager.getAllFromTable('downloadables');
    res.json(downloadables);
});

app.post('/downloadables', async (req, res) => {
    const downloadable = req.body;
    await databaseManager.insertIntoTable('downloadables', downloadable);
    res.json({ message: 'Downloadable added successfully.' });
});

app.get('/article_page' , async (req, res) => {
    res.sendFile(__dirname + '/public/html/Article.html');
});



// start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
