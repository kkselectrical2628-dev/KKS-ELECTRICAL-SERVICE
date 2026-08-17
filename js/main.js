document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Toggle ---
  const menuBtn = document.getElementById("menu-open");
  const navMenu = document.getElementById("nav-menu");

  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuBtn.querySelector("i").classList.toggle("fa-bars");
    menuBtn.querySelector("i").classList.toggle("fa-times");
  });

  // Close menu on link click
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuBtn.querySelector("i").classList.replace("fa-times", "fa-bars");
    });
  });

  // --- Theme Toggle Logic ---
  const themeToggle = document.getElementById("theme-toggle");
  const icon = themeToggle.querySelector("i");

  const applyTheme = (theme) => {
    document.body.setAttribute("data-theme", theme);
    icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
  };

  const currentTheme = localStorage.getItem("theme") || "dark";
  applyTheme(currentTheme);

  themeToggle.addEventListener("click", () => {
    const newTheme =
      document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });

  // --- UI Initializer ---
  const initUI = () => {
    renderProjects("all");

    // Render FAQs
    const faqContainer = document.querySelector(".faq-container");
    if (faqContainer) {
      faqContainer.innerHTML = FAQS.map(
        (f) => `
          <div class="faq-item reveal">
              <div class="faq-question">${f.q} <i class="fas fa-chevron-down"></i></div>
              <div class="faq-answer"><div class="faq-answer-inner">${f.a}</div></div>
          </div>
        `,
      ).join("");

      document.querySelectorAll(".faq-item").forEach((item) => {
        item.querySelector(".faq-question").addEventListener("click", () => {
          const isOpen = item.classList.contains("faq-open");
          document
            .querySelectorAll(".faq-item")
            .forEach((i) => i.classList.remove("faq-open"));
          if (!isOpen) item.classList.add("faq-open");
        });
      });
    }
  };

  window.renderProjects = (filter) => {
    const gallery = document.getElementById("portfolio-gallery");
    if (!gallery) return;

    const filtered = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

    gallery.style.opacity = "0";
    setTimeout(() => {
      gallery.innerHTML = filtered.map((p, index) => `
          <div class="portfolio-item active">
              <div class="portfolio-img" style="background-image: url('${p.images[0]}')"></div>
              <div class="portfolio-info">
                  <h4>${p.title}</h4>
                  <p>${p.desc}</p>
                  <span class="view-gallery-btn" onclick="openLightbox(${index})">
                    <i class="fas fa-images"></i> View All ${p.images.length} Photos
                  </span>
              </div>
          </div>
        `).join("");
      gallery.style.opacity = "1";
    }, 200);
  };

  window.openLightbox = (projectIndex) => {
      const project = PROJECTS[projectIndex];
      const galleryContainer = document.getElementById("lightbox-gallery");
      const lightbox = document.getElementById("lightbox");
      
      galleryContainer.innerHTML = project.images.map(img => `<img src="${img}" alt="work">`).join("");
      lightbox.style.display = "flex";
  };

// Close lightbox logic
document.querySelector(".close-lightbox").addEventListener("click", () => {
    document.getElementById("lightbox").style.display = "none";
});

  // Tab filtering
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderProjects(btn.dataset.filter);
    });
  });

  // --- Scroll Observer ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    },
    { threshold: 0.1 },
  );

  initUI();
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // --- Config Settings ---
  document
    .querySelectorAll(".btn-setmore")
    .forEach((btn) => (btn.href = SITE_CONFIG.setmoreLink));
  const waBtn = document.getElementById("wa-float");
  if (waBtn) waBtn.href = `https://wa.me/${SITE_CONFIG.whatsapp}`;
  const phoneDisp = document.getElementById("display-phone");
  if (phoneDisp) phoneDisp.innerText = SITE_CONFIG.phone;

  // --- Netlify Form ---
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      })
        .then(() => {
          contactForm.innerHTML = `
            <div style="text-align:center; padding:50px; color:var(--text);">
              <i class="fas fa-check-circle" style="font-size:3.5rem; color:#22c55e; margin-bottom:20px;"></i>
              <h3>Request Received</h3>
              <p>We'll get back to you shortly.</p>
            </div>`;
        })
        .catch(() => alert("Error submitting. Please try again."));
    });
  }
});
