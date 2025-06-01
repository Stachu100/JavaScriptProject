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
                HistoryBorrowedBooks.IsReturned,
                Users.UserName
         FROM HistoryBorrowedBooks
         JOIN Books ON HistoryBorrowedBooks.BookId = Books.Id
         JOIN Users ON HistoryBorrowedBooks.UserId = Users.Id`
    );
}

module.exports = { getByUserId, getAll };