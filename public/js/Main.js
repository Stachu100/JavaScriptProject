const user = JSON.parse(localStorage.getItem("user"));

if (user && user.username) {
    const userInfoElement = document.getElementById("user-info");
    userInfoElement.textContent = `Zalogowany użytkownik: ${user.username}`;

    if (user.isAdmin) {
        const addBookLink = document.getElementById("add-book-link");
        addBookLink.style.display = "block";
    } else {
        const addBookLink = document.getElementById("add-book-link");
        addBookLink.style.display = "none";
    }

} else {
    const userInfoElement = document.getElementById("user-info");
    userInfoElement.textContent = "Brak danych użytkownika. Proszę się zalogować.";
}