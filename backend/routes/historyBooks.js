const express = require("express");
const connectDB = require("../db"); 
const router = express.Router();

router.use(express.json());

router.get("/getUserHistoryBooks/:userId", async (req, res) => {
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
        console.error("Błąd przy pobieraniu historii książek:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
});

module.exports = router;