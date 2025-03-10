document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Przykładowe dane użytkownika
        const user = {
            username: "admin",
            password: "admin"
        };

        if (username === user.username && password === user.password) {
            alert("Zalogowano pomyślnie!");
            window.location.href = "/Main.html";
        } else {
            alert("Nieprawidłowy login lub hasło.");
        }
    });
});