document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const userName = document.getElementById("username").value;
    const userPassword = document.getElementById("password").value;

    const usernamePattern = /^[\p{L}\p{N}_]{3,30}$/u;

    if (!usernamePattern.test(userName)) {
        alert("Nazwa użytkownika może zawierać tylko litery, cyfry i znak podkreślenia, długość od 3 do 30 znaków.");
        return;
    }

    if (userPassword.length < 5 || userPassword.length > 100) {
        alert("Hasło musi mieć od 5 do 100 znaków.");
        return;
    }

    const formData = {
            UserName: userName,
            UserPassword: userPassword
    };

    try {
        const response = await fetch("users/login", {
            method: "POST",
            headers: {
                    "Content-Type": "application/json",
                },
            body: JSON.stringify(formData)
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