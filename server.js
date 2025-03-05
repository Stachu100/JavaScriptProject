const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3"); // Używamy sqlite3 jako zależności
const sqlite = require("sqlite");

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
        console.log("Importowanie sqlite...");
        
        // Sprawdzamy, czy sqlite3 jest zainstalowane
        if (!sqlite3) {
            console.error("sqlite3 nie jest dostępne");
            return;
        }

        console.log("Otwieranie bazy danych...");
        const db = await sqlite.open({
            filename: path.join(__dirname, "database.sqlite"),
            driver: sqlite3.Database
        });

        if (!db) {
            console.error("Nie udało się otworzyć bazy danych.");
            return;
        }

        console.log("Baza danych otwarta!");

        // Sprawdzenie danych z tabeli Books
        try {
            const books = await db.all("SELECT * FROM Books");
            console.log("Dane z tabeli Books:", books);
        } catch (err) {
            console.error("Błąd przy pobieraniu danych z tabeli Books:", err);
        }

        console.log("Połączono z bazą danych database.sqlite");
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