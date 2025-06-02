document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const UserName = document.getElementById("username").value;
    const UserPassword = document.getElementById("password").value;

    const usernamePattern = /^[\p{L}\p{N}_]{3,30}$/u;

    if (!usernamePattern.test(UserName)) {
        alert("Nazwa użytkownika może zawierać tylko litery, cyfry i znak podkreślenia, długość od 3 do 30 znaków.");
        return;
    }

    if (UserPassword.length < 5 || UserPassword.length > 100) {
        alert("Hasło musi mieć od 5 do 100 znaków.");
        return;
    }

    try {
        const response = await fetch("users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ UserName, UserPassword })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "/main.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Wystąpił błąd podczas logowania. Spróbuj ponownie.");
        console.error(error);
    }
});