const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const multer = require("multer");

const app = express();
const PORT = 3000;

// Udostępnianie plików statycznych
app.use(express.static(path.join(__dirname, "WebPage")));
app.use(express.static(path.join(__dirname, "CSS")));
app.use(express.static(path.join(__dirname, "Function")));
app.use(express.static(path.join(__dirname, 'bookcover')));
app.use(express.urlencoded({ extended: true }));

// Połączenie z bazą danych
async function connectDB() {
    try {
        console.log("Otwieranie bazy danych...");
        const db = await sqlite.open({
            filename: path.join(__dirname, "database.sqlite"),
            driver: sqlite3.Database
        });
        console.log("Połączono z bazą danych!");
        return db;
    } catch (error) {
        console.error("Błąd połączenia z bazą danych:", error);
    }
}

// Konfiguracja multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "bookcover/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Obsługa dodawania książek
app.post("/addBook", upload.single("Image"), async (req, res) => {
    const { Author, Title } = req.body;
    const Image = req.file ? req.file.filename : null;

    if (!Author || !Title) {
        return res.status(400).json({ message: "Autor i tytuł są wymagane!" });
    }

    try {
        const db = await connectDB();
        await db.run("INSERT INTO Books (Title, Author, Image) VALUES (?, ?, ?)", [Title, Author, Image]);
        res.json({ message: "Książka dodana pomyślnie!" });
    } catch (error) {
        console.error("Błąd przy dodawaniu książki:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
});

app.get("/getBooks", async (req, res) => {
    try {
        const db = await connectDB();
        const books = await db.all("SELECT * FROM Books");

        res.json(books);
    } catch (error) {
        console.error("Błąd przy pobieraniu książek:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});