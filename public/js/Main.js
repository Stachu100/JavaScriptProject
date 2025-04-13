document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfoElement = document.getElementById("user-info");
    const addBookLink = document.getElementById("add-book-link");
    const logoutLink = document.getElementById("logout-link");
    const borrowedBooksContainer = document.querySelector(".borrowed-books-container");
    const adminSection = document.getElementById("admin-section");
    const fetchCurrentBtn = document.getElementById("fetchCurrentBtn");
    const userIdInput = document.getElementById("userIdInput");
    const userBorrowBooks = document.querySelector(".user-borrow");

    if (user && user.username) {
        userInfoElement.textContent = `Zalogowany użytkownik: ${user.username}`;

        if (user.isAdmin) {
            addBookLink.style.display = "inline";
            adminSection.style.display = "block"; 
        } else {
            addBookLink.style.display = "none";
            adminSection.style.display = "none";
        }

        fetchBorrowedBooks(user.id); 
    }

    async function fetchBorrowedBooks(userId) {
        try {
            const response = await fetch(`/borrowedBooks/getUserBorrowedBooks/${userId}`);
            const borrowedBooks = await response.json();

            borrowedBooksContainer.innerHTML = "";

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
                borrowedBooksContainer.innerHTML = "<p>Brak wypożyczonych książek.</p>";
            }
        } catch (error) {
            borrowedBooksContainer.innerHTML = "<p>Błąd podczas pobierania danych.</p>";
        }
    }

    async function fetchUserBorrow(userName) {
        userBorrowBooks.innerHTML = "<p>Ładowanie danych...</p>";
    
        try {
            const response = await fetch(`/borrowedBooks/getUserBorrowedUserBooks/${userName}`);
            const currentBorrowed = await response.json();
    
            userBorrowBooks.innerHTML = "";
    
            if (currentBorrowed.length > 0) {
                currentBorrowed.forEach(book => {
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
    
                    const returnBtn = document.createElement("button");
                    returnBtn.classList.add("return-btn");
                    returnBtn.textContent = "Oddaj książkę";
    
                    returnBtn.addEventListener("click", async function () {
                        if (confirm(`Czy na pewno chcesz oddać książkę: ${book.Title}?`)) {
                            try {
                                const response = await fetch("/borrowedBooks/return", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        userId: user.id,
                                        bookId: book.Id
                                    })
                                });
    
                                const data = await response.json();
    
                                if (response.ok) {
                                    alert(`Książka '${book.Title}' została oddana!`);
                                    fetchUserBorrow(userName);
                                } else {
                                    alert(`Błąd: ${data.message}`);
                                }
                            } catch (error) {
                                alert("Wystąpił błąd podczas oddawania książki.");
                            }
                        }
                    });
    
                    bookDetails.appendChild(bookTitle);
                    bookDetails.appendChild(bookAuthor);
                    bookDetails.appendChild(returnBtn);
                    bookCard.appendChild(bookImage);
                    bookCard.appendChild(bookDetails);
                    userBorrowBooks.appendChild(bookCard);
                });
            } else {
                userBorrowBooks.innerHTML = "<p>Brak aktualnie wypożyczonych.</p>";
            }
        } catch (error) {
            userBorrowBooks.innerHTML = "<p>Błąd podczas pobierania danych.</p>";
        }
    }
    

    fetchCurrentBtn.addEventListener("click", function () {
        const userName = userIdInput.value.trim();
        if (!userName) {
            alert("Podaj ID użytkownika!");
            return;
        }
        fetchUserBorrow(userName);
    });

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