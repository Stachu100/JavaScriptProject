document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/getBooks");
        const books = await response.json();

        const booksContainer = document.querySelector(".books-carousel");

        books.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");

            const bookImage = document.createElement("img");
            bookImage.src = book.Image; // Poprawiamy ścieżkę do obrazu
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

            const borrowBtn = document.createElement("button");
            borrowBtn.classList.add("borrow-btn");
            borrowBtn.textContent = "Wypożycz";

            bookDetails.appendChild(bookTitle);
            bookDetails.appendChild(bookAuthor);
            bookCard.appendChild(bookImage);
            bookCard.appendChild(bookDetails);
            bookCard.appendChild(borrowBtn);

            booksContainer.appendChild(bookCard);
        });
    } catch (error) {
        console.error("Błąd podczas ładowania książek:", error);
    }
});