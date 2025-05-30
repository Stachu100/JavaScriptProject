document.addEventListener("DOMContentLoaded", async function () {
    const historyContainer = document.querySelector(".history-container");
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.username) {
        try {
            let response;
            if (user.isAdmin) {
                response = await fetch("/historyBooks/getAllHistoryBooks");
            } else {
                response = await fetch(`/historyBooks/getUserHistoryBooks/${user.id}`);
            }

            const historyBooks = await response.json();

            if (historyBooks.length > 0) {
                historyBooks.forEach(book => {
                    const bookCard = document.createElement("div");
                    bookCard.classList.add("book-card");

                    const bookDetails = document.createElement("div");
                    bookDetails.classList.add("book-details");

                    const bookTitle = document.createElement("p");
                    bookTitle.textContent = `Tytuł: ${book.Title}`;

                    const bookAuthor = document.createElement("p");
                    bookAuthor.textContent = `Autor: ${book.Author}`;

                    const borrowedDate = new Date(book.BorrowedDate);
                    const returnedDate = book.ReturnedDate ? new Date(book.ReturnedDate) : null;

                    if (user.isAdmin && book.UserName) {
                    const userNameElement = document.createElement("p");
                    userNameElement.textContent = `Użytkownik: ${book.UserName}`;
                    bookDetails.appendChild(userNameElement);
                    }
                    
                    const borrowedDateElement = document.createElement("p");
                    borrowedDateElement.textContent = `Data wypożyczenia: ${borrowedDate.toLocaleDateString()}`;

                    const returnedDateElement = document.createElement("p");
                    returnedDateElement.textContent = returnedDate
                        ? `Data zwrotu: ${returnedDate.toLocaleDateString()}`
                        : "Książka jeszcze nie została zwrócona";

                    bookDetails.appendChild(bookTitle);
                    bookDetails.appendChild(bookAuthor);
                    bookDetails.appendChild(borrowedDateElement);
                    bookDetails.appendChild(returnedDateElement);

                    bookCard.appendChild(bookDetails);
                    historyContainer.appendChild(bookCard);
                });
            } else {
                const noHistoryMessage = document.createElement("p");
                noHistoryMessage.textContent = "Brak historii wypożyczeń.";
                historyContainer.appendChild(noHistoryMessage);
            }
        } catch (error) {
            console.error("Błąd przy pobieraniu historii wypożyczonych książek:", error);
        }
    }
});
