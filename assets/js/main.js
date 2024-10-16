document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  let nextUrl = null;
  let prevUrl = null;

  const bookContainer = document.getElementById("book-container");
  const paginationControls = document.getElementById("pagination-controls");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");

  const loader = document.getElementById("loader");

  async function fetchBooks(url = "https://gutendex.com/books/") {
    try {
      loader.style.display = "block"; // show Loader when data is being loaded
      paginationControls.style.visibility = "hidden"; // hide pagination controls when data is being loaded
      bookContainer.innerHTML = ""; // clear Book Container when data is being loaded

      const response = await fetch(url);
      const data = await response.json();

      // Display the books
      displayBooks(data.results);

      // Setup Pagination
      nextUrl = data.next;
      prevUrl = data.previous;
      updatePaginationControls();
    } catch (error) {
      console.error(error);
      bookContainer.innerHTML =
        "<p class='error-message'>Failed to load books. Please try again later!</p>";
    } finally {
      paginationControls.style.visibility = "visible"; // show pagination controls when data has been loaded
      loader.style.display = "none"; // hide loader when data has been loaded
    }
  }

  function displayBooks(books) {
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
      img.alt = book.title;
      img.classList.add("book-cover");
      imgContainer.appendChild(img);
      bookDiv.appendChild(imgContainer);

      // Book title
      const title = document.createElement("h4");
      title.classList.add("book-title");
      title.innerText = book.title;
      title.setAttribute("title", book.title);
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

  // Function to update pagination controls
  function updatePaginationControls() {
    console.log(prevUrl);

    prevPageBtn.disabled = !prevUrl;
    nextPageBtn.disabled = !nextUrl;
    pageInfo.textContent = `Page ${currentPage}`;
  }

  // Event listeners for pagination buttons
  prevPageBtn.addEventListener("click", () => {
    if (prevUrl) {
      currentPage--;
      fetchBooks(prevUrl);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if (nextUrl) {
      currentPage++;
      fetchBooks(nextUrl);
    }
  });

  // Fetch books when the page loads
  fetchBooks();
});
