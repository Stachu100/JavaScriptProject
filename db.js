const path = require("path");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

// Funkcja do połączenia z bazą danych
async function connectDB() {
    try {
        const db = await sqlite.open({
            filename: path.join(__dirname, "database.sqlite"),
            driver: sqlite3.Database
        });
        return db;
    } catch (error) {
        console.error("Błąd połączenia z bazą danych:", error);
    }
}

module.exports = connectDB;