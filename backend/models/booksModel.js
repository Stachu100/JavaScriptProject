const connectDB = require("../db");

async function addBook({ Title, Author, Genre, MaxDays, Image }) {
    const db = await connectDB();
    return db.run(
        "INSERT INTO Books (Title, Author, Image, MaxDays, Genre, IsBorrowed) VALUES (?, ?, ?, ?, ?, 0)",
        [Title, Author, Image, MaxDays, Genre]
    );
}

async function getAllAvailable() {
    const db = await connectDB();
    return db.all("SELECT * FROM Books WHERE IsBorrowed = 0");
}

async function deleteBook(id) {
    const db = await connectDB();
    return db.run("DELETE FROM Books WHERE Id = ?", [id]);
}

async function getById(id) {
    const db = await connectDB();
    return db.get("SELECT * FROM Books WHERE Id = ?", [id]);
}

async function updateBook(sql, params) {
    const db = await connectDB();
    return db.run(sql, params);
}

module.exports = { addBook, getAllAvailable, deleteBook, getById, updateBook };