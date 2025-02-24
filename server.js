const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serwowanie plików statycznych (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "WebPage")));
app.use(express.static(path.join(__dirname, "Styles")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "WebPage", "DashBoard.html"));
  });

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});