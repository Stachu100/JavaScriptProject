const express = require("express");
const multer = require("multer");
const connectDB = require("../db"); 
const path = require("path");
const router = express.Router();

// Obsługa dodawania użytkownika
router.post("/addUser", async (req, res) => {
    const { UserName, UserPassword } = req.body;

    // Walidacja danych
    if (!UserName || !UserPassword) {
        return res.status(400).json({ message: "Nazwa użytkownika i hasło są wymagane!" });
    }

    try {
        const db = await connectDB();
        // Sprawdzenie, czy użytkownik już istnieje
        const existingUser = await db.get("SELECT * FROM Users WHERE UserName = ?", [UserName]);
        if (existingUser) {
            return res.status(400).json({ message: "Użytkownik o tej nazwie już istnieje!" });
        }

        await db.run("INSERT INTO Users (UserName, UserPassword) VALUES (?, ?)", [UserName, UserPassword]);

        res.json({ message: "Użytkownik dodany pomyślnie!" });
    } catch (error) {
        console.error("Błąd przy dodawaniu użytkownika:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
});

module.exports = router;
