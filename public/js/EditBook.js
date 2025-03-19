document.addEventListener("DOMContentLoaded", function () {
    const editBook = JSON.parse(localStorage.getItem("editBook"));

    if (editBook) {
        document.getElementById("author").value = editBook.Author;
        document.getElementById("title").value = editBook.Title;
        document.getElementById("genre").value = editBook.Genre;
        document.getElementById("maxDays").value = editBook.MaxDays;
    }

    const form = document.getElementById("bookForm");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const genre = document.getElementById("genre").value;
        const maxDays = document.getElementById("maxDays").value;
        const imageFile = document.getElementById("cover").files[0];

        if (!title || !author || !genre || !maxDays) {
            alert("Wszystkie pola są wymagane!");
            return;
        }

        try {
            let response;
            if (editBook) {
                const formData = new FormData();
                formData.append("Title", title);
                formData.append("Author", author);
                formData.append("Genre", genre);
                formData.append("MaxDays", maxDays);

                if (imageFile) {
                    formData.append("Image", imageFile);
                }

                response = await fetch(`/books/editBooks/${editBook.Id}`, {
                    method: "PUT",
                    body: formData
                });

                localStorage.removeItem("editBook");
            }

            const result = await response.json();

            if (response.ok) {
                alert("Książka została zaktualizowana!");
                window.location.href = "/BorrowBook.html";
            } else {
                alert(`Błąd: ${result.message}`);
            }
        } catch (error) {
            console.error("Błąd przy edytowaniu książki:", error);
            alert("Wystąpił błąd podczas edytowania książki.");
        }
    });
});