const { findByUserName, addUser } = require("../models/usersModel");

const usernamePattern = /^[\p{L}\p{N}_]{3,30}$/u;

const registerCtrl = async (req, res, next) => {
    try {
        const { UserName, UserPassword } = req.body;

        if (!UserName || !usernamePattern.test(UserName)) {
            return res.status(400).json({ message: "Nieprawidłowa nazwa użytkownika." });
        }
        if (!UserPassword || UserPassword.length < 5 || UserPassword.length > 100) {
            return res.status(400).json({ message: "Nieprawidłowe hasło." });
        }

        const exists = await findByUserName(UserName);
        if (exists) return res.status(400).json({ message: "Użytkownik o tej nazwie już istnieje!" });

        await addUser({ UserName, UserPassword });
        res.json({ message: "Użytkownik dodany pomyślnie!" });
    } catch (err) { next(err); }
};

const loginCtrl = async (req, res, next) => {
    try {
        const { UserName, UserPassword } = req.body;

        if (!UserName || !usernamePattern.test(UserName)) {
            return res.status(400).json({ message: "Nieprawidłowa nazwa użytkownika." });
        }
        if (!UserPassword || UserPassword.length < 5 || UserPassword.length > 100) {
            return res.status(400).json({ message: "Nieprawidłowe hasło." });
        }

        const user = await findByUserName(UserName);
        if (!user || UserPassword !== user.UserPassword) {
            return res.status(400).json({ message: "Nieprawidłowa nazwa użytkownika lub hasło!" });
        }
        res.json({
            message: "Zalogowano!",
            user: { id: user.Id, username: user.UserName, isAdmin: user.IsAdmin }
        });
    } catch (err) { next(err); }
};

const checkUserExistsCtrl = async (req, res, next) => {
    try {
        const { username } = req.params;

        if (!username || !usernamePattern.test(username)) {
            return res.status(400).json({ message: "Nieprawidłowa nazwa użytkownika." });
        }

        const user = await findByUserName(username);
        if (!user) {
            return res.status(404).json({ message: "Użytkownik nie istnieje." });
        }

        res.json({ exists: true });
    } catch (err) { next(err); }
};

module.exports = { registerCtrl, loginCtrl, checkUserExistsCtrl };