const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const port = 54404;

app.use(express.static('public'));
app.use(express.static('image'));

const Database = require('./database/openDatabase.js');

const databaseManager = new Database('database.db');

// routes for the articles table
app.get('/articles', async (req, res) => {
    const articles = await databaseManager.getAllFromTable('articles');
    console.log(articles);
    res.json(articles);
});
app.post('/articles', async (req, res) => {
    const article = req.body;
    await databaseManager.insertIntoTable('articles', article);
    res.json({ message: 'Article added successfully.' });
});

// routes for the images table
app.get('/images', async (req, res) => {
    const images = await databaseManager.getAllFromTable('images');
    res.json(images);
});
app.post('/images', async (req, res) => {
    const image = req.body;
    await databaseManager.insertIntoTable('images', image);
    res.json({ message: 'Image added successfully.' });
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
