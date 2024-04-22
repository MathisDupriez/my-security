const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

module.exports = class Database {
    constructor(databaseName) {
        this.databaseName = databaseName;
        this.db = null;

        if (fs.existsSync(databaseName)) {
            console.log(`The database ${databaseName} exists. Opening...`);
            this.openDatabase();
        } else {
            console.log(`The database ${databaseName} does not exist. Creating...`);
            this.createDatabase();
        }
    }

    async createDatabase() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.databaseName, async (err) => {
                if (err) {
                    console.error(`Error creating the database: ${err.message}`);
                    reject(err);
                } else {
                    console.log(`Database ${this.databaseName} created successfully.`);
                    await this.createTables();
                    resolve();
                }
            });
        });
    }

    async openDatabase() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.databaseName, async (err) => {
                if (err) {
                    console.error(`Error opening the database: ${err.message}`);
                    reject(err);
                } else {
                    console.log(`Database ${this.databaseName} opened successfully.`);
                    resolve();
                }
            });
        });
    }

    async createTables() {
        console.log('Creating tables...');
        await this.createArticlesTable();
        console.log('Articles table created.');
        await this.createImagesTable();
        console.log('Images table created.');
        await this.createSectionTable();
        console.log('Section table created.');
        await this.createDownloadableTable();
        console.log('Downloadable table created.');
    }

    async createArticlesTable() {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS Articles (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Title TEXT,
                Content TEXT,
                Date TIMESTAMP,
                Likes INTEGER,
                ImagePath TEXT
            )`, (err) => {
                if (err) {
                    console.error(`Error creating Articles table: ${err.message}`);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    async createSectionTable() {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS Section (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT
            )`, (err) => {
                if (err) {
                    console.error(`Error creating Section table: ${err.message}`);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async createDownloadableTable() {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS Downloadable (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Path TEXT,
                SectionID INTEGER
            )`, (err) => {
                if (err) {
                    console.error(`Error creating Downloadable table: ${err.message}`);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async closeDatabase() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    console.error(`Error closing the database: ${err.message}`);
                    reject(err);
                } else {
                    console.log(`Database ${this.databaseName} closed successfully.`);
                    resolve();
                }
            });
        });
    }

    async insertIntoTable(tableName, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map(() => '?').join(',');

        const query = `INSERT INTO ${tableName} (${keys.join(',')}) VALUES (${placeholders})`;

        return new Promise((resolve, reject) => {
            this.db.run(query, values, function (err) {
                if (err) {
                    console.error(`Error inserting data into ${tableName}: ${err.message}`);
                    reject(err);
                } else {
                    console.log(`Data inserted into ${tableName} with ID ${this.lastID}`);
                    resolve(this.lastID);
                }
            });
        });
    }

    async getAllFromTable(tableName) {
        const query = `SELECT * FROM ${tableName}`;

        return new Promise((resolve, reject) => {
            this.db.all(query, (err, rows) => {
                if (err) {
                    console.error(`Error retrieving data from ${tableName}: ${err.message}`);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    async getLatestFromTable(tableName) {
        const query = `SELECT * FROM ${tableName} ORDER BY ID DESC LIMIT 10`;

        return new Promise((resolve, reject) => {
            this.db.all(query, (err, rows) => {
                if (err) {
                    console.error(`Error retrieving latest data from ${tableName}: ${err.message}`);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}


// sample for adding a new index
// const myDatabase = new database('database.db');
// const index = {
//     Title: 'Article Title',
//     Content: 'Article Content',
//     Date: new Date(),
//     Likes: 0,
//     ImageId: 1
// };


// sample for adding a new image
// const myDatabase = new database('database.db');
// const image = {
//     Path: 'path/to/image.jpg',
//     Date: new Date()
// };

// sample for adding a new section
// const myDatabase = new database('database.db');
// const section = {
//     Name: 'Section Name'
// };

// sample for adding a new downloadable
// const myDatabase = new database('database.db');
// const downloadable = {
//     Path: 'path/to/downloadable.pdf',
//     SectionID: 1
// };
