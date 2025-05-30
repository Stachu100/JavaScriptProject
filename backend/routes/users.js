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
        const existingUser = await db.get("SELECT * FROM Users WHERE UserName = ?", [UserName]);
        if (existingUser) {
            return res.status(400).json({ message: "Użytkownik o tej nazwie już istnieje!" });
        }

        await db.run("INSERT INTO Users (UserName, UserPassword, IsAdmin) VALUES (?, ?, ?)", [UserName, UserPassword, false]);

        res.json({ message: "Użytkownik dodany pomyślnie!" });
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = await connectDB();
        const user = await db.get("SELECT * FROM Users WHERE UserName = ?", [username]);

        if (!user) {
            return res.status(400).json({ message: "Nieprawidłowa nazwa użytkownika lub hasło!" });
        }

        if (password !== user.UserPassword) {
            return res.status(400).json({ message: "Nieprawidłowa nazwa użytkownika lub hasło!" });
        }

        res.json({ 
            message: "Zalogowano!", 
            user: { id: user.Id, username: user.UserName, isAdmin: user.IsAdmin } 
        });

    } catch (error) {
        res.status(500).json({ message: "Błąd serwera" });
    }
});

module.exports = router;
