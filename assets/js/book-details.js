// Function to get query parameter value by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to fetch and display book details
async function displayBookDetails() {
  const bookId = getQueryParam("id");
  if (!bookId) {
    document.getElementById("book-title").innerText = "Book not found.";
    return;
  }

  try {
    const response = await fetch(`https://gutendex.com/books/${bookId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch book details.");
    }

    const book = await response.json();
    updateBookDetailsUI(book);
  } catch (error) {
    console.error("Error fetching book details:", error);
    document.getElementById("book-title").innerText = "Book not found.";
  }
}

// Function to update the UI with book details
function updateBookDetailsUI(book) {
  document.getElementById("book-title").innerText = book.title;
  const bookCover = document.getElementById("book-cover");
  bookCover.src =
    book.formats["image/jpeg"] || "/assets/images/book-thumbnail.webp";
  bookCover.alt = book.title;

  const bookAuthors = document.getElementById("book-authors");
  bookAuthors.innerText = `Authors: ${book.authors
    .map(
      (author) =>
        `${author.name.replace(",", " ").split(" ").reverse().join(" ")} (${
          author.birth_year
        } - ${author.death_year})`
    )
    .join(" | ")}`;

  const bookTopics = document.getElementById("book-topics");
  bookTopics.innerText = `Topics: ${book.subjects.join(", ")}`;

  const bookDownloadCount = document.getElementById("book-download-count");
  bookDownloadCount.innerText = `Download Count: ${book.download_count}`;

  const bookMediaType = document.getElementById("book-media-type");
  bookMediaType.innerText = `Media Type: ${book.media_type}`;

  const bookCopyright = document.getElementById("book-copyright");
  bookCopyright.innerText = `Copyright: ${book.copyright}`;
}

// Call the function on page load
displayBookDetails();
