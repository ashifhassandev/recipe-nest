document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hidden");
  }
});

// Ensuring the loader is hidden when navigating back to the page
window.addEventListener("pageshow", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hidden");
  }
});

// Show the loader when navigating away
window.addEventListener("beforeunload", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.remove("hidden");
  }
});