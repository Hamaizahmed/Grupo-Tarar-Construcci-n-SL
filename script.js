(() => {
  "use strict";

  const state = {
    lang: localStorage.getItem("gt-lang") === "en" ? "en" : "es"
  };

  const body = document.body;
  const header = document.getElementById("site-header");
  const nav = document.getElementById("main-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const backToTop = document.querySelector(".back-to-top");
  const form = document.getElementById("quote-form");
  const formStatus = document.getElementById("form-status");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox__close");

  function currentText(el) {
    return el.getAttribute(`data-${state.lang}`) || el.getAttribute("data-es") || "";
  }

  function applyLanguage() {
    document.documentElement.lang = state.lang;

    document.querySelectorAll("[data-es][data-en]").forEach((el) => {
      el.textContent = currentText(el);
    });

    document.querySelectorAll("option[data-es][data-en]").forEach((option) => {
      option.textContent = currentText(option);
    });

    document.querySelectorAll("[data-placeholder-es][data-placeholder-en]").forEach((el) => {
      const placeholder = el.getAttribute(`data-placeholder-${state.lang}`);
      el.setAttribute("placeholder", placeholder || "");
    });

    document.querySelectorAll("[data-lang-option]").forEach((el) => {
      el.classList.toggle("active", el.dataset.langOption === state.lang);
    });

    const titles = {
      es: "Grupo Tarar Construcción SL | Construcción en Lleida",
      en: "Grupo Tarar Construcción SL | Construction in Lleida"
    };

    const descriptions = {
      es: "Grupo Tarar Construcción SL en Lleida. Servicios de Pladur, Cinta, Pintura y Baldosa. Solicita presupuesto.",
      en: "Grupo Tarar Construcción SL in Lleida. Plasterboard, finishing, painting and tiling services. Request a quote."
    };

    document.title = titles[state.lang];
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", descriptions[state.lang]);

    document.querySelectorAll(".nav-link").forEach((link) => link.setAttribute("aria-current", "false"));
    closeMenu();
  }

  function toggleLanguage() {
    state.lang = state.lang === "es" ? "en" : "es";
    localStorage.setItem("gt-lang", state.lang);
    applyLanguage();
  }

  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.addEventListener("click", toggleLanguage);
  });

  function openMenu() {
    nav.classList.add("open");
    body.classList.add("menu-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    nav.classList.remove("open");
    body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", () => {
    nav.classList.contains("open") ? closeMenu() : openMenu();
  });

  document.querySelectorAll(".nav-link, .main-nav a, .main-nav button").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 860 && item !== navToggle) closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  const sectionLinks = [...document.querySelectorAll(".nav-link")];
  const observedSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      sectionLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === id);
      });
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  });

  observedSections.forEach((section) => navObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  function handleScroll() {
    header.classList.toggle("scrolled", window.scrollY > 12);
    backToTop.classList.toggle("show", window.scrollY > 650);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function openLightbox(card) {
    const imageUrl = card.dataset.lightbox;
    const caption = state.lang === "en" ? card.dataset.captionEn : card.dataset.captionEs;
    const image = card.querySelector("img");

    lightboxImage.src = imageUrl;
    lightboxImage.alt = image ? image.alt : "";
    lightboxCaption.textContent = caption || "";

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("lightbox-open");
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains("open")) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    body.classList.remove("lightbox-open");
    lightboxImage.src = "";
  }

  document.querySelectorAll("[data-lightbox]").forEach((card) => {
    card.addEventListener("click", () => openLightbox(card));
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightboxClose.addEventListener("click", closeLightbox);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const service = String(data.get("service") || "").trim();
    const message = String(data.get("message") || "").trim();

    const serviceLabel = service || (state.lang === "en" ? "Not selected" : "No seleccionado");

    const subject = state.lang === "en"
      ? `Quote enquiry · ${serviceLabel} · ${name}`
      : `Solicitud de presupuesto · ${serviceLabel} · ${name}`;

    const bodyText = state.lang === "en"
      ? [
          `Hello Grupo Tarar Construcción SL,`,
          ``,
          `I would like to request information / a quote.`,
          ``,
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone || "Not provided"}`,
          `Service: ${serviceLabel}`,
          ``,
          `Project details:`,
          message
        ].join("\n")
      : [
          `Hola Grupo Tarar Construcción SL,`,
          ``,
          `Me gustaría solicitar información / un presupuesto.`,
          ``,
          `Nombre: ${name}`,
          `Email: ${email}`,
          `Teléfono: ${phone || "No indicado"}`,
          `Servicio: ${serviceLabel}`,
          ``,
          `Detalles del proyecto:`,
          message
        ].join("\n");

    const mailto = `mailto:info@grupotararconstruccion.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailto;

    formStatus.textContent = state.lang === "en"
      ? "Your email app should open with the enquiry prepared."
      : "Tu aplicación de correo debería abrirse con la consulta preparada.";
  });

  applyLanguage();
})();
