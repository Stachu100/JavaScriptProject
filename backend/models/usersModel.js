const connectDB = require("../db");

async function findByUserName(UserName) {
    const db = await connectDB();
    return db.get("SELECT * FROM Users WHERE UserName = ?", [UserName]);
}

async function addUser({ UserName, UserPassword }) {
    const db = await connectDB();
    return db.run(
        "INSERT INTO Users (UserName, UserPassword, IsAdmin) VALUES (?, ?, ?)",
        [UserName, UserPassword, false]
    );
}

module.exports = { findByUserName, addUser };