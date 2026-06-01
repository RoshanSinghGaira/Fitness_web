/* ============================================
   FitLife Pro — script.js
   Premium Fitness Website — All Interactivity
   ============================================ */

"use strict";

/* --------------------------------------------------
   1. PRELOADER
   -------------------------------------------------- */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    // Small delay so the animation feels intentional
    setTimeout(() => preloader.classList.add("hidden"), 400);
    // Remove from DOM after fade-out completes
    setTimeout(() => preloader.remove(), 900);
  }
});

/* --------------------------------------------------
   2. STICKY NAVBAR (scroll-aware)
   -------------------------------------------------- */
const navbar = document.getElementById("navbar");

function handleNavbarScroll() {
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });
handleNavbarScroll(); // initial check

/* --------------------------------------------------
   3. MOBILE MENU
   -------------------------------------------------- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const mobileOverlay = document.getElementById("mobileOverlay");

function openMobileMenu() {
  hamburger.classList.add("active");
  hamburger.setAttribute("aria-expanded", "true");
  navLinks.classList.add("open");
  if (mobileOverlay) mobileOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  hamburger.classList.remove("active");
  hamburger.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("open");
  if (mobileOverlay) mobileOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

if (hamburger) {
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.contains("active");
    isOpen ? closeMobileMenu() : openMobileMenu();
  });
}

if (mobileOverlay) {
  mobileOverlay.addEventListener("click", closeMobileMenu);
}

// Close mobile menu when a link is clicked
if (navLinks) {
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

/* --------------------------------------------------
   4. ACTIVE NAV LINK HIGHLIGHT (Intersection Observer)
   -------------------------------------------------- */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const sectionObserverOptions = {
  root: null,
  threshold: 0.2,
  rootMargin: "-80px 0px -40% 0px",
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navAnchors.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
      });
    }
  });
}, sectionObserverOptions);

sections.forEach((section) => sectionObserver.observe(section));

/* --------------------------------------------------
   5. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------- */
const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right"
);

const revealObserverOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: "0px 0px -60px 0px",
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      revealObserver.unobserve(entry.target); // Animate only once
    }
  });
}, revealObserverOptions);

revealElements.forEach((el) => revealObserver.observe(el));

/* --------------------------------------------------
   6. DARK MODE / LIGHT MODE TOGGLE
   -------------------------------------------------- */
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

// Check for saved preference or default to dark
function getThemePreference() {
  const saved = localStorage.getItem("fitlife-theme");
  if (saved) return saved;
  // Default to dark
  return "dark";
}

function applyTheme(theme) {
  html.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  localStorage.setItem("fitlife-theme", theme);
}

// Apply on load
applyTheme(getThemePreference());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

/* --------------------------------------------------
   7. BACK TO TOP BUTTON
   -------------------------------------------------- */
const backToTop = document.getElementById("backToTop");

function handleBackToTopVisibility() {
  if (!backToTop) return;
  if (window.scrollY > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

window.addEventListener("scroll", handleBackToTopVisibility, {
  passive: true,
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --------------------------------------------------
   8. BMI CALCULATOR
   -------------------------------------------------- */
const bmiForm = document.getElementById("bmiForm");
const bmiValueEl = document.getElementById("bmi-value");
const bmiCategoryEl = document.getElementById("bmi-category");
const bmiMessageEl = document.getElementById("bmi-message");
const bmiResultCircle = document.getElementById("bmi-result-circle");

/**
 * Classifies BMI into a health category
 * @param {number} bmi - The calculated BMI value
 * @returns {{ category: string, message: string, cssClass: string, borderColor: string }}
 */
function classifyBMI(bmi) {
  if (bmi < 18.5) {
    return {
      category: "Underweight",
      message:
        "You are below the healthy weight range. Consider a balanced diet rich in proteins and healthy fats to gain weight safely.",
      cssClass: "bmi-underweight",
      borderColor: "#60a5fa",
    };
  } else if (bmi < 25) {
    return {
      category: "Normal Weight",
      message:
        "Great job! You're within the healthy weight range. Maintain your fitness routine and balanced nutrition.",
      cssClass: "bmi-normal",
      borderColor: "#39ff14",
    };
  } else if (bmi < 30) {
    return {
      category: "Overweight",
      message:
        "You're slightly above the healthy range. Regular exercise and a calorie-conscious diet can help you get back on track.",
      cssClass: "bmi-overweight",
      borderColor: "#fbbf24",
    };
  } else {
    return {
      category: "Obese",
      message:
        "Your BMI indicates obesity. We recommend consulting a healthcare professional and starting a supervised fitness program.",
      cssClass: "bmi-obese",
      borderColor: "#f87171",
    };
  }
}

if (bmiForm) {
  bmiForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const height = parseFloat(document.getElementById("bmi-height").value);
    const weight = parseFloat(document.getElementById("bmi-weight").value);

    // Validation
    if (!height || !weight || height <= 0 || weight <= 0) {
      bmiCategoryEl.textContent = "Invalid Input";
      bmiMessageEl.textContent = "Please enter valid height and weight values.";
      return;
    }

    // BMI formula: weight(kg) / (height(m))^2
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const rounded = bmi.toFixed(1);
    const classification = classifyBMI(bmi);

    // Animate the result
    bmiValueEl.textContent = rounded;
    bmiCategoryEl.textContent = classification.category;
    bmiCategoryEl.className = `bmi-category ${classification.cssClass}`;
    bmiMessageEl.textContent = classification.message;

    // Update circle border color
    if (bmiResultCircle) {
      bmiResultCircle.style.borderColor = classification.borderColor;
    }

    // Scroll result into view on mobile
    const resultCard = document.getElementById("bmi-result-card");
    if (resultCard && window.innerWidth < 768) {
      resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

/* --------------------------------------------------
   9. CONTACT FORM (client-side only)
   -------------------------------------------------- */
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Basic validation check (browser handles required fields)
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // Simulate sending — hide form, show success
    contactForm.style.display = "none";
    if (formSuccess) formSuccess.classList.add("show");

    // Reset after 5 seconds
    setTimeout(() => {
      contactForm.reset();
      contactForm.style.display = "";
      if (formSuccess) formSuccess.classList.remove("show");
    }, 5000);
  });
}

/* --------------------------------------------------
   10. SMOOTH SCROLL for anchor links
   -------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  });
});

/* --------------------------------------------------
   11. HERO STATS COUNTER ANIMATION
   -------------------------------------------------- */
function animateCounters() {
  const stats = document.querySelectorAll(".hero-stat h3");

  stats.forEach((stat) => {
    const text = stat.textContent.trim();
    const suffix = text.replace(/[\d,.]/g, ""); // e.g., "K+", "+", "%"
    const numStr = text.replace(/[^\d.]/g, ""); // e.g., "10", "150", "98"
    const target = parseFloat(numStr);
    if (isNaN(target)) return;

    let current = 0;
    const duration = 2000; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quad
      const ease = 1 - (1 - progress) * (1 - progress);

      current = Math.floor(ease * target);

      // Format with comma if >= 1000
      const formatted =
        current >= 1000 ? current.toLocaleString("en-IN") : current;
      stat.textContent = formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Ensure final value matches original
        stat.textContent = text;
      }
    }

    requestAnimationFrame(update);
  });
}

// Trigger counter animation when hero stats come into view
const heroStats = document.querySelector(".hero-stats");
if (heroStats) {
  let counterAnimated = false;
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !counterAnimated) {
          counterAnimated = true;
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterObserver.observe(heroStats);
}

/* --------------------------------------------------
   12. NAVBAR LINK CLICK RIPPLE EFFECT (micro-interaction)
   -------------------------------------------------- */
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    // Create ripple
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
    `;

    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);

    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
  @keyframes rippleEffect {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

/* --------------------------------------------------
   13. GALLERY LIGHTBOX (simple modal)
   -------------------------------------------------- */
(function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (!galleryItems.length) return;

  // Create lightbox DOM
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image preview");
  lightbox.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    z-index: 10000;
    display: none;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: zoom-out;
  `;

  const lightboxImg = document.createElement("img");
  lightboxImg.style.cssText = `
    max-width: 90%;
    max-height: 85vh;
    border-radius: 12px;
    box-shadow: 0 20px 80px rgba(0,0,0,0.5);
    transform: scale(0.9);
    transition: transform 0.3s ease;
  `;

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✕";
  closeBtn.setAttribute("aria-label", "Close image preview");
  closeBtn.style.cssText = `
    position: absolute;
    top: 24px;
    right: 24px;
    width: 44px;
    height: 44px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50%;
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  `;
  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = "rgba(255,255,255,0.2)";
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = "rgba(255,255,255,0.1)";
  });

  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(closeBtn);
  document.body.appendChild(lightbox);

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Gallery image";
    lightbox.style.display = "flex";
    requestAnimationFrame(() => {
      lightbox.style.opacity = "1";
      lightboxImg.style.transform = "scale(1)";
    });
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.style.opacity = "0";
    lightboxImg.style.transform = "scale(0.9)";
    setTimeout(() => {
      lightbox.style.display = "none";
      document.body.style.overflow = "";
    }, 300);
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img) openLightbox(img.src, img.alt);
    });
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === closeBtn) closeLightbox();
  });

  closeBtn.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.style.display === "flex") {
      closeLightbox();
    }
  });
})();

/* --------------------------------------------------
   14. PARALLAX-LIKE SUBTLE EFFECT ON HERO
   -------------------------------------------------- */
const heroBg = document.querySelector(".hero-bg img");
if (heroBg) {
  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.05)`;
      }
    },
    { passive: true }
  );
}

/* --------------------------------------------------
   15. KEYBOARD NAVIGATION SUPPORT
   -------------------------------------------------- */
// Ensure Escape closes mobile menu
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMobileMenu();
  }
});

/* --------------------------------------------------
   16. SERVICE CARDS TILT EFFECT (micro-interaction)
   -------------------------------------------------- */
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* --------------------------------------------------
   17. PRICING CARD HOVER GLOW (follows cursor)
   -------------------------------------------------- */
document.querySelectorAll(".pricing-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(57, 255, 20, 0.06) 0%, transparent 60%)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.background = "";
  });
});

/* --------------------------------------------------
   18. TYPING EFFECT FOR HERO BADGE (optional polish)
   -------------------------------------------------- */
(function initTypingEffect() {
  const badge = document.querySelector(".hero-badge");
  if (!badge) return;

  // Add a blinking cursor after badge text
  const cursor = document.createElement("span");
  cursor.style.cssText = `
    display: inline-block;
    width: 2px;
    height: 14px;
    background: var(--clr-accent);
    margin-left: 4px;
    animation: blink 1s step-end infinite;
    vertical-align: middle;
  `;

  const blinkStyle = document.createElement("style");
  blinkStyle.textContent = `
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(blinkStyle);
  badge.appendChild(cursor);

  // Remove cursor after 4 seconds
  setTimeout(() => cursor.remove(), 4000);
})();

/* --------------------------------------------------
   19. PERFORMANCE: Throttle scroll handlers
   -------------------------------------------------- */
// All scroll handlers are already using { passive: true } for performance.
// The IntersectionObserver API is used wherever possible to avoid expensive
// scroll-based calculations.

console.log(
  "%c💪 FitLife Pro %c— Ready to transform!",
  "color: #39ff14; font-size: 16px; font-weight: bold;",
  "color: #9a9a9a; font-size: 14px;"
);
