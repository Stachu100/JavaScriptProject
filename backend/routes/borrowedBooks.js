const express = require("express");
const connectDB = require("../db"); 
const router = express.Router();

router.use(express.json());

router.post("/borrow", async (req, res) => {
    const { userId, bookId, borrowedDate, returnDate } = req.body;

    if (!userId || !bookId || !borrowedDate || !returnDate) {
        return res.status(400).json({ message: "Brak wymaganych danych." });
    }

    try {
        const db = await connectDB();
        await db.run(
            "INSERT INTO BorrowedBooks (UserId, BookId, BorrowedDate, ReturnDate) VALUES (?, ?, ?, ?)",
            [userId, bookId, borrowedDate, returnDate]
        );

        res.json({ message: "Książka została wypożyczona." });
    } catch (error) {
        console.error("Błąd przy wypożyczaniu książki:", error);
        res.status(500).json({ message: "Błąd serwera." });
    }
});

router.get("/getUserBorrowedBooks/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const db = await connectDB();
        const borrowedBooks = await db.all(`
            SELECT Books.*, BorrowedBooks.ReturnDate 
            FROM BorrowedBooks
            JOIN Books ON BorrowedBooks.BookId = Books.Id
            WHERE BorrowedBooks.UserId = ?`, [userId]
        );

        res.json(borrowedBooks);
    } catch (error) {
        console.error("Błąd przy pobieraniu wypożyczonych książek:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
});

module.exports = router;