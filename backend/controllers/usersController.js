const { findByUserName, addUser } = require("../models/usersModel");

const registerCtrl = async (req, res, next) => {
    try {
        const { UserName, UserPassword } = req.body;
        if (!UserName || !UserPassword) {
            return res.status(400).json({ message: "Nazwa użytkownika i hasło są wymagane!" });
        }
        const exists = await findByUserName(UserName);
        if (exists) return res.status(400).json({ message: "Użytkownik o tej nazwie już istnieje!" });

        await addUser({ UserName, UserPassword });
        res.json({ message: "Użytkownik dodany pomyślnie!" });
    } catch (err) { next(err); }
};

const loginCtrl = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await findByUserName(username);
        if (!user || password !== user.UserPassword) {
            return res.status(400).json({ message: "Nieprawidłowa nazwa użytkownika lub hasło!" });
        }
        res.json({
            message: "Zalogowano!",
            user: { id: user.Id, username: user.UserName, isAdmin: user.IsAdmin }
        });
    } catch (err) { next(err); }
};

module.exports = { registerCtrl, loginCtrl };