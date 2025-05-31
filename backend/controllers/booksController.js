const path = require("path");
const fs   = require("fs");
const { addBook, getAllAvailable, deleteBook, getById, updateBook } = require("../models/booksModel");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/bookcover/"),
    filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const addBookCtrl = [
    upload.single("Image"),
    async (req, res, next) => {
        try {
            const { Title, Author, Genre, MaxDays } = req.body;
            if (!Title || !Author || !Genre || !MaxDays) {
                return res.status(400).json({ message: "Brak wymaganych danych!" });
            }
            await addBook({
                Title,
                Author,
                Genre,
                MaxDays,
                Image: req.file ? req.file.filename : null,
            });
            res.json({ message: "Książka została dodana!" });
        } catch (err) { next(err); }
    },
];

const getBooksCtrl = async (req, res, next) => {
    try {
        const books = await getAllAvailable();
        res.json(books);
    } catch (err) { next(err); }
};

const deleteBookCtrl = async (req, res, next) => {
    try {
        await deleteBook(req.params.id);
        res.json({ message: "Książka została usunięta." });
    } catch (err) { next(err); }
};

const editBookCtrl = [
    upload.single("Image"),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { Title, Author, Genre, MaxDays } = req.body;
            if (!Title || !Author || !Genre || !MaxDays) {
                return res.status(400).json({ message: "Brak wymaganych danych!" });
            }

            const existing = await getById(id);
            if (!existing) return res.status(404).json({ message: "Książka nie istnieje." });

            if (req.file && existing.Image) {
                const oldPath = path.join(__dirname, "..", "..", "public", "bookcover", existing.Image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            let sql = "UPDATE Books SET Title = ?, Author = ?, Genre = ?, MaxDays = ?";
            let params = [Title, Author, Genre, MaxDays];
            if (req.file) { sql += ", Image = ?"; params.push(req.file.filename); }
            sql += " WHERE Id = ?"; params.push(id);

            await updateBook(sql, params);
            res.json({ message: "Książka została zaktualizowana." });
        } catch (err) { next(err); }
    },
];

module.exports = { addBookCtrl, getBooksCtrl, deleteBookCtrl, editBookCtrl };