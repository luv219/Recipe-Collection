// ===== DOM Ready =====
document.addEventListener("DOMContentLoaded", () => {
  // Dark Mode Toggle
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    // Change icon
    const icon = themeToggle.querySelector("i");
    if (body.classList.contains("dark-mode")) {
      icon.classList.replace("fa-moon", "fa-sun");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
    }
  });

  // Search Filter (for homepage or category pages)
  const searchBar = document.getElementById("searchBar");
  const cards = document.querySelectorAll(".category-card, .recipe-card");

  searchBar?.addEventListener("input", () => {
    const searchTerm = searchBar.value.toLowerCase();
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(searchTerm) ? "block" : "none";
    });
  });

  // Print Button (on recipe pages)
  const printButton = document.getElementById("printBtn");
  printButton?.addEventListener("click", () => {
    window.print();
  });
});
