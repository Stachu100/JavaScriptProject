const express = require("express");
const connectDB = require("../db"); 
const router = express.Router();

router.use(express.json());

router.get("/getUserHistoryBooks/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const db = await connectDB();
        const history = await db.all(`
            SELECT Books.*, 
                   HistoryBorrowedBooks.BorrowedDate, 
                   HistoryBorrowedBooks.ReturnedDate,
                   HistoryBorrowedBooks.IsReturned
            FROM HistoryBorrowedBooks
            JOIN Books ON HistoryBorrowedBooks.BookId = Books.Id
            WHERE HistoryBorrowedBooks.UserId = ?`, 
            [userId]
        );

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera" });
    }
});

router.get("/getAllHistoryBooks", async (req, res) => {
    try {
        const db = await connectDB();
        const history = await db.all(`
            SELECT Books.*, 
                   HistoryBorrowedBooks.BorrowedDate, 
                   HistoryBorrowedBooks.ReturnedDate,
                   HistoryBorrowedBooks.IsReturned,
                   Users.UserName
            FROM HistoryBorrowedBooks
            JOIN Books ON HistoryBorrowedBooks.BookId = Books.Id
            JOIN Users ON HistoryBorrowedBooks.UserId = Users.Id`, 
        );

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera" });
    }
});

module.exports = router;