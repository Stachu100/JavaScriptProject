document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/books/getBooks");
        const books = await response.json();

        const booksContainer = document.getElementById("books-list");
        const user = JSON.parse(localStorage.getItem("user"));

        function renderBooks(filteredBooks) {
            booksContainer.innerHTML = "";
            filteredBooks.forEach(book => {
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

                const maxDaysInfo = document.createElement("p");
                maxDaysInfo.classList.add("max-days-info");
                const dayText = book.MaxDays === 1 ? "dzień" : "dni";
                maxDaysInfo.textContent = `Czas wypożyczenia: ${book.MaxDays} ${dayText}`;

                const borrowBtn = document.createElement("button");
                borrowBtn.classList.add("borrow-btn");
                borrowBtn.textContent = "Wypożycz";

                borrowBtn.addEventListener("click", async function () {
                    const borrowDate = new Date().toISOString();
                    const returnDate = new Date();
                    returnDate.setDate(returnDate.getDate() + book.MaxDays);
                    const returnDateStr = returnDate.toISOString();

                    try {
                        const response = await fetch("/borrowedBooks/borrow", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                userId: user.id,
                                bookId: book.Id,
                                borrowedDate: borrowDate,
                                returnDate: returnDateStr
                            })
                        });

                        const data = await response.json();

                        if (response.ok) {
                            alert(`Książka '${book.Title}' została wypożyczona!`);
                            location.reload();
                        } else {
                            alert(`Błąd: ${data.message}`);
                        }
                    } catch (error) {
                        alert("Wystąpił błąd podczas wypożyczania książki.");
                    }
                });

                if (user.isAdmin) {
                    const deleteBtn = document.createElement("button");
                    deleteBtn.classList.add("delete-btn");
                    deleteBtn.textContent = "Usuń";
                    deleteBtn.addEventListener("click", async function () {
                        if (confirm(`Czy na pewno chcesz usunąć książkę: ${book.Title}?`)) {
                            try {
                                const response = await fetch(`/books/deleteBooks/${book.Id}`, {
                                    method: "DELETE"
                                });

                                const data = await response.json();

                                if (response.ok) {
                                    alert(`Książka '${book.Title}' została usunięta!`);
                                    location.reload();
                                } else {
                                    alert(`Błąd: ${data.message}`);
                                }
                            } catch (error) {
                                alert("Wystąpił błąd podczas usuwania książki.");
                            }
                        }
                    });

                    const editBtn = document.createElement("button");
                    editBtn.classList.add("edit-btn");
                    editBtn.textContent = "Edytuj";
                    editBtn.addEventListener("click", function () {
                        localStorage.setItem("editBook", JSON.stringify(book));
                        window.location.replace("/edit-book.html");
                    });

                    bookCard.appendChild(deleteBtn);
                    bookCard.appendChild(editBtn);
                }

                bookDetails.appendChild(bookTitle);
                bookDetails.appendChild(bookAuthor);
                bookCard.appendChild(bookImage);
                bookCard.appendChild(bookDetails);
                bookDetails.appendChild(maxDaysInfo);
                bookCard.appendChild(borrowBtn);

                booksContainer.appendChild(bookCard);
            });
        }

        genreFilter.addEventListener("change", function () {
            const selectedGenre = genreFilter.value;
            const filteredBooks = selectedGenre === "all" ? books : books.filter(book => book.Genre === selectedGenre);
            renderBooks(filteredBooks);
        });

        renderBooks(books);
    } catch (error) {
        console.error("Błąd podczas ładowania książek:", error);
    }
});