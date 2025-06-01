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
        }
    });
});