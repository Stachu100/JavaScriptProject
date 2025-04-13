const express = require("express");
const multer = require("multer");
const connectDB = require("../db"); 
const path = require("path");
const fs = require('fs');
const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/bookcover/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post("/addBook", upload.single("Image"), async (req, res) => {
    const { Title, Author, Genre, MaxDays } = req.body;
    const Image = req.file ? req.file.filename : null;

    if (!Title || !Author || !Genre || !MaxDays) {
        return res.status(400).json({ message: "Brak wymaganych danych!" });
    }

    try {
        const db = await connectDB();
        await db.run(
            "INSERT INTO Books (Title, Author, Image, MaxDays, Genre, IsBorrowed) VALUES (?, ?, ?, ?, ?, ?)",
            [Title, Author, Image, MaxDays, Genre, 0]
        );

        res.json({ message: "Książka została dodana!" });
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera." });
    }
});

router.get("/getBooks", async (req, res) => {
    try {
        const db = await connectDB();
        const books = await db.all("SELECT * FROM Books WHERE IsBorrowed = 0");
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera" });
    }
});

router.delete("/deleteBooks/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const db = await connectDB();
        await db.run("DELETE FROM Books WHERE Id = ?", [id]);

        res.json({ message: "Książka została usunięta." });
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera." });
    }
});

router.put("/editBooks/:id", upload.single("Image"), async (req, res) => {
    const { id } = req.params;
    const { Title, Author, Genre, MaxDays } = req.body;
    const Image = req.file ? req.file.filename : null;

    if (!Title || !Author || !Genre || !MaxDays) {
        return res.status(400).json({ message: "Brak wymaganych danych!" });
    }

    try {
        const db = await connectDB();

        const bookExists = await db.get("SELECT * FROM Books WHERE Id = ?", [id]);
        if (!bookExists) {
            return res.status(404).json({ message: "Książka nie istnieje." });
        }

        if (Image && bookExists.Image) {
            const oldImagePath = path.join(__dirname, '..', '..', 'public', 'bookcover', bookExists.Image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        let sql = "UPDATE Books SET Title = ?, Author = ?, Genre = ?, MaxDays = ?";
        let params = [Title, Author, Genre, MaxDays];

        if (Image) {
            sql += ", Image = ?";
            params.push(Image);
        }

        sql += " WHERE Id = ?";
        params.push(id);

        await db.run(sql, params);

        res.json({ message: "Książka została zaktualizowana." });
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera." });
    }
});

module.exports = router;