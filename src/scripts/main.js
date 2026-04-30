const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".overlay");
const gamburgerBtn = document.querySelector(".gamburger-button");
const closeBtn = document.querySelector(".close-button");


gamburgerBtn.addEventListener("click", function(e) {
  this.classList.toggle("gamburger-button--active")
  mobileMenu.classList.toggle("mobile-menu--open");
  overlay.classList.toggle("overlay--active");
});
