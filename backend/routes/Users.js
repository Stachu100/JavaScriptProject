const express = require("express");
const connectDB = require("../db");
const router = express.Router();

router.use(express.json());

router.post("/addUser", async (req, res) => {
    const { UserName, UserPassword } = req.body;

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

        await db.run("INSERT INTO Users (UserName, UserPassword, IsAdmin) VALUES (?, ?, ?)", [UserName, UserPassword, false]);

        res.json({ message: "Użytkownik dodany pomyślnie!" });
    } catch (error) {
        console.error("Błąd przy dodawaniu użytkownika:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
});

router.post("/login", async (req, res) => {
    const { UserName, UserPassword } = req.body;

    if (!UserName || !UserPassword) {
        return res.status(400).json({ message: "Nazwa użytkownika i hasło są wymagane!" });
    }

    try {
        const db = await connectDB();
        const user = await db.get("SELECT * FROM Users WHERE UserName = ?", [UserName]);

        if (!user) {
            return res.status(401).json({ message: "Nieprawidłowy login lub hasło." });
        }


        if (UserPassword === user.UserPassword) {
            res.json({ success: true, message: "Zalogowano pomyślnie!" });
        } else {
            res.status(401).json({ success: false, message: "Nieprawidłowy login lub hasło." });
        }
    } catch (error) {
        console.error("Błąd przy logowaniu użytkownika:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
});
module.exports = router;