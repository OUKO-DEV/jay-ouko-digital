(() => {
  "use strict";

  /*
   * ============================================================
   * JAY OUKO DIGITAL STUDIO
   * app.js
   * ============================================================
   *
   * Features:
   * - Supabase connection
   * - Dark/light mode
   * - Mobile navigation
   * - Scroll effects
   * - Active navigation
   * - Animations
   * - Hire requests
   * - Contact messages
   * - Class registrations
   * - Reviews
   * - Payment requests
   * - Built-in chatbot
   * - WhatsApp / contact helpers
   *
   * IMPORTANT:
   * This frontend uses the Supabase publishable key.
   * Never put a Supabase service-role/secret key here.
   * ============================================================
   */

  document.documentElement.classList.add("js-ready");

  /* ============================================================
     SUPABASE CONFIGURATION
     ============================================================ */
let supabaseClient = null;

function initializeSupabase() {
  try {
    if (
      window.supabase &&
      typeof window.supabase.createClient === "function"
    ) {
      const SUPABASE_URL =
        "https://slusgnhkjcnuitqcmwag.supabase.co";

      const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_QEbq0RoIxbrW5HgmNelWZg_h3FWaMVL";

      supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
      );

      console.log("Supabase connected successfully.");
    } else {
      console.warn(
        "Supabase library was not loaded."
      );
    }
  } catch (error) {
    console.error(
      "Supabase initialization error:",
      error
    );

    supabaseClient = null;
  }
}

initializeSupabase();

  /* ============================================================
     HELPER FUNCTIONS
     ============================================================ */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  function setStatus(element, message, type = "") {
    if (!element) return;

    element.textContent = message;

    element.className = "form-status";

    if (type) {
      element.classList.add(type);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    });
  }

  async function insertRow(table, data) {
    if (!supabaseClient) {
      throw new Error(
        "Database connection unavailable."
      );
    }

    const { error } = await supabaseClient
      .from(table)
      .insert(data);

    if (error) {
      throw error;
    }

    return true;
  }

  function closeMobileMenu() {
    const navMenu = $("#navMenu");
    const menuToggle = $("#menuToggle");

    if (!navMenu) return;

    navMenu.classList.remove("open");

    if (menuToggle) {
      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }

  /* ============================================================
     MOBILE MENU
     ============================================================ */

  const menuToggle = $("#menuToggle");
  const navMenu = $("#navMenu");

  menuToggle?.addEventListener("click", () => {
    if (!navMenu) return;

    const isOpen =
      navMenu.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  $$(".nav-link").forEach((link) => {
    link.addEventListener(
      "click",
      closeMobileMenu
    );
  });

  document.addEventListener("click", (event) => {
    if (!navMenu) return;

    if (!navMenu.classList.contains("open")) {
      return;
    }

    if (
      !navMenu.contains(event.target) &&
      !menuToggle?.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();

      const chatbotWindow =
        $("#chatbotWindow");

      if (chatbotWindow) {
        chatbotWindow.hidden = true;
      }
    }
  });

  /* ============================================================
     DARK / LIGHT MODE
     ============================================================ */

  const themeToggle = $("#themeToggle");
  const themeIcon = $("#themeIcon");

  function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle(
      "dark",
      isDark
    );

    if (themeIcon) {
      themeIcon.textContent =
        isDark ? "☀" : "☾";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      );
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme =
      localStorage.getItem("jay-theme") ||
      "dark";
  } catch (error) {
    console.warn(
      "Local storage is unavailable."
    );
  }

  applyTheme(savedTheme);

  themeToggle?.addEventListener(
    "click",
    () => {
      const nextTheme =
        document.body.classList.contains("dark")
          ? "light"
          : "dark";

      applyTheme(nextTheme);

      try {
        localStorage.setItem(
          "jay-theme",
          nextTheme
        );
      } catch (error) {
        console.warn(
          "Could not save theme preference."
        );
      }
    }
  );

  /* ============================================================
     HEADER SCROLL EFFECT
     ============================================================ */

  const siteHeader = $("#siteHeader");
  const backToTop = $("#backToTop");

  function handleScroll() {
    if (siteHeader) {
      siteHeader.classList.toggle(
        "scrolled",
        window.scrollY > 20
      );
    }

    if (backToTop) {
      backToTop.classList.toggle(
        "visible",
        window.scrollY > 500
      );
    }
  }

  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );

  handleScroll();

  /* ============================================================
     BACK TO TOP
     ============================================================ */

  backToTop?.addEventListener(
    "click",
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );

  /* ============================================================
     ACTIVE NAVIGATION
     ============================================================ */

  const pageSections =
    $$("main section[id]");

  const navigationLinks =
    $$(".nav-link");

  if ("IntersectionObserver" in window) {
    const sectionObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            navigationLinks.forEach(
              (link) => {
                const target =
                  link.getAttribute("href");

                link.classList.toggle(
                  "active",
                  target ===
                    `#${entry.target.id}`
                );
              }
            );
          });
        },
        {
          rootMargin:
            "-35% 0px -55% 0px",
          threshold: 0
        }
      );

    pageSections.forEach(
      (section) =>
        sectionObserver.observe(section)
    );
  }

  /* ============================================================
     REVEAL ANIMATIONS
     ============================================================ */

  if ("IntersectionObserver" in window) {
    const revealObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "revealed"
            );

            revealObserver.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.08
        }
      );

    $$(".reveal").forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    $$(".reveal").forEach((element) => {
      element.classList.add("revealed");
    });
  }

  /* ============================================================
     FOOTER YEAR
     ============================================================ */

  const footerYear = $("#footerYear");

  if (footerYear) {
    footerYear.textContent =
      new Date().getFullYear();
  }

  /* ============================================================
     SERVICE BUTTONS
     ============================================================ */

  $$(".service-hire").forEach((button) => {
    button.addEventListener("click", () => {
      const service =
        button.dataset.service || "";

      const serviceSelect =
        $("#hireService");

      if (serviceSelect) {
        serviceSelect.value = service;
      }

      document
        .querySelector("#hire")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      setTimeout(() => {
        $("#hireName")?.focus();
      }, 500);
    });
  });

  /* ============================================================
     PRICING BUTTONS
     ============================================================ */

  $$(".hire-package").forEach((button) => {
    button.addEventListener("click", () => {
      const packageName =
        button.dataset.package || "";

      const serviceSelect =
        $("#hireService");

      if (serviceSelect) {
        serviceSelect.value =
          "Web Development";
      }

      const details =
        $("#hireDetails");

      if (details && !details.value) {
        details.value =
          `I am interested in the ${packageName}. Please send me the next steps and confirm the final project scope and price.`;
      }

      document
        .querySelector("#hire")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    });
  });

  /* ============================================================
     FREE CLASS REGISTRATION
     ============================================================ */

  const registerClassButton =
    $("#registerClassBtn");

  const registrationWrap =
    $("#registrationWrap");

  registerClassButton?.addEventListener(
    "click",
    () => {
      if (!registrationWrap) {
        return;
      }

      registrationWrap.hidden = false;

      registrationWrap.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      setTimeout(() => {
        $("#registrationName")?.focus();
      }, 500);
    }
  );

  /* ============================================================
     HIRE ME FORM
     ============================================================ */

  const hireForm = $("#hireForm");

  hireForm?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const status =
        $("#hireStatus");

      const submitButton =
        hireForm.querySelector(
          "button[type='submit']"
        );

      setStatus(
        status,
        "Sending project request..."
      );

      const payload = {
        name:
          $("#hireName")?.value.trim(),

        email:
          $("#hireEmail")?.value.trim(),

        phone:
          $("#hirePhone")?.value.trim() ||
          null,

        service:
          $("#hireService")?.value,

        budget:
          $("#hireBudget")?.value ||
          null,

        project_details:
          $("#hireDetails")?.value.trim(),

        status: "pending"
      };

      if (
        !payload.name ||
        !payload.email ||
        !payload.service ||
        !payload.project_details
      ) {
        setStatus(
          status,
          "Please complete all required fields.",
          "error"
        );

        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        await insertRow(
          "hire_requests",
          payload
        );

        hireForm.reset();

        setStatus(
          status,
          "Your project request has been received. I will review it and contact you.",
          "success"
        );
      } catch (error) {
        console.error(
          "Hire request error:",
          error
        );

        setStatus(
          status,
          "The request could not be saved. Please contact me through WhatsApp or email.",
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    }
  );

  /* ============================================================
     CONTACT FORM
     ============================================================ */

  const contactForm =
    $("#contactForm");

  contactForm?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const status =
        $("#contactStatus");

      const submitButton =
        contactForm.querySelector(
          "button[type='submit']"
        );

      setStatus(
        status,
        "Sending message..."
      );

      const payload = {
        name:
          $("#contactName")?.value.trim(),

        email:
          $("#contactEmail")?.value.trim(),

        subject:
          $("#contactService")?.value ||
          "General enquiry",

        message:
          $("#contactMessage")?.value.trim(),

        status: "unread"
      };

      if (
        !payload.name ||
        !payload.email ||
        !payload.message
      ) {
        setStatus(
          status,
          "Please complete your name, email and message.",
          "error"
        );

        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        await insertRow(
          "contact_messages",
          payload
        );

        contactForm.reset();

        setStatus(
          status,
          "Message sent successfully. Thank you.",
          "success"
        );
      } catch (error) {
        console.error(
          "Contact form error:",
          error
        );

        setStatus(
          status,
          "The message could not be saved. Please contact me through WhatsApp or email.",
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    }
  );

  /* ============================================================
     CLASS REGISTRATION FORM
     ============================================================ */

  const registrationForm =
    $("#registrationForm");

  registrationForm?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const status =
        $("#registrationStatus");

      const submitButton =
        registrationForm.querySelector(
          "button[type='submit']"
        );

      setStatus(
        status,
        "Submitting registration..."
      );

      const payload = {
        name:
          $("#registrationName")
            ?.value.trim(),

        email:
          $("#registrationEmail")
            ?.value.trim(),

        phone:
          $("#registrationPhone")
            ?.value.trim() ||
          null,

        program:
          $("#registrationProgram")
            ?.value,

        message:
          $("#registrationMessage")
            ?.value.trim() ||
          null,

        status: "pending"
      };

      if (
        !payload.name ||
        !payload.email ||
        !payload.program
      ) {
        setStatus(
          status,
          "Please complete the required fields.",
          "error"
        );

        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        await insertRow(
          "registrations",
          payload
        );

        registrationForm.reset();

        setStatus(
          status,
          "Registration received. You will be contacted after review.",
          "success"
        );
      } catch (error) {
        console.error(
          "Registration error:",
          error
        );

        setStatus(
          status,
          "Registration could not be saved. Please contact me through WhatsApp or email.",
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    }
  );

  /* ============================================================
     REVIEWS
     ============================================================ */

  async function loadApprovedReviews() {
    const reviewsList =
      $("#reviewsList");

    if (!reviewsList) {
      return;
    }

    if (!supabaseClient) {
      reviewsList.innerHTML = `
        <div class="review-empty">
          Reviews are temporarily unavailable.
          Please check again later.
        </div>
      `;

      return;
    }

    try {
      const {
        data,
        error
      } = await supabaseClient
        .from("reviews")
        .select(
          "name,rating,message,created_at"
        )
        .eq(
          "status",
          "approved"
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        )
        .limit(12);

      if (error) {
        throw error;
      }

      if (
        !data ||
        data.length === 0
      ) {
        reviewsList.innerHTML = `
          <div class="review-empty">
            No approved reviews yet.
            Be the first to leave feedback.
          </div>
        `;

        return;
      }

      reviewsList.innerHTML =
        data
          .map((review) => {
            const rating = Math.max(
              1,
              Math.min(
                5,
                Number(review.rating) || 5
              )
            );

            const stars =
              "★".repeat(rating) +
              "☆".repeat(5 - rating);

            const name =
              escapeHtml(
                review.name ||
                  "Client"
              );

            const message =
              escapeHtml(
                review.message || ""
              );

            return `
              <article class="review-card">

                <div
                  class="review-stars"
                  aria-label="${rating} out of 5 stars"
                >
                  ${stars}
                </div>

                <p>
                  ${message}
                </p>

                <small>
                  — ${name}
                </small>

              </article>
            `;
          })
          .join("");

    } catch (error) {
      console.error(
        "Review loading error:",
        error
      );

      reviewsList.innerHTML = `
        <div class="review-empty">
          Reviews could not be loaded right now.
        </div>
      `;
    }
  }

  const reviewForm =
    $("#reviewForm");

  reviewForm?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const status =
        $("#reviewStatus");

      const submitButton =
        reviewForm.querySelector(
          "button[type='submit']"
        );

      setStatus(
        status,
        "Submitting review..."
      );

      const payload = {
        name:
          $("#reviewName")
            ?.value.trim(),

        rating:
          Number(
            $("#reviewRating")
              ?.value
          ),

        message:
          $("#reviewMessage")
            ?.value.trim(),

        status: "pending"
      };

      if (
        !payload.name ||
        !payload.rating ||
        !payload.message
      ) {
        setStatus(
          status,
          "Please provide your name, rating and review.",
          "error"
        );

        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        await insertRow(
          "reviews",
          payload
        );

        reviewForm.reset();

        setStatus(
          status,
          "Thank you. Your review has been submitted for approval.",
          "success"
        );
      } catch (error) {
        console.error(
          "Review submission error:",
          error
        );

        setStatus(
          status,
          "The review could not be submitted. Please try again later.",
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    }
  );

  /* ============================================================
     PAYMENT FORM
     ============================================================ */

  const paymentForm =
    $("#paymentForm");

  paymentForm?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const status =
        $("#paymentStatus");

      const submitButton =
        paymentForm.querySelector(
          "button[type='submit']"
        );

      setStatus(
        status,
        "Submitting payment details..."
      );

      const amountValue =
        $("#paymentAmount")
          ?.value;

      const payload = {
        name:
          $("#paymentName")
            ?.value.trim(),

        email:
          $("#paymentEmail")
            ?.value.trim() ||
          null,

        phone:
          $("#paymentPhone")
            ?.value.trim() ||
          null,

        service:
          $("#paymentService")
            ?.value,

        amount:
          amountValue
            ? Number(amountValue)
            : null,

        payment_method:
          "M-Pesa",

        transaction_reference:
          $("#paymentReference")
            ?.value.trim() ||
          null,

        status: "pending"
      };

      if (
        !payload.name ||
        !payload.service
      ) {
        setStatus(
          status,
          "Please enter your name and service.",
          "error"
        );

        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        await insertRow(
          "payment_requests",
          payload
        );

        paymentForm.reset();

        setStatus(
          status,
          "Payment details received for manual confirmation.",
          "success"
        );
      } catch (error) {
        console.error(
          "Payment form error:",
          error
        );

        setStatus(
          status,
          "Payment details could not be saved. Please contact me directly.",
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    }
  );

  /* ============================================================
     CHATBOT
     ============================================================ */

  const chatbotToggle =
    $("#chatbotToggle");

  const chatbotWindow =
    $("#chatbotWindow");

  const chatbotClose =
    $("#chatbotClose");

  const chatbotMessages =
    $("#chatbotMessages");

  const chatbotForm =
    $("#chatbotForm");

  const chatbotInput =
    $("#chatbotInput");

  function addChatMessage(
    message,
    fromUser = false
  ) {
    if (!chatbotMessages) {
      return;
    }

    const bubble =
      document.createElement(
        "div"
      );

    bubble.className =
      fromUser
        ? "user-msg"
        : "bot-msg";

    bubble.textContent =
      message;

    chatbotMessages.appendChild(
      bubble
    );

    chatbotMessages.scrollTop =
      chatbotMessages.scrollHeight;
  }

  function getAssistantReply(
    input
  ) {
    const question =
      input.toLowerCase();

    if (
      question.includes("price") ||
      question.includes("cost") ||
      question.includes("budget")
    ) {
      return "Our starting packages are Basic from KSh 1,500+, Professional from KSh 5,000+, while larger Business projects are quoted after discussing the scope.";
    }

    if (
      question.includes("service") ||
      question.includes("website") ||
      question.includes("design") ||
      question.includes("marketing") ||
      question.includes("ai")
    ) {
      return "Jay Ouko offers Web Development, Graphic Design, Digital Marketing and practical AI Tools support.";
    }

    if (
      question.includes("class") ||
      question.includes("learn") ||
      question.includes("canva")
    ) {
      return "Free online classes run daily at 9:00 PM. Topics include Canva, AI Tools, Digital Work and Online Jobs.";
    }

    if (
      question.includes("contact") ||
      question.includes("whatsapp") ||
      question.includes("phone")
    ) {
      return "You can contact Jay Ouko through WhatsApp on 0142617814 or email emmanuelouko21@gmail.com.";
    }

    if (
      question.includes("hire") ||
      question.includes("project")
    ) {
      return "Use the Hire Me section to describe your project. Your request will be submitted for review.";
    }

    return "I can help with services, pricing, classes, hiring and contact information. Try asking: What services do you offer?";
  }

  chatbotToggle?.addEventListener(
    "click",
    () => {
      if (!chatbotWindow) {
        return;
      }

      chatbotWindow.hidden =
        !chatbotWindow.hidden;

      if (
        !chatbotWindow.hidden
      ) {
        setTimeout(() => {
          chatbotInput?.focus();
        }, 50);
      }
    }
  );

  chatbotClose?.addEventListener(
    "click",
    () => {
      if (chatbotWindow) {
        chatbotWindow.hidden =
          true;
      }
    }
  );

  $$(".quick-actions button")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const question =
            button.dataset.chat ||
            button.textContent;

          addChatMessage(
            button.textContent,
            true
          );

          setTimeout(() => {
            addChatMessage(
              getAssistantReply(
                question
              )
            );
          }, 250);
        }
      );
    });

  chatbotForm?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const message =
        chatbotInput?.value.trim();

      if (!message) {
        return;
      }

      addChatMessage(
        message,
        true
      );

      chatbotInput.value = "";

      setTimeout(() => {
        addChatMessage(
          getAssistantReply(
            message
          )
        );
      }, 250);
    }
  );

  /* ============================================================
     EXTERNAL LINKS
     ============================================================ */

  $$(
    'a[target="_blank"]'
  ).forEach((link) => {
    const rel = new Set(
      (
        link.getAttribute("rel") ||
        ""
      )
        .split(/\s+/)
        .filter(Boolean)
    );

    rel.add("noopener");
    rel.add("noreferrer");

    link.setAttribute(
      "rel",
      [...rel].join(" ")
    );
  });

  /* ============================================================
     FORM VALIDATION VISUAL FEEDBACK
     ============================================================ */

  document.addEventListener(
    "invalid",
    (event) => {
      event.target.classList.add(
        "invalid"
      );

      setTimeout(() => {
        event.target.classList.remove(
          "invalid"
        );
      }, 1000);
    },
    true
  );

  /* ============================================================
     LOAD APPROVED REVIEWS
     ============================================================ */

  loadApprovedReviews();

  /* ============================================================
     FINAL CONFIRMATION
     ============================================================ */

  console.log(
    "Jay Ouko Digital Studio loaded successfully."
  );

})();
