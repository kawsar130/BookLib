// fetch and include navbar in all pages
fetch("/components/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;
  })
  .catch((error) => console.error("Error loading navbar:", error)); // TODO: Show error message in the UI
