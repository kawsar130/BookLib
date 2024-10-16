const bookContainer = document.getElementById("book-container");
const loader = document.getElementById("loader");

async function fetchBooks() {
  // Show loader
  loader.style.display = "block";

  try {
    const response = await fetch("https://gutendex.com/books/");
    const data = await response.json();

    // Display the books
    displayBooks(data.results);
  } catch (error) {
    console.error(error);
    bookContainer.innerHTML =
      "<p>Failed to load books. Please try again later!</p>";
  } finally {
    // Hide loader
    loader.style.display = "none";
  }
}

function displayBooks(books) {
  // Clear the container
  bookContainer.innerHTML = "";

  // Loop through each book and create elements
  books.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book", "shadow");

    // Book Cover Image container
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("book-cover-container");

    // Book cover image
    const img = document.createElement("img");
    img.src =
      book.formats["image/jpeg"] || "/assets/images/book-thumbnail.webp"; // Use a default image if none available
    img.classList.add("book-cover");
    imgContainer.appendChild(img);
    bookDiv.appendChild(imgContainer);

    // Book title
    const title = document.createElement("h4");
    title.classList.add("book-title");
    title.innerText = book.title;
    bookDiv.appendChild(title);

    // Book authors
    const authors = document.createElement("p");
    authors.classList.add("book-authors");
    authors.innerText = `Authors: ${book.authors
      .map((author) => author.name)
      .join(", ")}`;
    bookDiv.appendChild(authors);

    // Book subjects
    const subjects = document.createElement("p");
    subjects.classList.add("book-subjects");
    subjects.innerText = `Subjects: ${book.subjects.join(", ")}`;
    bookDiv.appendChild(subjects);

    // Append to the book container
    bookContainer.appendChild(bookDiv);
  });
}

// Fetch books when the page loads
fetchBooks();
