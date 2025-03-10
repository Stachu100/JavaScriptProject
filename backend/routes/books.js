const express = require("express");
const multer = require("multer");
const connectDB = require("../db"); 
const path = require("path");
const router = express.Router();

// Konfiguracja multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/bookcover/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Obsługa dodawania książek
router.post("/addBook", upload.single("Image"), async (req, res) => {
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

// Obsługa pobierania książek
router.get("/getBooks", async (req, res) => {
    try {
        const db = await connectDB();
        const books = await db.all("SELECT * FROM Books");
        res.json(books);
    } catch (error) {
        console.error("Błąd przy pobieraniu książek:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
});

module.exports = router;