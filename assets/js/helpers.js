// Helper to check if a book is in the wishlist
function isBookWishlisted(bookId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.includes(bookId);
}

// Function to toggle wishlist status
function toggleWishlist(bookId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlist.includes(bookId)) {
    // Remove from wishlist
    const index = wishlist.indexOf(bookId);
    wishlist.splice(index, 1);
  } else {
    // Add to wishlist
    wishlist.push(bookId);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

export { isBookWishlisted, toggleWishlist, removeElementsByClass };
