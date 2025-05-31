const connectDB = require("../db");

async function borrow({ userId, bookId, borrowedDate, returnDate }) {
    const db = await connectDB();
    await db.run(
        "INSERT INTO BorrowedBooks (UserId, BookId, BorrowedDate, ReturnDate) VALUES (?, ?, ?, ?)",
        [userId, bookId, borrowedDate, returnDate]
    );
    await db.run("UPDATE Books SET IsBorrowed = 1 WHERE Id = ?", [bookId]);
    await db.run(
        "INSERT INTO HistoryBorrowedBooks (UserId, BookId, BorrowedDate, ReturnedDate, IsReturned) VALUES (?, ?, ?, NULL, 0)",
        [userId, bookId, borrowedDate]
    );
}

async function getCurrentByUserId(userId) {
    const db = await connectDB();
    return db.all(
        `SELECT Books.*, BorrowedBooks.ReturnDate
         FROM BorrowedBooks
         JOIN Books ON BorrowedBooks.BookId = Books.Id
         WHERE BorrowedBooks.UserId = ?`,
        [userId]
    );
}

async function getCurrentByUserName(userName) {
    const db = await connectDB();
    return db.all(
        `SELECT Books.*, BorrowedBooks.ReturnDate
         FROM BorrowedBooks
         JOIN Books  ON BorrowedBooks.BookId = Books.Id
         JOIN Users  ON BorrowedBooks.UserId = Users.Id
         WHERE Users.UserName = ?`,
        [userName]
    );
}

async function returnBook({ userId, bookId, returnedDate }) {
    const db = await connectDB();
    await db.run(
        `UPDATE HistoryBorrowedBooks
         SET ReturnedDate = ?, IsReturned = 1
         WHERE UserId = ? AND BookId = ? AND IsReturned = 0`,
        [returnedDate, userId, bookId]
    );
    await db.run("UPDATE Books SET IsBorrowed = 0 WHERE Id = ?", [bookId]);
    await db.run(
        "DELETE FROM BorrowedBooks WHERE UserId = ? AND BookId = ?",
        [userId, bookId]
    );
}

module.exports = { borrow, getCurrentByUserId, getCurrentByUserName, returnBook };