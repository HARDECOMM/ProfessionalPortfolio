/* =====================
   MODAL (CERTS + GALLERY)
   ===================== */
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");

document.querySelectorAll(".modal-item").forEach(item => {
  item.addEventListener("click", () => {
    modal.classList.add("active");
    modalImg.src = item.dataset.img;
    document.body.style.overflow = "hidden"; // lock scroll
  });
});

function closeModal() {
  modal.classList.remove("active");
  modalImg.src = "";
  document.body.style.overflow = ""; // restore scroll
}

closeBtn?.addEventListener("click", closeModal);

window.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});


/* =====================
   PROJECTS CAROUSEL
   ===================== */
const projectsGrid = document.querySelector(".projects-grid");
let projectScroll = 0;
let projectInterval;

function startProjectScroll() {
  projectInterval = setInterval(() => {
    if (!projectsGrid) return;

    const maxScroll =
      projectsGrid.scrollWidth - projectsGrid.clientWidth;

    projectScroll += 320;
    if (projectScroll >= maxScroll) projectScroll = 0;

    projectsGrid.scrollTo({
      left: projectScroll,
      behavior: "smooth"
    });
  }, 1000);
}

function stopProjectScroll() {
  clearInterval(projectInterval);
}

if (projectsGrid) {
  startProjectScroll();
  projectsGrid.addEventListener("mouseenter", stopProjectScroll);
  projectsGrid.addEventListener("mouseleave", startProjectScroll);
}


/* =====================
   GALLERY CAROUSEL
   ===================== */
const gallery = document.querySelector(".gallery-carousel");
let galleryScroll = 0;
let galleryInterval;

function startGalleryScroll() {
  galleryInterval = setInterval(() => {
    if (!gallery) return;

    const maxScroll =
      gallery.scrollWidth - gallery.clientWidth;

    galleryScroll += 300;
    if (galleryScroll >= maxScroll) galleryScroll = 0;

    gallery.scrollTo({
      left: galleryScroll,
      behavior: "smooth"
    });
  }, 1000);
}

function stopGalleryScroll() {
  clearInterval(galleryInterval);
}

if (gallery) {
  startGalleryScroll();
  gallery.addEventListener("mouseenter", stopGalleryScroll);
  gallery.addEventListener("mouseleave", startGalleryScroll);
}


/* =====================
   MANUAL CAROUSEL ARROWS
   ===================== */
document.querySelectorAll(".carousel-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    const container =
      target === "projects" ? projectsGrid : gallery;

    if (!container) return;

    const scrollAmount = target === "projects" ? 320 : 300;

    // pause auto-scroll on manual action
    target === "projects" ? stopProjectScroll() : stopGalleryScroll();

    container.scrollBy({
      left: btn.classList.contains("next")
        ? scrollAmount
        : -scrollAmount,
      behavior: "smooth"
    });

    // resume auto-scroll
    setTimeout(() => {
      target === "projects"
        ? startProjectScroll()
        : startGalleryScroll();
    }, 1200);
  });
});


/* =====================
   CERTIFICATE FILTER (🔥 NEW – 5 LINES)
   ===================== */
const filters = document.querySelectorAll(".cert-filter");
const certs = document.querySelectorAll(".cert-card");

filters.forEach(btn =>
  btn.onclick = () => {
    filters.forEach(b => b.classList.remove("active")); // UI state
    btn.classList.add("active");

    certs.forEach(card =>
      card.style.display =
        btn.dataset.filter === "all" ||
        card.dataset.category === btn.dataset.filter
          ? "block"
          : "none"
    );
  }
);


/* =====================
   NIGHT MODE (FIXED & PERSISTENT)
   ===================== */
const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (toggle) toggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

// load saved theme
applyTheme(localStorage.getItem("theme") || "light");

// toggle theme
toggle?.addEventListener("click", () => {
  applyTheme(
    root.getAttribute("data-theme") === "dark" ? "light" : "dark"
  );
});

/* =====================
   LAZY LOAD + BLUR-UP
   ===================== */
const lazyImages = document.querySelectorAll("img.lazy");

const imageObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const img = entry.target;
    img.src = img.dataset.src;
    img.onload = () => img.classList.add("loaded");

    imageObserver.unobserve(img);
  });
});

lazyImages.forEach(img => imageObserver.observe(img));


/* =====================
   SCROLL PROGRESS BAR
   ===================== */
const progressBar = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + "%";
});

/* =====================
   NETLIFY FORM SUCCESS (VISIBLE FIX)
   ===================== */
const form = document.getElementById("contact-form");
const successBox = document.getElementById("form-success");

form?.addEventListener("submit", e => {
  e.preventDefault(); // stop page reload

  const formData = new FormData(form);

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString()
  })
    .then(() => {
      form.style.display = "none";
      successBox.style.display = "block";
    })
    .catch(() => {
      alert("❌ Something went wrong. Please try again.");
    });
});