document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const UserName = document.getElementById("username").value;
    const UserPassword = document.getElementById("password").value;

    const response = await fetch("Users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserName, UserPassword })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/Main.html";
    } else {
        alert(data.message);
    }
});