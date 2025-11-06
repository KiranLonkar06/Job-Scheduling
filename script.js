function goToMain() {
    window.location.href = "main.html";
}

const btn = document.getElementById("startBtn");

btn.addEventListener("mouseenter", () => {
    btn.classList.remove("animate");
    void btn.offsetWidth; // <-- RESTART TRICK
    btn.classList.add("animate");
});

btn.addEventListener("mouseleave", () => {
    btn.classList.remove("animate");
});

function selectAlgo(algo) {
    alert("Selected: " + algo);

    // Later we will redirect to input form pages
    // e.g. window.location.href = algo + ".html";
}
