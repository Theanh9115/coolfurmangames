const menuToggle = document.querySelector("#menu-toggle");
const navPages = document.querySelector(".nav-pages");

menuToggle.addEventListener("click", () => {
  const isOpen = navPages.classList.toggle("open");

  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
