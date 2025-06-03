document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const login = document.getElementById("login").value;
        const password = document.getElementById("password").value;

        if (!login || !password) {
            alert("Podaj dane!");
            return;
        }

        const usernamePattern = /^[\p{L}\p{N}_]{3,30}$/u;
        if (!usernamePattern.test(login)) {
            alert("Nazwa użytkownika może zawierać tylko litery, cyfry i znak podkreślenia, długość od 3 do 30 znaków.");
            return;
        }

        if (password.length < 5 || password.length > 100) {
            alert("Hasło musi mieć od 5 do 100 znaków.");
            return;
        }

        const formData = {
            UserName: login,
            UserPassword: password
        };

        try {
            const response = await fetch("/users/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            alert(result.message);
            form.reset();
        } catch (error) {
            console.error("Błąd dodawania Użytkownika:", error);
            alert("Wystąpił błąd podczas rejestracji.");
        }
    });
});