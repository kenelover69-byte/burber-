/* =========================================================
   BLACKLINE BARBER STUDIO
   JavaScript — script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* -------------------------------------------------------
     01. ELEMENTS
  ------------------------------------------------------- */

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  const serviceRows = document.querySelectorAll(".service-row");

  const bookingForm = document.querySelector("#bookingForm");
  const bookingService = document.querySelector("#bookingService");
  const bookingMaster = document.querySelector("#bookingMaster");
  const bookingDate = document.querySelector("#bookingDate");
  const bookingTime = document.querySelector("#bookingTime");
  const bookingName = document.querySelector("#bookingName");
  const bookingPhone = document.querySelector("#bookingPhone");

  const summaryService = document.querySelector("#summaryService");
  const summaryMeta = document.querySelector("#summaryMeta");
  const summaryPrice = document.querySelector("#summaryPrice");

  const formMessage = document.querySelector("#formMessage");
  const toast = document.querySelector("#toast");

  const barberButtons = document.querySelectorAll(".barber-book");

  /* -------------------------------------------------------
     02. MOBILE NAVIGATION
  ------------------------------------------------------- */

  function closeMenu() {
    if (!menuToggle || !nav) return;

    menuToggle.classList.remove("active");
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Відкрити меню");

    document.body.classList.remove("menu-open");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Закрити меню" : "Відкрити меню"
      );

      document.body.classList.toggle("menu-open", isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  /* -------------------------------------------------------
     03. SMOOTH SCROLL
  ------------------------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      closeMenu();
    });
  });

  /* -------------------------------------------------------
     04. SCROLL REVEAL ANIMATIONS
  ------------------------------------------------------- */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* -------------------------------------------------------
     05. TOAST NOTIFICATIONS
  ------------------------------------------------------- */

  let toastTimeout;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimeout);

    toastTimeout = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }

  /* -------------------------------------------------------
     06. SERVICE DATA
  ------------------------------------------------------- */

  function getSelectedService() {
    if (!bookingService) return null;

    const parts = bookingService.value.split("|");

    return {
      name: parts[0] || "Чоловіча стрижка",
      price: Number(parts[1]) || 600,
      duration: parts[2] || "45 хв"
    };
  }

  function formatPrice(price) {
    return `${price} ₴`;
  }

  /* -------------------------------------------------------
     07. UPDATE BOOKING SUMMARY
  ------------------------------------------------------- */

  function updateBookingSummary() {
    const service = getSelectedService();

    if (!service) return;

    if (summaryService) {
      summaryService.textContent = service.name;
    }

    if (summaryMeta) {
      summaryMeta.textContent =
        `${service.duration} · ${formatPrice(service.price)}`;
    }

    if (summaryPrice) {
      summaryPrice.textContent = formatPrice(service.price);
    }
  }

  if (bookingService) {
    bookingService.addEventListener("change", () => {
      updateBookingSummary();

      serviceRows.forEach((row) => {
        const rowName = row.dataset.service;

        row.classList.toggle(
          "active",
          rowName === getSelectedService()?.name
        );
      });
    });
  }

  /* -------------------------------------------------------
     08. CLICKABLE SERVICE CARDS
  ------------------------------------------------------- */

  serviceRows.forEach((row) => {
    row.addEventListener("click", () => {
      const serviceName = row.dataset.service;
      const servicePrice = row.dataset.price;
      const serviceDuration = row.dataset.duration;

      if (!serviceName || !bookingService) return;

      const optionValue =
        `${serviceName}|${servicePrice}|${serviceDuration}`;

      const matchingOption = Array.from(
        bookingService.options
      ).find((option) => option.value === optionValue);

      if (matchingOption) {
        bookingService.value = optionValue;
      } else {
        const fallbackOption = Array.from(
          bookingService.options
        ).find((option) =>
          option.value.startsWith(`${serviceName}|`)
        );

        if (fallbackOption) {
          bookingService.value = fallbackOption.value;
        }
      }

      serviceRows.forEach((item) => {
        item.classList.toggle("active", item === row);
      });

      updateBookingSummary();

      showToast(`Обрано послугу: ${serviceName}`);

      const bookingSection = document.querySelector("#booking");

      if (bookingSection) {
        bookingSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /* -------------------------------------------------------
     09. BARBER SELECTION
  ------------------------------------------------------- */

  barberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const masterName = button.dataset.master;

      if (!masterName || !bookingMaster) return;

      const masterOption = Array.from(
        bookingMaster.options
      ).find((option) => option.value === masterName);

      if (masterOption) {
        bookingMaster.value = masterName;
      }

      const bookingSection = document.querySelector("#booking");

      if (bookingSection) {
        bookingSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      window.setTimeout(() => {
        if (bookingMaster) {
          bookingMaster.focus({
            preventScroll: true
          });
        }
      }, 450);

      showToast(`Обрано майстра: ${masterName}`);
    });
  });

  /* -------------------------------------------------------
     10. DATE RESTRICTIONS
  ------------------------------------------------------- */

  function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (bookingDate) {
    const today = getLocalDateString(new Date());

    bookingDate.min = today;

    bookingDate.addEventListener("change", () => {
      if (bookingDate.value && bookingDate.value < today) {
        bookingDate.value = today;

        showToast("Будь ласка, оберіть сьогоднішню або майбутню дату.");
      }
    });
  }

  /* -------------------------------------------------------
     11. PHONE INPUT
  ------------------------------------------------------- */

  if (bookingPhone) {
    bookingPhone.addEventListener("input", () => {
      bookingPhone.setCustomValidity("");
    });

    bookingPhone.addEventListener("blur", () => {
      const phone = bookingPhone.value.trim();

      if (!phone) return;

      const digits = phone.replace(/\D/g, "");

      if (digits.length < 10 || digits.length > 15) {
        bookingPhone.setCustomValidity(
          "Введіть коректний номер телефону."
        );
      } else {
        bookingPhone.setCustomValidity("");
      }
    });
  }

  /* -------------------------------------------------------
     12. FORM VALIDATION
  ------------------------------------------------------- */

  function setFormMessage(message, type) {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = "form-message";

    if (type) {
      formMessage.classList.add(type);
    }
  }

  function validateBooking() {
    if (!bookingService || !bookingMaster) {
      return false;
    }

    if (
      !bookingDate ||
      !bookingTime ||
      !bookingName ||
      !bookingPhone
    ) {
      return false;
    }

    const name = bookingName.value.trim();
    const phone = bookingPhone.value.trim();
    const digits = phone.replace(/\D/g, "");

    if (name.length < 2) {
      setFormMessage(
        "Вкажіть ім’я довжиною щонайменше 2 символи.",
        "error"
      );

      bookingName.focus();
      return false;
    }

    if (digits.length < 10 || digits.length > 15) {
      setFormMessage(
        "Перевірте номер телефону та спробуйте ще раз.",
        "error"
      );

      bookingPhone.focus();
      return false;
    }

    if (!bookingDate.value || !bookingTime.value) {
      setFormMessage(
        "Оберіть дату та час запису.",
        "error"
      );

      return false;
    }

    const selectedDate = new Date(
      `${bookingDate.value}T00:00:00`
    );

    if (Number.isNaN(selectedDate.getTime())) {
      setFormMessage(
        "Оберіть коректну дату.",
        "error"
      );

      return false;
    }

    const todayString = getLocalDateString(new Date());

    if (bookingDate.value < todayString) {
      setFormMessage(
        "Не можна обрати дату в минулому.",
        "error"
      );

      return false;
    }

    return true;
  }

  /* -------------------------------------------------------
     13. BOOKING FORM SUBMISSION
  ------------------------------------------------------- */

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      setFormMessage("", "");

      if (!bookingForm.reportValidity()) {
        return;
      }

      if (!validateBooking()) {
        return;
      }

      const service = getSelectedService();

      const bookingDetails = {
        service: service?.name || "",
        price: service?.price || 0,
        duration: service?.duration || "",
        master: bookingMaster.value,
        date: bookingDate.value,
        time: bookingTime.value,
        name: bookingName.value.trim(),
        phone: bookingPhone.value.trim()
      };

      /*
        IMPORTANT:
        This website currently has a demo booking form.
        No appointment is actually created or sent to a barber.

        To activate real bookings, connect a booking provider
        such as Altegio or your own backend API.
      */

      console.info(
        "BLACKLINE demo booking data:",
        bookingDetails
      );

      setFormMessage(
        "Форма працює в демонстраційному режимі. Запис ще не створено. Для реального бронювання потрібно підключити систему запису.",
        "error"
      );

      showToast(
        "Демо-режим: запис не відправлено."
      );
    });
  }

  /* -------------------------------------------------------
     14. CURRENT YEAR
  ------------------------------------------------------- */

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* -------------------------------------------------------
     15. INITIALIZATION
  ------------------------------------------------------- */

  updateBookingSummary();

  serviceRows.forEach((row) => {
    row.classList.toggle(
      "active",
      row.dataset.service === getSelectedService()?.name
    );
  });

  console.info("BLACKLINE Barber Studio initialized.");
});