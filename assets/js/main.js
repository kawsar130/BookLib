import {
  isBookWishlisted,
  removeElementsByClass,
  toggleWishlist,
} from "./helpers.js";
import { createWishlistIcon } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  let nextUrl = null;
  let prevUrl = null;
  let searchQuery = localStorage.getItem("searchQuery") || "";
  let selectedTopic = localStorage.getItem("selectedTopic") || "";
  let currentFetchController = null; // Variable to store the current AbortController

  const bookContainer = document.getElementById("book-container");
  const bookContainerWrapper = document.getElementById(
    "book-container-wrapper"
  );

  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");
  const searchBar = document.getElementById("search-bar");
  const topicFilter = document.getElementById("topic-filter");

  const loader = document.getElementById("loader");

  // Set initial values from localStorage (if any)
  searchBar.value = searchQuery;
  topicFilter.value = selectedTopic;

  async function fetchBooks(url = "https://gutendex.com/books/") {
    const currentController = new AbortController(); // Local reference to the current controller
    const { signal } = currentController;

    // Abort any ongoing request if a new one is initiated
    if (currentFetchController) {
      currentFetchController.abort();
      console.log("Previous fetch aborted");
    }

    // Set the global controller to the current one
    currentFetchController = currentController;

    try {
      initializeLoadingState();
      bookContainer.innerHTML = ""; // clear Book Container when data is being loaded
      removeElementsByClass("error-message"); // clear error message before data loading

      const response = await fetch(url, { signal });

      // Check if response is OK
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      const data = await response.json();

      // Display the books
      displayBooks(data.results);

      // Setup Pagination
      nextUrl = data.next;
      prevUrl = data.previous;
    } catch (error) {
      if (error.name === "AbortError") {
        // Request was aborted
        console.log("Previous request was aborted.");
      } else {
        console.error(error);
        bookContainerWrapper.innerHTML =
          "<p class='error-message'>Failed to load books. Please try again later!</p>";
      }
    } finally {
      if (currentFetchController === currentController && !signal.aborted) {
        updatePaginationControls();
        loader.style.display = "none";
        console.log("Fetching books Finished");
        // TODO: Fix the loading state not showing when aborting current fetch controller
      }
    }
  }

  function displayBooks(books) {
    // Loop through each book and create elements
    if (books.length) {
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
              `${author.name.replace(",", " ").split(" ").reverse().join(" ")}` // Removing comma from the author name and reversing the word order
          )
          .join("| ")}`;
        bookContentContainer.appendChild(authors);

        // Book topics
        const topics = document.createElement("p");
        topics.classList.add("book-topics");
        topics.innerText = `Topics: ${book.subjects.join(" | ")}`;
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
        wishlistIconContainer.classList.add(
          "wishlist-icon-container",
          "shadow"
        );

        const isWishlisted = isBookWishlisted(book.id);
        const wishlistIcon = createWishlistIcon(isWishlisted);
        wishlistIcon.addEventListener("click", () => {
          toggleWishlist(book.id);
          const isWishlisted = isBookWishlisted(book.id);
          wishlistIcon.setAttribute("fill", isWishlisted ? "#e74c3c" : "none");
        });

        wishlistIconContainer.appendChild(wishlistIcon);

        const bookDivWrapper = document.createElement("div");
        bookDivWrapper.classList.add("book-wrapper");

        bookDivWrapper.appendChild(wishlistIconContainer);

        const wrapperLink = document.createElement("a");
        wrapperLink.href = `/pages/book-details.html?id=${book.id}`;
        wrapperLink.appendChild(bookDiv);

        bookDivWrapper.appendChild(wrapperLink);

        // Append to the book container
        bookContainer.appendChild(bookDivWrapper);
      });
    } else {
      const noBookFoundMessage = document.createElement("p");
      noBookFoundMessage.classList.add("error-message");
      noBookFoundMessage.innerText =
        "No books found matching the given criteria.";
      bookContainerWrapper.appendChild(noBookFoundMessage);
    }
  }

  function initializeLoadingState() {
    loader.style.display = "flex"; // Show loader
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
  }

  // Function to update pagination controls
  function updatePaginationControls() {
    prevPageBtn.disabled = !prevUrl;
    nextPageBtn.disabled = !nextUrl;
    pageInfo.textContent = `Page ${currentPage}`;
  }

  // Debounce Function to limit how often the search function runs
  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Event listener for search input
  searchBar.addEventListener(
    "input",
    debounce((event) => {
      searchQuery = event.target.value.trim();
      currentPage = 1; // Reset to first page when new search is performed

      // Save search query to localStorage
      localStorage.setItem("searchQuery", searchQuery);

      updateBookList();
    }, 500) // 300ms delay for debouncing
  );

  // Event listener for topic filter
  topicFilter.addEventListener("change", (event) => {
    selectedTopic = event.target.value;
    currentPage = 1; // Reset to first page when a new topic is selected

    // Save selected topic to localStorage
    localStorage.setItem("selectedTopic", selectedTopic);

    updateBookList();
  });

  // Update book list based on search and topic filters
  function updateBookList() {
    let url = "https://gutendex.com/books/";

    // Apply search query if exists
    if (searchQuery) {
      url += `?search=${encodeURIComponent(searchQuery)}`;
    }

    // Apply topic filter if exists
    if (selectedTopic) {
      url += searchQuery
        ? `&topic=${encodeURIComponent(selectedTopic)}`
        : `?topic=${encodeURIComponent(selectedTopic)}`;
    }

    fetchBooks(url);
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

  updateBookList();
});
