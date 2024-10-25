document.addEventListener("DOMContentLoaded", () => {
  const hymnLinks = document.querySelectorAll(".hymn-link");
  const modal = document.getElementById("hymn-modal");
  const hymnLyricsDiv = document.getElementById("hymn-lyrics");
  const hymnTitle = document.getElementById("hymn-title");
  const closeButton = document.getElementById("close-button");

  hymnLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const hymnNumber = link.getAttribute("data-hymn");
      const hymnName = link.textContent;
      fetch(`hymns/${hymnNumber}.html`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((data) => {
          hymnTitle.textContent = hymnName;
          hymnLyricsDiv.innerHTML = data;
          modal.classList.remove("hidden");
        })
        .catch((error) => {
          hymnTitle.textContent = "Error";
          hymnLyricsDiv.innerHTML = "<p>Hymn lyrics not found.</p>";
          modal.classList.remove("hidden");
          console.error(`Error fetching hymn ${hymnNumber}:`, error);
        });
    });
  });

  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close modal when clicking outside the content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Register the service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").then(
      (registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      },
      (error) => {
        console.log("Service Worker registration failed:", error);
      }
    );
  }
});
