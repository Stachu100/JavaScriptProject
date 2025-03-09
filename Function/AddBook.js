document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const Author = document.getElementById("author").value;
        const Title = document.getElementById("title").value;
        const ImageInput = document.getElementById("cover");
        const Image = ImageInput.files.length > 0 ? ImageInput.files[0] : null;

        if (!Author || !Title) {
            alert("Podaj autora i tytuł książki!");
            return;
        }

        const formData = new FormData();
        formData.append("Author", Author);
        formData.append("Title", Title);
        if (Image) {
            formData.append("Image", Image);
        }

        try {
            const response = await fetch("books/addBook", {
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