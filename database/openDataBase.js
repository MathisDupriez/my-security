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
        await this.createSectionTable();
        console.log('Section table created.');
        await this.createDownloadableTable();
        console.log('Downloadable table created.');
        await this.createUserLikesTable();
        console.log('UserLikes table created.');
        await this.createUsersTable();
        console.log('Users table created.');
    }

    async createArticlesTable() {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS Articles (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Title TEXT,
                Content TEXT,
                Description TEXT,
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
    async createUserLikesTable() {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS UserLikes (
            LikeID INTEGER PRIMARY KEY AUTOINCREMENT,
            UserID INTEGER NOT NULL,
            ArticleID INTEGER NOT NULL,
            LikedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(UserID) REFERENCES Users(UserID),
            FOREIGN KEY(ArticleID) REFERENCES Articles(ArticleID)
            UNIQUE(UserID, ArticleID) ON CONFLICT IGNORE
        )`, (err) => {
                if (err) {
                    console.error(`Error creating UserLikes table: ${err.message}`);
                    reject(err);
                } else {
                    console.log("UserLikes table created successfully.");
                    resolve();
                }
            });
        });
    }
    async createUsersTable() {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS Users (
            UserID INTEGER PRIMARY KEY AUTOINCREMENT,
            Username TEXT NOT NULL UNIQUE,
            Email TEXT NOT NULL UNIQUE,
            PasswordHash TEXT NOT NULL,
            Token TEXT,
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
                if (err) {
                    console.error(`Error creating Users table: ${err.message}`);
                    reject(err);
                } else {
                    console.log("Users table created successfully.");
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
    async getByIdFromTable(tableName, id) {
        // Utilisation de placeholders pour éviter les injections SQL
        const query = `SELECT * FROM ${tableName} WHERE id = ?`;

        return new Promise((resolve, reject) => {
            this.db.get(query, [id], (err, row) => {
                if (err) {
                    console.error(`Error retrieving data from ${tableName} with ID ${id}: ${err.message}`);
                    reject(err);
                } else if (row) {
                    resolve(row);
                } else {
                    resolve(null); // Retourne null si aucun enregistrement n'est trouvé
                }
            });
        });
    }
    async updateColumnById(tableName, id, columnName, newValue) {
        // Préparation de la requête pour mettre à jour la colonne spécifique
        const updateQuery = `UPDATE ${tableName} SET ${columnName} = ? WHERE id = ?`;

        // Exécution de la mise à jour
        return new Promise((resolve, reject) => {
            this.db.run(updateQuery, [newValue, id], (err) => {
                if (err) {
                    console.error(`Error updating ${columnName} in ${tableName} with ID ${id}: ${err.message}`);
                    reject(err);
                } else {
                    console.log(`Column ${columnName} updated successfully in ${tableName} with ID ${id}.`);
                    resolve(`Column ${columnName} updated successfully.`);
                }
            });
        });
    }
    async deleteById(tableName, id) {
        // Préparation de la requête pour supprimer l'enregistrement spécifique
        const deleteQuery = `DELETE FROM ${tableName} WHERE id = ?`;

        // Exécution de la suppression
        return new Promise((resolve, reject) => {
            this.db.run(deleteQuery, [id], (err) => {
                if (err) {
                    console.error(`Error deleting record from ${tableName} with ID ${id}: ${err.message}`);
                    reject(err);
                } else {
                    console.log(`Record deleted successfully from ${tableName} with ID ${id}.`);
                    resolve(`Record deleted successfully.`);
                }
            });
        });
    }
    async incrementColumnById(tableName, id, columnName) {
        // Préparation de la requête pour incrémenter la colonne spécifique
        const incrementQuery = `UPDATE ${tableName} SET ${columnName} = ${columnName} + 1 WHERE id = ?`;

        // Exécution de la mise à jour
        return new Promise((resolve, reject) => {
            this.db.run(incrementQuery, [id], function(err) {
                if (err) {
                    console.error(`Error incrementing ${columnName} in ${tableName} with ID ${id}: ${err.message}`);
                    reject(err);
                } else {
                    console.log(`Column ${columnName} incremented successfully in ${tableName} with ID ${id}.`);
                    resolve(`Column ${columnName} incremented by 1 successfully. Rows affected: ${this.changes}`);
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
