document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfoElement = document.getElementById("user-info");
    const addBookLink = document.getElementById("add-book-link");
    const logoutLink = document.getElementById("logout-link");
    const borrowedBooksContainer = document.querySelector(".borrowed-books-container");

    if (user && user.username) {
        userInfoElement.textContent = `Zalogowany użytkownik: ${user.username}`;

        if (user.isAdmin) {
            addBookLink.style.display = "inline";
        } else {
            addBookLink.style.display = "none";
        }

        try {
            const response = await fetch(`/borrowedBooks/getUserBorrowedBooks/${user.id}`);
            const borrowedBooks = await response.json();

            if (borrowedBooks.length > 0) {
                borrowedBooks.forEach(book => {
                    const bookCard = document.createElement("div");
                    bookCard.classList.add("book-card");

                    const bookImage = document.createElement("img");
                    bookImage.src = book.Image ? book.Image : "brak_okladki.png";
                    bookImage.alt = book.Title;
                    bookImage.classList.add("book-image");

                    const bookDetails = document.createElement("div");
                    bookDetails.classList.add("book-details");

                    const bookTitle = document.createElement("p");
                    bookTitle.classList.add("book-title");
                    bookTitle.textContent = book.Title;

                    const bookAuthor = document.createElement("p");
                    bookAuthor.classList.add("book-author");
                    bookAuthor.textContent = book.Author;

                    const returnDate = new Date(book.ReturnDate);
                    const currentDate = new Date();
                    const diffTime = returnDate - currentDate;
                    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    const daysRemainingElement = document.createElement("p");
                    daysRemainingElement.classList.add("days-remaining");

                    if (daysRemaining < 0) {
                        daysRemainingElement.textContent = "Minął termin zwrotu książki.";
                    } else {
                        daysRemainingElement.textContent = `Pozostało dni do zwrotu: ${daysRemaining}`;
                    }

                    bookDetails.appendChild(bookTitle);
                    bookDetails.appendChild(bookAuthor);
                    bookDetails.appendChild(daysRemainingElement);
                    bookCard.appendChild(bookImage);
                    bookCard.appendChild(bookDetails);
                    borrowedBooksContainer.appendChild(bookCard);
                });
            } else {
                const noBooksMessage = document.createElement("p");
                noBooksMessage.textContent = "Brak wypożyczonych książek.";
                borrowedBooksContainer.appendChild(noBooksMessage);
            }
        } catch (error) {
            console.error("Błąd przy pobieraniu wypożyczonych książek:", error);
        }
    }

    logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("user");
        window.location.href = "/Index.html";
    });

    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            location.reload();
        }
    });
});