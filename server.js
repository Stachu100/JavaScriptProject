const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Udostępniamy pliki statyczne z folderów WebPage, CSS i Function
app.use(express.static(path.join(__dirname, "WebPage")));
app.use(express.static(path.join(__dirname, "CSS")));
app.use(express.static(path.join(__dirname, "Function")));

app.use(express.urlencoded({ extended: true }));

// Przekierowanie domyślne na stronę logowania
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "WebPage", "index.html"));
});

// Obsługa logowania (przykładowy użytkownik)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin") {
        res.redirect("/Main.html"); // Przekierowanie na stronę główną
    } else {
        res.send("Błędny login lub hasło. <a href='/'>Spróbuj ponownie</a>");
    }
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
