
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const limitInput = document.getElementById("limitInput");
const booksContainer = document.getElementById("booksContainer");
const statusMessage = document.getElementById("statusMessage");

async function searchBooks() {
    const searchValue = searchInput.value.trim();
    const limit = Number(limitInput.value);

    if (searchValue === "") {
        statusMessage.textContent = "Please enter a book name";
        booksContainer.innerHTML = "";
        return;
    }

    statusMessage.textContent = "Loading books...";
    booksContainer.innerHTML = "";

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchValue)}&limit=${limit}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        if (!data.docs || data.docs.length === 0) {
            statusMessage.textContent = "No books found";
            return;
        }

        statusMessage.textContent = `${data.docs.length} books found`;

        data.docs.forEach((book) => {
            const title = book.title || "No Title";

            const authors = book.author_name
                ? book.author_name.join(", ")
                : "Unknown Author";

            const image = book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "https://placehold.co/150x220?text=No+Image";

            const bookCard = document.createElement("div");

            bookCard.className =
                "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

            bookCard.innerHTML = `
                <div class="book-card">
                    <img src="${image}" alt="Book Cover">
                    <h5>${title}</h5>
                    <p>Author: ${authors}</p>
                </div>
            `;

            booksContainer.appendChild(bookCard);
        });

    } catch (error) {
        statusMessage.textContent =
            "Something went wrong. Please try again.";
        console.log(error);
    }
}

searchButton.addEventListener("click", searchBooks);

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBooks();
    }
});

limitInput.addEventListener("change", () => {
    if (searchInput.value.trim() !== "") {
        searchBooks();
    }
});
