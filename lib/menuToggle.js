function toggleMenu() {
    const x = document.getElementById("mobile-nav-links");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}