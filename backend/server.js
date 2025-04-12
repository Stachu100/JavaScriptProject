const express = require("express");
const path = require("path");
const bookRoutes = require("./routes/books");
const UserRoutes = require("./routes/users");
const borrowedBooksRoutes = require("./routes/borrowedBooks");

const app = express();
const PORT = 3000;

// Udostępnianie plików
app.use(express.static(path.join(__dirname, '..', 'public', 'bookcover')));
app.use(express.static(path.join(__dirname, '..', 'public', 'html')));
app.use(express.static(path.join(__dirname, '..', 'public', 'css')));
app.use(express.static(path.join(__dirname, '..', 'public', 'js')));
app.use(express.urlencoded({ extended: true }));

// Użycie tras
app.use("/books", bookRoutes);
app.use("/users", UserRoutes);
app.use("/borrowedBooks", borrowedBooksRoutes);


// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});