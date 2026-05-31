document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");
  const scrim = document.querySelector(".sidebar-scrim");
  const sectionContainer = document.querySelector("#section-container");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const imageModal = document.querySelector("#image-modal");
  const imageModalImg = document.querySelector(".image-modal__img");
  const imageModalCaption = document.querySelector(".image-modal__caption");
  const modalPrev = document.querySelector(".image-modal__nav--prev");
  const modalNext = document.querySelector(".image-modal__nav--next");
  const modalCloseTargets = Array.from(
    document.querySelectorAll("[data-modal-close]"),
  );
  let modalImages = [];
  let modalIndex = 0;

  const sectionMap = {
    aboutme: "sections/aboutme.html",
    education: "sections/education.html",
    skillset: "sections/skillset.html",
    projects: "sections/projects.html",
    pixelart: "sections/pixelart.html",
    contact: "sections/contact.html",
  };

  const portfolioData = {
    education: [
      {
        logo: "images/school logos/JMC LOGO.png",
        alt: "Jose Maria College Foundation Inc. Logo",
        school: "Jose Maria College Foundation Inc.",
        details: [
          "Senior High School (Grade 12) (2021 - 2022)",
          "Bachelor of Science Information Technology (2022 - Present)",
        ],
      },
      {
        logo: "images/school logos/LPU LOGO.png",
        alt: "Lyceum of the Philippines University Davao Logo",
        school: "Lyceum of the Philippines University Davao",
        details: ["Senior High School (Grade 11) (2020 - 2021)"],
      },
    ],
    skills: [
      {
        title: "Languages",
        items: ["Bisaya", "Tagalog", "English"],
      },
      {
        title: "Technical Knowledge",
        items: [
          "Java, HTML, CSS, JavaScript, PHP (Laravel), Python (Django)",
          "MySQL Simple Database Management",
          "CISCO Certifications (Networking)",
        ],
      },
      {
        title: "Programming Skills",
        items: [
          "Web Development",
          "Object-Oriented Programming",
          "Database Management",
          "Version Control (Git)",
        ],
      },
    ],
    certifications: [
      {
        src: "images/certifications/networking-basics.png",
        alt: "CISCO Networking Basics",
      },
      {
        src: "images/certifications/network-addressing-and-basic-troubleshooting.png",
        alt: "CISCO Network Addressing and Basic Troubleshooting",
      },
      {
        src: "images/certifications/network-support-and-security.png",
        alt: "CISCO Network Support and Security",
      },
      {
        src: "images/certifications/networking-devices-and-initial-configuration.png",
        alt: "CISCO Networking Devices and Initial Configuration",
      },
    ],
    projects: [
      {
        icon: "fa-solid fa-warehouse",
        title: "Inventory Management System",
        description:
          "Developed in Java, this system helps track and manage inventory data efficiently.",
        link: "https://github.com/MylesLozano/InventoryManagementSystem_FinalProject",
      },
      {
        icon: "fa-solid fa-desktop",
        title: "Simple Remote Desktop",
        description:
          "A Java application enabling remote access and control of a desktop environment.",
        link: "https://github.com/MylesLozano/Simple-Remote-Desktop-Using-Java",
      },
      {
        icon: "fa-solid fa-globe",
        title: "3 Simple Micro-Web Applications",
        description:
          "A Django-based system comprising three interconnected micro-applications. Each application serves a specific purpose and allows users to perform CRUD operations.",
        link: "https://github.com/MylesLozano/Final_Project",
      },
    ],
    pixelArt: {
      gallery: [
        { src: "images/pixel_arts/Sun-Blade.png", alt: "Pixel Art 1" },
        { src: "images/pixel_arts/Bright-Eye.png", alt: "Pixel Art 2" },
        { src: "images/pixel_arts/A-Journey.png", alt: "Pixel Art 3" },
        { src: "images/pixel_arts/Wine-Spill.png", alt: "Pixel Art 4" },
        { src: "images/gifs/Red_Sorcerer.gif", alt: "Pixel Art 5" },
        { src: "images/gifs/SLIME_RED_CAP.gif", alt: "Pixel Art 6" },
      ],
      featured: [{ src: "images/gifs/PIPE_RED_SLIME.gif", alt: "Pixel Art 7" }],
    },
    social: [
      {
        href: "https://github.com/MylesLozano",
        src: "images/footer logos/GitHub_Invertocat_Logo.png",
        alt: "GitHub",
      },
      {
        href: "https://www.facebook.com/TGL.Codex/",
        src: "images/footer logos/Facebook_Icon_Black.png",
        alt: "Facebook",
      },
      {
        href: "https://www.linkedin.com/in/humphrey-myles-lozano-69980b280/",
        src: "images/footer logos/linkedin_black_logo_icon.png",
        alt: "LinkedIn",
      },
    ],
  };

  const closeSidebar = () => {
    if (!sidebar || !toggle) {
      return;
    }
    sidebar.classList.remove("is-open");
    document.body.classList.remove("sidebar-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle && sidebar) {
    toggle.addEventListener("click", function () {
      const isOpen = sidebar.classList.toggle("is-open");
      document.body.classList.toggle("sidebar-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (scrim) {
    scrim.addEventListener("click", closeSidebar);
  }

  if (sidebar) {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    sidebar.addEventListener("mouseleave", () => {
      if (hoverQuery.matches && sidebar.classList.contains("is-open")) {
        closeSidebar();
      }
    });
  }

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("active", isActive);
    });
  };

  const renderSection = async (sectionId) => {
    if (!sectionContainer) {
      return;
    }
    const safeId = sectionMap[sectionId] ? sectionId : "aboutme";
    const url = sectionMap[safeId];
    setActiveLink(safeId);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${url}`);
      }
      const html = await response.text();
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const content =
        parsed.body && parsed.body.innerHTML.trim()
          ? parsed.body.innerHTML
          : html;
      sectionContainer.innerHTML = content;
      renderDynamicContent(sectionContainer);
      applyReveal(sectionContainer);
      document.title = `Humphrey Myles C. Lozano | ${safeId.replace(/^[a-z]/, (c) => c.toUpperCase())}`;
    } catch (error) {
      sectionContainer.innerHTML =
        '<section class="error-section"><div class="container"><h2 class="section-title">Section unavailable</h2><p>Unable to load this section right now.</p></div></section>';
    }
  };

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text) {
      element.textContent = text;
    }
    return element;
  };

  const createImageButton = (src, alt) => {
    const button = createElement("button", "image-card");
    button.type = "button";
    button.setAttribute("aria-label", `View ${alt}`);
    button.dataset.full = src;
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    button.append(img);
    return button;
  };

  const renderEducation = (root) => {
    const container = root.querySelector("[data-education-list]");
    if (!container) {
      return;
    }
    container.innerHTML = "";
    portfolioData.education.forEach((entry) => {
      const card = createElement("div", "timeline-item");
      const logo = document.createElement("img");
      logo.src = entry.logo;
      logo.alt = entry.alt;
      logo.loading = "lazy";
      logo.decoding = "async";
      logo.className = "school-logo";
      const title = createElement("h3", null, entry.school);
      card.append(logo, title);
      entry.details.forEach((detail) => {
        card.append(createElement("p", null, detail));
      });
      container.append(card);
    });
  };

  const renderSkills = (root) => {
    const grid = root.querySelector("[data-skill-cards]");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";
    portfolioData.skills.forEach((skill) => {
      const card = createElement("div", "skill-card");
      card.append(createElement("h3", null, skill.title));
      const list = document.createElement("ul");
      skill.items.forEach((item) => {
        list.append(createElement("li", null, item));
      });
      card.append(list);
      grid.append(card);
    });
  };

  const renderCertifications = (root) => {
    const container = root.querySelector("[data-certifications]");
    if (!container) {
      return;
    }
    container.innerHTML = "";
    portfolioData.certifications.forEach((cert) => {
      const img = document.createElement("img");
      container.append(createImageButton(cert.src, cert.alt));
    });
  };

  const renderProjects = (root) => {
    const container = root.querySelector("[data-projects]");
    if (!container) {
      return;
    }
    container.innerHTML = "";
    portfolioData.projects.forEach((project) => {
      const card = createElement("div", "project-card");
      const info = createElement("div", "project-info");
      const icon = createElement("i", project.icon);
      const title = createElement("h3", null, project.title);
      const description = createElement("p", null, project.description);
      const link = createElement("a", "btn", "View Project");
      link.href = project.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      info.append(icon, title, description, link);
      card.append(info);
      container.append(card);
    });
  };

  const renderPixelArt = (root) => {
    const gallery = root.querySelector("[data-pixel-gallery]");
    const featured = root.querySelector("[data-pixel-featured]");
    if (gallery) {
      gallery.innerHTML = "";
      portfolioData.pixelArt.gallery.forEach((art) => {
        gallery.append(createImageButton(art.src, art.alt));
      });
    }
    if (featured) {
      featured.innerHTML = "";
      portfolioData.pixelArt.featured.forEach((art) => {
        const button = createImageButton(art.src, art.alt);
        const img = button.querySelector("img");
        if (img) {
          img.classList.add("full-width-image");
        }
        button.classList.add("image-card--featured");
        featured.append(button);
      });
    }
  };

  const renderSocialLinks = (root) => {
    const container = root.querySelector("[data-social-links]");
    if (!container) {
      return;
    }
    container.innerHTML = "";
    portfolioData.social.forEach((social) => {
      const link = document.createElement("a");
      link.href = social.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const img = document.createElement("img");
      img.src = social.src;
      img.alt = social.alt;
      img.loading = "lazy";
      img.decoding = "async";
      link.append(img);
      container.append(link);
    });
  };

  const renderDynamicContent = (root) => {
    renderEducation(root);
    renderSkills(root);
    renderCertifications(root);
    renderProjects(root);
    renderPixelArt(root);
    renderSocialLinks(root);
  };

  const setModalImage = (index) => {
    if (!imageModal || !imageModalImg || !imageModalCaption) {
      return;
    }
    const entry = modalImages[index];
    if (!entry) {
      return;
    }
    modalIndex = index;
    imageModalImg.src = entry.src;
    imageModalImg.alt = entry.alt || "Expanded view";
    imageModalCaption.textContent = entry.alt || "";
    if (modalPrev) {
      modalPrev.disabled = modalImages.length <= 1;
    }
    if (modalNext) {
      modalNext.disabled = modalImages.length <= 1;
    }
  };

  const openImageModal = (images, index) => {
    if (!imageModal || !imageModalImg) {
      return;
    }
    modalImages = images;
    setModalImage(index);
    imageModal.classList.add("is-open");
    imageModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeImageModal = () => {
    if (!imageModal || !imageModalImg) {
      return;
    }
    imageModal.classList.remove("is-open");
    imageModal.setAttribute("aria-hidden", "true");
    imageModalImg.src = "";
    imageModalImg.alt = "";
    if (imageModalCaption) {
      imageModalCaption.textContent = "";
    }
    modalImages = [];
    modalIndex = 0;
    document.body.classList.remove("modal-open");
  };

  const getImageList = () => {
    if (!sectionContainer) {
      return [];
    }
    return Array.from(sectionContainer.querySelectorAll(".image-card img")).map(
      (img) => ({
        src: img.src,
        alt: img.alt,
      }),
    );
  };

  const showNextImage = () => {
    if (!modalImages.length) {
      return;
    }
    const nextIndex = (modalIndex + 1) % modalImages.length;
    setModalImage(nextIndex);
  };

  const showPrevImage = () => {
    if (!modalImages.length) {
      return;
    }
    const prevIndex =
      (modalIndex - 1 + modalImages.length) % modalImages.length;
    setModalImage(prevIndex);
  };

  if (sectionContainer) {
    sectionContainer.addEventListener("click", (event) => {
      const target = event.target;
      const button = target.closest(".image-card");
      if (!button) {
        return;
      }
      const img = button.querySelector("img");
      if (!img) {
        return;
      }
      const images = getImageList();
      const index = images.findIndex((entry) => entry.src === img.src);
      openImageModal(images, Math.max(index, 0));
    });
  }

  if (modalNext) {
    modalNext.addEventListener("click", showNextImage);
  }

  if (modalPrev) {
    modalPrev.addEventListener("click", showPrevImage);
  }

  modalCloseTargets.forEach((button) => {
    button.addEventListener("click", closeImageModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeImageModal();
    }
    if (imageModal && imageModal.classList.contains("is-open")) {
      if (event.key === "ArrowRight") {
        showNextImage();
      }
      if (event.key === "ArrowLeft") {
        showPrevImage();
      }
    }
  });

  const applyReveal = (root) => {
    const panels = root.querySelectorAll(".section-panel");
    panels.forEach((panel) => {
      panel.classList.remove("reveal");
      requestAnimationFrame(() => {
        panel.classList.add("reveal");
      });
    });
  };

  const getSectionFromHash = () => {
    const hash = window.location.hash.replace("#", "");
    return hash || "aboutme";
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href").replace("#", "");
      if (window.location.hash !== `#${targetId}`) {
        window.location.hash = targetId;
      } else {
        renderSection(targetId);
      }
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });

  window.addEventListener("hashchange", () => {
    renderSection(getSectionFromHash());
  });

  renderSection(getSectionFromHash());
});
