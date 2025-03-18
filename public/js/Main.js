document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfoElement = document.getElementById("user-info");
    const addBookLink = document.getElementById("add-book-link");
    const logoutLink = document.getElementById("logout-link");

    if (user && user.username) {
        userInfoElement.textContent = `Zalogowany użytkownik: ${user.username}`;

        if (user.isAdmin) {
            addBookLink.style.display = "inline";
        } else {
            addBookLink.style.display = "none";
        }
    } 

    logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("user");
        window.location.href = "/Index.html";
    });
});
