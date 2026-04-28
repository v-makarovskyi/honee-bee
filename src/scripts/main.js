const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".overlay");
const gamburgerBtn = document.querySelector(".gamburger-button");
const closeBtn = document.querySelector(".close-button");


gamburgerBtn.addEventListener("pointerdown", () => {
  mobileMenu.classList.add("mobile-menu--open");
  overlay.classList.add("overlay--active");
});

closeBtn.addEventListener("pointerdown", () => {
  mobileMenu.classList.remove("mobile-menu--open");
  overlay.classList.remove("overlay--active");
});
