document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/books/getBooks");
        const books = await response.json();

        const booksContainer = document.querySelector(".books-carousel");

        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!user) {
            alert("Musisz być zalogowany, aby wypożyczyć książkę!");
            return;
        }

        books.forEach(book => {
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

            const borrowBtn = document.createElement("button");
            borrowBtn.classList.add("borrow-btn");
            borrowBtn.textContent = "Wypożycz";

            borrowBtn.addEventListener("click", async function () {
                const userId = user.id;
                const bookId = book.Id;
                const borrowDate = new Date().toISOString();
                const returnDate = new Date();
                returnDate.setDate(returnDate.getDate() + 14);
                const returnDateStr = returnDate.toISOString();

                try {
                    const response = await fetch("/borrowedBooks/borrow", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            userId: userId,
                            bookId: bookId,
                            borrowedDate: borrowDate,
                            returnDate: returnDateStr
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert(`Książka '${book.Title}' została wypożyczona!`);
                    } else {
                        alert(`Błąd: ${data.message}`);
                    }
                } catch (error) {
                    console.error("Błąd przy wypożyczaniu książki:", error);
                    alert("Wystąpił błąd podczas wypożyczania książki.");
                }
            });

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