const express = require("express");
const path = require("path");
const { open } = require("sqlite");

const app = express();
const PORT = 3000;

// Udostępniamy pliki statyczne z folderów WebPage, CSS i Function
app.use(express.static(path.join(__dirname, "WebPage")));
app.use(express.static(path.join(__dirname, "CSS")));
app.use(express.static(path.join(__dirname, "Function")));

app.use(express.urlencoded({ extended: true }));

// Przekierowanie domyślne na stronę logowania
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "WebPage", "index.html"));
});

// Funkcja do połączenia z bazą danych i wykonania zapytania 


async function connectDB() {
    try {
        console.log("🔍 Importowanie sqlite...");
        const sqlite = await import("sqlite").catch(err => console.error(" Błąd importu sqlite:", err));

        if (!sqlite) {
            console.error(" SQLite nie zostało załadowane!");
            return;
        }

        console.log(" Otwieranie bazy danych...");
        const db = await open({
            filename: path.join(__dirname, "library.db"),
            driver: sqlite.Database
        }).catch(err => console.error(" Błąd otwierania bazy:", err));

        const books = await db("SELECT * FROM Books");
        console.log("Dane z tabeli Books:", books);

        if (!db) {
            console.error(" Nie udało się otworzyć bazy!");
            return;
        }

        console.log("Połączono z bazą danych Library.db");
        return db;
    } catch (error) {
        console.error("Błąd połączenia z bazą danych:", error);
    }
}

console.log("Próba połączenia z bazą danych...");
connectDB();


// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
