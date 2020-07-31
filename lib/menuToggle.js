function toggleMenu() {
    const x = document.getElementById("mobile-nav-links");
    console.log("ho");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}