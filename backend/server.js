const express = require("express");
const path = require("path");
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");
const borrowedBooksRoutes = require("./routes/borrowedBooks");
const historyBooksRoutes = require("./routes/historyBooks");

const app = express();
const PORT = 3000;

// Udostępnianie plików
app.use(express.static(path.join(__dirname, '..', 'public', 'bookcover')));
app.use(express.static(path.join(__dirname, '..', 'public', 'html')));
app.use(express.static(path.join(__dirname, '..', 'public', 'css')));
app.use(express.static(path.join(__dirname, '..', 'public', 'js')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Użycie tras
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/borrowedBooks", borrowedBooksRoutes);
app.use("/historyBooks", historyBooksRoutes);

// Globalna obsługa błędów
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Błąd serwera" });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});