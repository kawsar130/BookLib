// Function to create wishlist icon
function createWishlistIcon(isWishlisted) {
  const xmlns = "http://www.w3.org/2000/svg";
  const wishlistIcon = document.createElementNS(xmlns, "svg");

  wishlistIcon.setAttribute("width", "24");
  wishlistIcon.setAttribute("height", "24");
  wishlistIcon.setAttribute("viewBox", "0 0 24 24");
  wishlistIcon.setAttribute("fill", isWishlisted ? "#e74c3c" : "none");
  wishlistIcon.setAttribute("stroke", "#e74c3c");
  wishlistIcon.setAttribute("stroke-width", "2");
  wishlistIcon.setAttribute("stroke-linecap", "round");
  wishlistIcon.setAttribute("stroke-linejoin", "round");
  wishlistIcon.classList.add("wishlist-icon");

  const path = document.createElementNS(xmlns, "path");
  path.setAttribute(
    "d",
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
  );

  wishlistIcon.appendChild(path);
  return wishlistIcon;
}

export { createWishlistIcon };
