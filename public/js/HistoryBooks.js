document.addEventListener("DOMContentLoaded", async function () {
    const historyContainer = document.querySelector(".history-container");

    if (user && user.username) {
        try {
            const response = await fetch(`/historyBooks/getUserHistoryBooks/${user.id}`);
            const historyBooks = await response.json();

            if (historyBooks.length > 0) {
                historyBooks.forEach(book => {
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

                    const borrowedDate = new Date(book.BorrowedDate);
                    const returnedDate = book.ReturnedDate ? new Date(book.ReturnedDate) : null;

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
                    bookCard.appendChild(bookImage);
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
