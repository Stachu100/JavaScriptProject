document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const Login = document.getElementById("login").value;
        const Password = document.getElementById("password").value;

        if (!Login || !Password) {
            alert("Podaj dane!");
            return;
        }

        const usernamePattern = /^[\p{L}\p{N}_]{3,30}$/u;
        if (!usernamePattern.test(Login)) {
            alert("Nazwa użytkownika może zawierać tylko litery, cyfry i znak podkreślenia, długość od 3 do 30 znaków.");
            return;
        }

        if (Password.length < 5 || Password.length > 100) {
            alert("Hasło musi mieć od 5 do 100 znaków.");
            return;
        }

        const formData = {
            UserName: Login,
            UserPassword: Password
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