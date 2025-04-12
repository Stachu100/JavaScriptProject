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

router.get("/getUserBorrowedUserBooks/:userName", async (req, res) => {
    const { userName } = req.params;

    try {
        const db = await connectDB();
        const borrowedUserBooks = await db.all(`
    SELECT Books.*, BorrowedBooks.ReturnDate 
    FROM BorrowedBooks
    JOIN Books ON BorrowedBooks.BookId = Books.Id
    JOIN Users ON BorrowedBooks.UserId = Users.Id
    WHERE Users.UserName = ?`, [userName]
        );

        res.json(borrowedUserBooks);
    } catch (error) {
        console.error("Błąd przy pobieraniu wypożyczeń użytkownika:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
});


module.exports = router;