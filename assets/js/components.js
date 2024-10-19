// Fetch and include navbar in all pages
fetch("/components/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;

    // Initialize the navbar functionality after it's loaded
    initializeNavbar();
  })
  .catch((error) => {
    console.error("Error loading navbar:", error);
  });

// Function to initialize the navbar functionality
function initializeNavbar() {
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");

  if (menuIcon && navLinks) {
    menuIcon.addEventListener("click", () => {
      navLinks.classList.toggle("show-nav-links");
    });
  }
}
