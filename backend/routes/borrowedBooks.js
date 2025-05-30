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

        await db.run("UPDATE Books SET IsBorrowed = 1 WHERE Id = ?", [bookId]);
        await db.run("INSERT INTO HistoryBorrowedBooks (UserId, BookId, BorrowedDate, ReturnedDate, IsReturned) VALUES (?, ?, ?, NULL, FALSE)", [userId,bookId,borrowedDate]);

        res.json({ message: "Książka została wypożyczona." });
    } catch (error) {
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
        res.status(500).json({ message: "Błąd serwera" });
    }
});

router.get("/getUserBorrowedUserBooks/:userName", async (req, res) => {
    const { userName } = req.params;

    try {
        const db = await connectDB();
        const borrowedUserBooks = await db.all(`
            SELECT Books.*, BorrowedBooks.UserId, BorrowedBooks.ReturnDate 
            FROM BorrowedBooks
            JOIN Books ON BorrowedBooks.BookId = Books.Id
            JOIN Users ON BorrowedBooks.UserId = Users.Id
            WHERE Users.UserName = ?`, [userName]
        );

        res.json(borrowedUserBooks);
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera" });
    }
});

router.post("/return", async (req, res) => {

    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
        return res.status(400).json({ message: "Brak wymaganych danych." });
    }

    try {
        const db = await connectDB();
        const returnedDate = new Date().toISOString();

        await db.run(
            `UPDATE HistoryBorrowedBooks
             SET ReturnedDate = ?, IsReturned = 1
             WHERE UserId = ? AND BookId = ? AND IsReturned = 0`,
            [returnedDate, userId, bookId]
        );

        await db.run(
            `UPDATE Books
             SET IsBorrowed = 0
             WHERE Id = ?`,
            [bookId]
        );

        await db.run(
            `DELETE FROM BorrowedBooks
             WHERE UserId = ? AND BookId = ?`,
            [userId, bookId]
        );

        res.json({ message: "Książka została oddana." });
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera przy oddawaniu książki." });
    }
});

module.exports = router;