document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#bookForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const genre = document.getElementById("genre").value;
        const maxDays = document.getElementById("maxDays").value;
        const imageInput = document.getElementById("cover");
        const image = imageInput.files.length > 0 ? imageInput.files[0] : null;

        if (!author || !title || !genre || !maxDays) {
            alert("Podaj wszystkie wymagane dane!");
            return;
        }

        const pattern = /^[\p{L}\p{N}\s.'-]{2,50}$/u;

        if (!pattern.test(title)) {
            alert("Tytuł musi mieć 2–50 znaków i może zawierać litery, cyfry, spacje, kropki, myślniki i apostrofy.");
        return;
        }

        if (!pattern.test(author)) {
            alert("Autor musi mieć 2–50 znaków i może zawierać litery, cyfry, spacje, kropki, myślniki i apostrofy.");
        return;
        }

        const formData = new FormData();
        formData.append("Title", title);
        formData.append("Author", author);
        formData.append("Genre", genre);
        formData.append("MaxDays", maxDays);
        if (image) {
            formData.append("Image", image);
        }

        try {
            const response = await fetch("/books/addBook", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            alert(result.message);
            form.reset();
        } catch (error) {
            console.error("Błąd dodawania książki:", error);
        }
    });
});