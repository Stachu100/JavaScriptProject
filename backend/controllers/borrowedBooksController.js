const {
    borrow,
    getCurrentByUserId,
    getCurrentByUserName,
    returnBook,
} = require("../models/borrowedBooksModel");

const borrowCtrl = async (req, res, next) => {
    try {
        const { userId, bookId, borrowedDate, returnDate } = req.body;
        if (!userId || !bookId || !borrowedDate || !returnDate) {
            return res.status(400).json({ message: "Brak wymaganych danych." });
        }
        await borrow({ userId, bookId, borrowedDate, returnDate });
        res.json({ message: "Książka została wypożyczona." });
    } catch (err) { next(err); }
};

const getUserBorrowedBooksCtrl = async (req, res, next) => {
    try {
        res.json(await getCurrentByUserId(req.params.userId));
    } catch (err) { next(err); }
};

const getUserBorrowedUserBooksCtrl = async (req, res, next) => {
    try {
        res.json(await getCurrentByUserName(req.params.userName));
    } catch (err) { next(err); }
};

const returnCtrl = async (req, res, next) => {
    try {
        const { userId, bookId } = req.body;
        if (!userId || !bookId) return res.status(400).json({ message: "Brak wymaganych danych." });

        await returnBook({ userId, bookId, returnedDate: new Date().toISOString() });
        res.json({ message: "Książka została oddana." });
    } catch (err) { next(err); }
};

module.exports = {
    borrowCtrl,
    getUserBorrowedBooksCtrl,
    getUserBorrowedUserBooksCtrl,
    returnCtrl,
};