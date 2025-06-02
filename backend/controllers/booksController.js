const path = require("path");
const fs = require("fs").promises;
const multer  = require("multer");
const { addBook, getAllAvailable, deleteBook, getById, editBook } = require("../models/booksModel");

const storage = multer.memoryStorage();
const upload = multer({ storage });
const bookPattern = /^[\p{L}\s.'-]{2,50}$/u;

const addBookCtrl = [
    upload.single("Image"),
    async (req, res, next) => {
        try {
            const { Title, Author, Genre, MaxDays } = req.body;
            
            if (!Author || !bookPattern.test(Author)) {
              return res.status(400).json({ message: "Niepoprawny autor (2-50 znaków, litery i '.-)" });
            }
            if (!Title || !bookPattern.test(Title)) {
              return res.status(400).json({ message: "Tytuł musi mieć (2-50 znaków, litery i '.-)" });
            }
            const genres = ["Fantastyka", "Science Fiction", "Kryminał", "Horror", "Romans", "Przygodowa", "Biografia", "Podrecznik", "Inne"];
            if (!Genre || !genres.includes(Genre)) {
              return res.status(400).json({ message: "Nieprawidłowy gatunek" });
            }
            if (!MaxDays || isNaN(MaxDays) || Number(MaxDays) <= 0) {
              return res.status(400).json({ message: "Maksymalna liczba dni musi być liczbą większą od 0" });
            }
            
            let imageFileName = null;

            if (req.file) {
                imageFileName = Date.now() + path.extname(req.file.originalname);
            }

            await addBook({
                Title,
                Author,
                Genre,
                MaxDays,
                Image: imageFileName,
            });

            if (req.file) {
                const fullPath = path.join(__dirname, "..", "..", "public", "bookcover", imageFileName);
                await fs.writeFile(fullPath, req.file.buffer);
            }
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
        const book = await getById(req.params.id);
        if (!book) return res.status(404).json({ message: "Książka nie istnieje." });

        if (book.Image) {
            const imagePath = path.join(__dirname, "..", "..", "public", "bookcover", book.Image);
            try {
                await fs.access(imagePath);
                await fs.unlink(imagePath);
            } catch {}
        }

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

      if (!Author || bookPattern.test(Author)) {
        return res.status(400).json({ message: "Niepoprawny autor (2-50 znaków, litery i '.-)" });
      }
      if (!Title || bookPattern.test(Title)) {
        return res.status(400).json({ message: "Tytuł musi mieć (2-50 znaków, litery i '.-)" });
      }
      const genres = ["Fantastyka", "Science Fiction", "Kryminał", "Horror", "Romans", "Przygodowa", "Biografia", "Podrecznik", "Inne"];
      if (!Genre || !genres.includes(Genre)) {
        return res.status(400).json({ message: "Nieprawidłowy gatunek" });
      }
      if (!MaxDays || isNaN(MaxDays) || Number(MaxDays) <= 0) {
        return res.status(400).json({ message: "Maksymalna liczba dni musi być liczbą większą od 0" });
      }

      const existing = await getById(id);
      if (!existing) {
        return res.status(404).json({ message: "Książka nie istnieje." });
      }

      let imageFileName = existing.Image;

      if (req.file) {
        if (existing.Image) {
          const imagePath = path.join(__dirname, "..", "..", "public", "bookcover", existing.Image);
          try {
            await fs.access(imagePath);
            await fs.unlink(imagePath);
          } catch { }
        }

        imageFileName = Date.now() + path.extname(req.file.originalname);
        const newPath = path.join(__dirname, "..", "..", "public", "bookcover", imageFileName);
        await fs.writeFile(newPath, req.file.buffer);
      }

      await editBook(id, {
        Title,
        Author,
        Genre,
        MaxDays,
        Image: imageFileName,
      });

      res.json({ message: "Książka została zaktualizowana." });
    } catch (err) { next(err); }
  }
];

module.exports = { addBookCtrl, getBooksCtrl, deleteBookCtrl, editBookCtrl };