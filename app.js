/* =========================================================
   JAY OUKO PORTFOLIO - COMPLETE APP.JS
   ========================================================= */

(() => {
    "use strict";

    /* =========================================================
       SUPABASE CONFIGURATION
    ========================================================= */

    const SUPABASE_URL = window.JAY_SUPABASE_URL;
    const SUPABASE_KEY = window.JAY_SUPABASE_KEY;

    let supabaseClient = null;

    if (
        typeof window.supabase !== "undefined" &&
        SUPABASE_URL &&
        SUPABASE_KEY
    ) {
        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
    }

    /* =========================================================
       BASIC HELPERS
    ========================================================= */

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    function showStatus(element, message, type = "success") {
        if (!element) return;

        element.textContent = message;
        element.className = `form-status ${type}`;

        setTimeout(() => {
            element.textContent = "";
            element.className = "form-status";
        }, 6000);
    }

    function setButtonLoading(button, loading, normalText) {
        if (!button) return;

        if (loading) {
            button.disabled = true;
            button.dataset.originalText =
                button.textContent || normalText;
            button.textContent = "Sending...";
        } else {
            button.disabled = false;
            button.textContent =
                button.dataset.originalText || normalText;
        }
    }

    async function insertRow(table, data) {
        if (!supabaseClient) {
            throw new Error("Supabase is not configured.");
        }

        const { data: result, error } =
            await supabaseClient
                .from(table)
                .insert([data])
                .select();

        if (error) {
            console.error(
                `Supabase error in ${table}:`,
                error
            );
            throw error;
        }

        return result;
    }

    /* =========================================================
       MOBILE MENU
    ========================================================= */

    const menuToggle =
        $("#menuToggle") ||
        $(".menu-toggle") ||
        $(".mobile-menu-toggle");

    const navMenu =
        $("#navMenu") ||
        $(".nav-menu") ||
        $(".navbar-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            menuToggle.classList.toggle("active");

            const expanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!expanded)
            );
        });

        $$(".main-nav a, .nav-menu a, .navbar-menu a")
            .forEach((link) => {
                link.addEventListener("click", () => {
                    navMenu.classList.remove("active");
                    menuToggle.classList.remove("active");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                });
            });
    }

    /* =========================================================
       THEME TOGGLE
    ========================================================= */

    const themeToggle =
        $("#themeToggle") ||
        $(".theme-toggle") ||
        $("#darkModeToggle");

    function updateThemeIcon() {
        if (!themeToggle) return;

        const dark =
            document.documentElement.classList.contains("dark") ||
            document.body.classList.contains("dark-mode");

        const icon = themeToggle.querySelector("i");

        if (icon) {
            icon.className = dark
                ? "fas fa-sun"
                : "fas fa-moon";
        } else {
            const themeIcon = $("#themeIcon");

            if (themeIcon) {
                themeIcon.textContent = dark
                    ? "☀️"
                    : "🌙";
            }
        }
    }

    const savedTheme =
        localStorage.getItem("jay-theme");

    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark-mode");
    }

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isDark =
                document.documentElement.classList.toggle(
                    "dark"
                );

            document.body.classList.toggle(
                "dark-mode",
                isDark
            );

            localStorage.setItem(
                "jay-theme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();
        });
    }

    /* =========================================================
       HEADER SCROLL EFFECT
    ========================================================= */

    const header =
        $("header") ||
        $(".header") ||
        $(".site-header");

    function handleHeaderScroll() {
        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener(
        "scroll",
        handleHeaderScroll
    );

    handleHeaderScroll();

    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    const sections = $$("section[id]");

    const navLinks = $$(
        ".main-nav a.nav-link, .nav-menu a, .navbar-menu a"
    );

    function updateActiveNav() {
        let current = "";

        sections.forEach((section) => {
            const top =
                section.offsetTop - 150;

            const height =
                section.offsetHeight;

            if (
                window.scrollY >= top &&
                window.scrollY < top + height
            ) {
                current =
                    section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (href === `#${current}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener(
        "scroll",
        updateActiveNav
    );

    updateActiveNav();

    /* =========================================================
       SMOOTH SCROLLING
    ========================================================= */

    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener(
            "click",
            (event) => {
                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (target) {
                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        );
    });

    /* =========================================================
       REVEAL ANIMATIONS
    ========================================================= */

    const revealElements = $$(
        ".reveal, .service-card, .portfolio-card, " +
        ".pricing-card, .testimonial-card, " +
        ".about-content, .hero-content"
    );

    if ("IntersectionObserver" in window) {
        const observer =
            new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (
                            entry.isIntersecting
                        ) {
                            entry.target.classList.add(
                                "visible"
                            );

                            obs.unobserve(
                                entry.target
                            );
                        }
                    });
                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(
            (element) => {
                observer.observe(element);
            }
        );
    } else {
        revealElements.forEach(
            (element) => {
                element.classList.add(
                    "visible"
                );
            }
        );
    }

    /* =========================================================
       CURRENT YEAR
    ========================================================= */

    const footerYear = $("#footerYear");

    if (footerYear) {
        footerYear.textContent =
            new Date().getFullYear();
    }

    const yearElements = $$(
        "#currentYear, #year, .current-year"
    );

    yearElements.forEach((element) => {
        element.textContent =
            new Date().getFullYear();
    });

    /* =========================================================
       SERVICE HIRE BUTTONS
    ========================================================= */

    $$(".service-hire").forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const service =
                    button.dataset.service || "";

                const hireSection =
                    $("#hire");

                if (hireSection) {
                    hireSection.scrollIntoView({
                        behavior: "smooth"
                    });
                }

                setTimeout(() => {
                    const serviceSelect =
                        $("#hireService");

                    if (
                        serviceSelect &&
                        service
                    ) {
                        serviceSelect.value =
                            service;
                    }
                }, 500);
            }
        );
    });

    /* =========================================================
       PRICING PACKAGE BUTTONS
    ========================================================= */

    $$(".hire-package").forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const packageName =
                    button.dataset.package || "";

                const hireSection =
                    $("#hire");

                if (hireSection) {
                    hireSection.scrollIntoView({
                        behavior: "smooth"
                    });
                }

                setTimeout(() => {
                    const details =
                        $("#hireDetails");

                    if (
                        details &&
                        packageName
                    ) {
                        details.value =
                            `I am interested in the ${packageName}. Please provide more information.`;
                        details.focus();
                    }
                }, 500);
            }
        );
    });

    /* =========================================================
       HIRE BUTTONS
    ========================================================= */

    const hireButtons = $$(
        ".hire-btn, .service-btn, .pricing-btn, [data-hire]"
    );

    hireButtons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const hireSection =
                    $("#hire") ||
                    $("#hire-me") ||
                    $("#contact");

                if (hireSection) {
                    hireSection.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }
        );
    });

    /* =========================================================
       HIRE FORM
       
       SUPABASE TABLE:
       hire_requests

       EXPECTED COLUMNS:
       id
       name
       email
       phone
       service
       budget
       project_details
       ========================================================= */

    const hireForm =
        $("#hireForm");

    if (hireForm) {
        hireForm.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                const status =
                    $("#hireStatus") ||
                    hireForm.querySelector(
                        ".form-status"
                    );

                const submitButton =
                    hireForm.querySelector(
                        'button[type="submit"], input[type="submit"]'
                    );

                const name =
                    (
                        $("#hireName")
                            ?.value || ""
                    ).trim();

                const email =
                    (
                        $("#hireEmail")
                            ?.value || ""
                    ).trim();

                const phone =
                    (
                        $("#hirePhone")
                            ?.value || ""
                    ).trim();

                const service =
                    (
                        $("#hireService")
                            ?.value || ""
                    ).trim();

                const budget =
                    (
                        $("#hireBudget")
                            ?.value || ""
                    ).trim();

                /*
                 * FIXED:
                 *
                 * index.html uses:
                 * id="hireDetails"
                 *
                 * So we must read #hireDetails here.
                 */

                const projectDetails =
                    (
                        $("#hireDetails")
                            ?.value || ""
                    ).trim();

                if (
                    !name ||
                    !email ||
                    !service ||
                    !projectDetails
                ) {
                    showStatus(
                        status,
                        "Please fill in all required fields.",
                        "error"
                    );

                    return;
                }

                try {
                    setButtonLoading(
                        submitButton,
                        true,
                        "Submit Project Request"
                    );

                    const payload = {
                        name: name,
                        email: email,
                        phone:
                            phone || null,
                        service: service,
                        budget:
                            budget || null,
                        project_details:
                            projectDetails
                    };

                    await insertRow(
                        "hire_requests",
                        payload
                    );

                    showStatus(
                        status,
                        "Your hire request has been submitted successfully. I will contact you soon.",
                        "success"
                    );

                    hireForm.reset();

                } catch (error) {
                    console.error(
                        "Hire form error:",
                        error
                    );

                    showStatus(
                        status,
                        "Unable to submit your request right now. Please contact me directly on WhatsApp or email.",
                        "error"
                    );

                } finally {
                    setButtonLoading(
                        submitButton,
                        false,
                        "Submit Project Request"
                    );
                }
            }
        );
    }

    /* =========================================================
       CONTACT FORM
       
       SUPABASE TABLE:
       contact_messages

       COLUMNS:
       id
       name
       email
       service
       message
       created_at
       ========================================================= */

    const contactForm =
        $("#contactForm");

    if (contactForm) {
        contactForm.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                const status =
                    $("#contactStatus") ||
                    contactForm.querySelector(
                        ".form-status"
                    );

                const submitButton =
                    contactForm.querySelector(
                        'button[type="submit"], input[type="submit"]'
                    );

                const name =
                    (
                        $("#contactName")
                            ?.value || ""
                    ).trim();

                const email =
                    (
                        $("#contactEmail")
                            ?.value || ""
                    ).trim();

                const service =
                    (
                        $("#contactService")
                            ?.value || ""
                    ).trim();

                const message =
                    (
                        $("#contactMessage")
                            ?.value || ""
                    ).trim();

                if (
                    !name ||
                    !email ||
                    !service ||
                    !message
                ) {
                    showStatus(
                        status,
                        "Please complete all contact fields.",
                        "error"
                    );

                    return;
                }

                try {
                    setButtonLoading(
                        submitButton,
                        true,
                        "Send Message"
                    );

                    const payload = {
                        name: name,
                        email: email,
                        service: service,
                        message: message
                    };

                    await insertRow(
                        "contact_messages",
                        payload
                    );

                    showStatus(
                        status,
                        "Message sent successfully! I will get back to you soon.",
                        "success"
                    );

                    contactForm.reset();

                } catch (error) {
                    console.error(
                        "Contact form error:",
                        error
                    );

                    showStatus(
                        status,
                        "Unable to send your message right now. Please contact me directly.",
                        "error"
                    );

                } finally {
                    setButtonLoading(
                        submitButton,
                        false,
                        "Send Message"
                    );
                }
            }
        );
    }

    /* =========================================================
       REVIEWS FORM
       
       SUPABASE TABLE:
       reviews
       ========================================================= */

    const reviewForm =
        $("#reviewForm");

    if (reviewForm) {
        reviewForm.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                const status =
                    $("#reviewStatus") ||
                    reviewForm.querySelector(
                        ".form-status"
                    );

                const submitButton =
                    reviewForm.querySelector(
                        'button[type="submit"], input[type="submit"]'
                    );

                const name =
                    (
                        $("#reviewName")
                            ?.value || ""
                    ).trim();

                const rating =
                    (
                        $("#reviewRating")
                            ?.value || ""
                    ).trim();

                const message =
                    (
                        $("#reviewMessage")
                            ?.value || ""
                    ).trim();

                if (
                    !name ||
                    !rating ||
                    !message
                ) {
                    showStatus(
                        status,
                        "Please complete your review.",
                        "error"
                    );

                    return;
                }

                try {
                    setButtonLoading(
                        submitButton,
                        true,
                        "Submit Review"
                    );

                    const payload = {
                        name: name,
                        rating: Number(rating),
                        message: message,
                        status: "pending"
                    };

                    await insertRow(
                        "reviews",
                        payload
                    );

                    showStatus(
                        status,
                        "Thank you! Your review has been submitted for approval.",
                        "success"
                    );

                    reviewForm.reset();

                } catch (error) {
                    console.error(
                        "Review form error:",
                        error
                    );

                    showStatus(
                        status,
                        "Unable to submit your review right now.",
                        "error"
                    );

                } finally {
                    setButtonLoading(
                        submitButton,
                        false,
                        "Submit Review"
                    );
                }
            }
        );
    }

    /* =========================================================
       LOAD APPROVED REVIEWS
    ========================================================= */

    async function loadReviews() {
        if (!supabaseClient) {
            return;
        }

        const reviewContainer =
            $("#reviewsList") ||
            $("#reviewsContainer") ||
            $("#reviewsGrid") ||
            $(".reviews-grid");

        if (!reviewContainer) {
            return;
        }

        try {
            const {
                data,
                error
            } = await supabaseClient
                .from("reviews")
                .select(
                    "id, name, rating, message"
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
                );

            if (error) {
                console.error(
                    "Unable to load reviews:",
                    error
                );

                return;
            }

            if (
                !data ||
                data.length === 0
            ) {
                reviewContainer.innerHTML = `
                    <div class="review-loading">
                        No approved reviews yet.
                    </div>
                `;

                return;
            }

            reviewContainer.innerHTML = "";

            data.forEach((review) => {
                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "testimonial-card review-card";

                const rating =
                    Math.max(
                        0,
                        Math.min(
                            5,
                            Number(
                                review.rating
                            ) || 0
                        )
                    );

                const stars =
                    "★".repeat(rating) +
                    "☆".repeat(
                        5 - rating
                    );

                card.innerHTML = `
                    <div class="review-stars">
                        ${stars}
                    </div>

                    <p class="review-message">
                        "${escapeHtml(
                            review.message
                        )}"
                    </p>

                    <h4>
                        ${escapeHtml(
                            review.name
                        )}
                    </h4>
                `;

                reviewContainer.appendChild(
                    card
                );
            });

        } catch (error) {
            console.error(
                "Review loading error:",
                error
            );
        }
    }

    /* =========================================================
       HTML ESCAPE
    ========================================================= */

    function escapeHtml(value) {
        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }

    loadReviews();

    /* =========================================================
       WHATSAPP
       
       Kenyan international format:
       254 + local number without first 0
       
       CURRENT NUMBER:
       0142617814
       
       IMPORTANT:
       014... is not a standard Kenyan mobile prefix.
       The code below preserves the number you supplied.
    ========================================================= */

    const WHATSAPP_NUMBER =
        "254142617814";

    const whatsappMessage =
        "Hello Jay Ouko, I would like to know more about your services.";

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            whatsappMessage
        )}`;

    const whatsappLinks = $$(
        'a[href*="wa.me"], [data-whatsapp]'
    );

    whatsappLinks.forEach((link) => {
        link.setAttribute(
            "href",
            whatsappURL
        );

        link.setAttribute(
            "target",
            "_blank"
        );

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );
    });

    const whatsappButton =
        $("#whatsappButton") ||
        $(".whatsapp-float") ||
        $(".floating-whatsapp") ||
        $(".whatsapp-btn");

    if (whatsappButton) {
        whatsappButton.setAttribute(
            "href",
            whatsappURL
        );

        whatsappButton.setAttribute(
            "target",
            "_blank"
        );

        whatsappButton.setAttribute(
            "rel",
            "noopener noreferrer"
        );
    }

    /* =========================================================
       CALL BUTTON
    ========================================================= */

    const CALL_NUMBER =
        "tel:+254142617814";

    const callLinks = $$(
        'a[href^="tel:"], [data-call]'
    );

    callLinks.forEach((link) => {
        link.setAttribute(
            "href",
            CALL_NUMBER
        );
    });

    /* =========================================================
       CREATE FLOATING WHATSAPP BUTTON IF MISSING
    ========================================================= */

    if (!whatsappButton) {
        const floatingWhatsApp =
            document.createElement("a");

        floatingWhatsApp.href =
            whatsappURL;

        floatingWhatsApp.target =
            "_blank";

        floatingWhatsApp.rel =
            "noopener noreferrer";

        floatingWhatsApp.id =
            "jayFloatingWhatsApp";

        floatingWhatsApp.setAttribute(
            "aria-label",
            "Chat with Jay Ouko on WhatsApp"
        );

        floatingWhatsApp.setAttribute(
            "title",
            "Chat on WhatsApp"
        );

        floatingWhatsApp.innerHTML =
            "💬";

        Object.assign(
            floatingWhatsApp.style,
            {
                position: "fixed",
                right: "20px",
                bottom: "85px",
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#25D366",
                color: "#fff",
                fontSize: "28px",
                textDecoration: "none",
                zIndex: "9999",
                boxShadow:
                    "0 8px 25px rgba(0,0,0,0.25)"
            }
        );

        document.body.appendChild(
            floatingWhatsApp
        );
    }

    /* =========================================================
       BACK TO TOP
    ========================================================= */

    const backToTop =
        $("#backToTop") ||
        $(".back-to-top");

    if (backToTop) {
        window.addEventListener(
            "scroll",
            () => {
                if (
                    window.scrollY > 500
                ) {
                    backToTop.classList.add(
                        "show"
                    );
                } else {
                    backToTop.classList.remove(
                        "show"
                    );
                }
            }
        );

        backToTop.addEventListener(
            "click",
            () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }

    /* =========================================================
       CHATBOT
    ========================================================= */

    const chatToggle =
        $("#chatToggle") ||
        $(".chat-toggle") ||
        $("#chatbotToggle");

    const chatBox =
        $("#chatBox") ||
        $(".chat-box") ||
        $("#chatbot");

    const chatMessages =
        $("#chatMessages") ||
        $(".chat-messages");

    const chatInput =
        $("#chatInput") ||
        $(".chat-input");

    const chatSend =
        $("#chatSend") ||
        $(".chat-send");

    const chatClose =
        $("#chatbotClose");

    function addChatMessage(
        message,
        sender = "bot"
    ) {
        if (!chatMessages) {
            return;
        }

        const bubble =
            document.createElement(
                "div"
            );

        bubble.className =
            `chat-message ${sender}`;

        bubble.textContent =
            message;

        chatMessages.appendChild(
            bubble
        );

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }

    function chatbotReply(message) {
        const text =
            message.toLowerCase();

        if (
            text.includes("hello") ||
            text.includes("hi") ||
            text.includes("hey")
        ) {
            return "Hello! 👋 Welcome to Jay Ouko. How can I help you today?";
        }

        if (
            text.includes("service") ||
            text.includes("services")
        ) {
            return "I offer web development, graphic design, digital marketing, AI tools, freelancing support and online classes.";
        }

        if (
            text.includes("price") ||
            text.includes("pricing") ||
            text.includes("cost")
        ) {
            return "You can view the Pricing section on the website or submit a Hire Request for a project-specific quote.";
        }

        if (
            text.includes("whatsapp") ||
            text.includes("contact")
        ) {
            return "You can contact Jay through WhatsApp or email at emmanuelouko21@gmail.com.";
        }

        if (
            text.includes("email")
        ) {
            return "You can email Jay Ouko at emmanuelouko21@gmail.com.";
        }

        if (
            text.includes("class") ||
            text.includes("classes") ||
            text.includes("course")
        ) {
            return "Free online classes are available daily at 9:00 PM. Check the Classes section for more information.";
        }

        if (
            text.includes("hire") ||
            text.includes("work")
        ) {
            return "Great! Use the Hire Me section to submit your project details and Jay will get back to you.";
        }

        if (
            text.includes("website")
        ) {
            return "Jay offers responsive website development for businesses, personal brands, portfolios and projects.";
        }

        if (
            text.includes("graphic") ||
            text.includes("design")
        ) {
            return "Jay provides graphic design services including posters, social media graphics, branding and promotional materials.";
        }

        return "Thanks for your message! For a detailed response, please use the Hire Me or Contact section.";
    }

    function sendChatMessage() {
        if (!chatInput) {
            return;
        }

        const message =
            chatInput.value.trim();

        if (!message) {
            return;
        }

        addChatMessage(
            message,
            "user"
        );

        chatInput.value = "";

        setTimeout(() => {
            addChatMessage(
                chatbotReply(message),
                "bot"
            );
        }, 500);
    }

    if (
        chatToggle &&
        chatBox
    ) {
        chatToggle.addEventListener(
            "click",
            () => {
                chatBox.classList.toggle(
                    "active"
                );

                chatBox.setAttribute(
                    "aria-hidden",
                    chatBox.classList.contains(
                        "active"
                    )
                        ? "false"
                        : "true"
                );
            }
        );
    }

    if (chatClose && chatBox) {
        chatClose.addEventListener(
            "click",
            () => {
                chatBox.classList.remove(
                    "active"
                );

                chatBox.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        );
    }

    if (chatSend) {
        chatSend.addEventListener(
            "click",
            sendChatMessage
        );
    }

    if (chatInput) {
        chatInput.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Enter"
                ) {
                    event.preventDefault();
                    sendChatMessage();
                }
            }
        );
    }

    /* =========================================================
       EMAIL LINKS
    ========================================================= */

    const emailLinks =
        $$('a[href^="mailto:"]');

    emailLinks.forEach((link) => {
        link.setAttribute(
            "href",
            "mailto:emmanuelouko21@gmail.com"
        );
    });

    /* =========================================================
       FORM UX
    ========================================================= */

    $$("form").forEach((form) => {
        form.addEventListener(
            "submit",
            () => {
                form.classList.add(
                    "submitted"
                );
            }
        );
    });

    /* =========================================================
       STARTUP
    ========================================================= */

    console.log(
        "Jay Ouko website loaded successfully."
    );

    console.log(
        "WhatsApp:",
        whatsappURL
    );

    console.log(
        "Supabase:",
        supabaseClient
            ? "Connected"
            : "Not configured"
    );

})();
