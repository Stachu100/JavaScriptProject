document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const response = await fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ UserName: username, UserPassword: password })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            window.location.href = "/Main.html";
        } else {
            alert("Nieprawidłowy login lub hasło.");
        }
    });
});
