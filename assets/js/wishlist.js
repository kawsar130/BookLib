import { isBookWishlisted, toggleWishlist } from "./helpers.js";
import { createWishlistIcon } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const wishlistContainer = document.getElementById("wishlist-container");
  const wishlistContainerWrapper = document.getElementById(
    "wishlist-container-wrapper"
  );

  // Function to retrieve and display wishlisted books
  async function displayWishlist() {
    const wishlistContainer = document.getElementById("wishlist-container");
    const wishlistedBooks = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Check if there are any wishlisted books
    if (wishlistedBooks.length === 0) {
      wishlistContainerWrapper.innerHTML =
        "<p class='error-message'>No books in your wishlist!</p>";
      return;
    }

    // Fetch book details from API using the stored IDs
    const books = await fetchBooksByIds(wishlistedBooks.join(","));

    // Loop through the fetched books
    books.forEach((book) => {
      const bookDiv = createBookElement(book);
      wishlistContainer.appendChild(bookDiv);
    });
  }

  // Function to create book element
  function createBookElement(book) {
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

    const bookContentContainer = document.createElement("div");
    bookContentContainer.classList.add("book-content-container");

    // Book title
    const title = document.createElement("h4");
    title.classList.add("book-title");
    title.innerText = book.title;
    title.setAttribute("title", book.title);
    bookContentContainer.appendChild(title);

    // Book authors
    const authors = document.createElement("p");
    authors.classList.add("book-authors");
    authors.innerText = `Authors: ${book.authors
      .map(
        (author) =>
          `${author.name.replace(",", " ").split(" ").reverse().join(" ")}`
      )
      .join("| ")}`;
    bookContentContainer.appendChild(authors);

    // Book topics
    const topics = document.createElement("p");
    topics.classList.add("book-topics");
    topics.innerText = `topics: ${book.subjects.join(", ")}`;
    bookContentContainer.appendChild(topics);

    // Book ID
    const bookId = document.createElement("p");
    bookId.classList.add("book-id");
    bookId.innerText = `Identification No. : ${book.id}`;
    bookContentContainer.appendChild(bookId);

    // Adding book contents to bookDiv
    bookDiv.appendChild(bookContentContainer);

    // Wishlist Icon
    const wishlistIconContainer = document.createElement("div");
    wishlistIconContainer.classList.add("wishlist-icon-container", "shadow");

    const isWishlisted = isBookWishlisted(book.id);
    const wishlistIcon = createWishlistIcon(isWishlisted);
    wishlistIcon.addEventListener("click", () => {
      const confirmRemoval = confirm(
        "Are you sure you want to remove this book from your wishlist?"
      );
      if (confirmRemoval) {
        removeFromWishlist(book.id);
        bookDivWrapper.remove(); // Remove the book element from the DOM
      }
    });

    wishlistIconContainer.appendChild(wishlistIcon);

    const bookDivWrapper = document.createElement("div");
    bookDivWrapper.classList.add("book-wrapper");

    bookDivWrapper.appendChild(wishlistIconContainer);

    const wrapperLink = document.createElement("a");
    wrapperLink.href = `/pages/book-details.html?id=${book.id}`;
    wrapperLink.appendChild(bookDiv);

    bookDivWrapper.appendChild(wrapperLink);

    return bookDivWrapper;
  }

  // Function to fetch book details by IDs
  async function fetchBooksByIds(ids) {
    try {
      loader.style.display = "flex"; // Show loader
      wishlistContainer.innerHTML = ""; // clear Wishlist Container when data is being loaded

      const response = await fetch(`https://gutendex.com/books/?ids=${ids}`);

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();

      console.log(data);
      return data.results || []; // Return books array or an empty array if not found
    } catch (error) {
      console.error("Error fetching books:", error);
      wishlistContainerWrapper.innerHTML =
        "<p class='error-message'>Failed to load wishlisted books. Please reload again!</p>";
    } finally {
      loader.style.display = "none";
    }
  }

  // Function to remove a book from wishlist
  function removeFromWishlist(bookId) {
    let wishlistedBooks = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlistedBooks = wishlistedBooks.filter((id) => id !== bookId);
    localStorage.setItem("wishlist", JSON.stringify(wishlistedBooks));

    if (wishlistedBooks.length === 0)
      wishlistContainerWrapper.innerHTML =
        "<p class='error-message'>No books in your wishlist!</p>";
  }

  // Call the display function on page load
  displayWishlist();
});
