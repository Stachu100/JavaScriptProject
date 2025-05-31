const connectDB = require("../db");

async function getByUserId(userId) {
    const db = await connectDB();
    return db.all(
        `SELECT Books.*,
                HistoryBorrowedBooks.BorrowedDate,
                HistoryBorrowedBooks.ReturnedDate,
                HistoryBorrowedBooks.IsReturned
         FROM HistoryBorrowedBooks
         JOIN Books ON HistoryBorrowedBooks.BookId = Books.Id
         WHERE HistoryBorrowedBooks.UserId = ?`,
        [userId]
    );
}

async function getAll() {
    const db = await connectDB();
    return db.all(
        `SELECT Books.*,
                HistoryBorrowedBooks.BorrowedDate,
                HistoryBorrowedBooks.ReturnedDate,
                HistoryBorrowedBooks.IsReturned
         FROM HistoryBorrowedBooks
         JOIN Books ON HistoryBorrowedBooks.BookId = Books.Id`
    );
}

module.exports = { getByUserId, getAll };