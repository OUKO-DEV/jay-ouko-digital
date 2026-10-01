(() => {
    "use strict";

    /*
    ============================================================
    JAY OUKO WEBSITE JAVASCRIPT
    ============================================================
    */


    /* ========================================================
       BASIC HELPERS
    ======================================================== */

    const $ = (selector) => {
        return document.querySelector(selector);
    };


    const $$ = (selector) => {
        return Array.from(
            document.querySelectorAll(selector)
        );
    };


    const escapeHtml = (value) => {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };


    const setStatus = (
        element,
        message,
        type = "info"
    ) => {

        if (!element) {
            return;
        }

        element.textContent = message;

        element.className =
            `form-status ${type}`;

    };


    /* ========================================================
       SUPABASE
    ======================================================== */

    let supabaseClient = null;


    function initializeSupabase() {

        try {

            const url =
                window.JAY_SUPABASE_URL;

            const key =
                window.JAY_SUPABASE_KEY;


            if (
                !url ||
                !key
            ) {

                console.warn(
                    "Supabase configuration is missing."
                );

                return;

            }


            if (
                !window.supabase ||
                typeof window.supabase.createClient !==
                "function"
            ) {

                console.error(
                    "Supabase library was not loaded."
                );

                return;

            }


            supabaseClient =
                window.supabase.createClient(
                    url,
                    key
                );


            console.log(
                "Supabase connected successfully."
            );

        } catch (error) {

            console.error(
                "Supabase initialization failed:",
                error
            );

            supabaseClient = null;

        }

    }


    initializeSupabase();


    /* ========================================================
       SUPABASE INSERT HELPER
    ======================================================== */

    async function insertRow(
        table,
        payload
    ) {

        if (!supabaseClient) {

            throw new Error(
                "Supabase is not connected."
            );

        }


        const {
            data,
            error
        } = await supabaseClient
            .from(table)
            .insert(payload)
            .select();


        if (error) {

            console.error(
                `Supabase ${table} error:`,
                error
            );

            throw error;

        }


        return data;

    }


    /* ========================================================
       MOBILE MENU
    ======================================================== */

    const menuToggle =
        $("#menuToggle");

    const navMenu =
        $("#navMenu");


    function closeMobileMenu() {

        if (!navMenu) {
            return;
        }

        navMenu.classList.remove(
            "open"
        );

        menuToggle?.classList.remove(
            "active"
        );

        menuToggle?.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    menuToggle?.addEventListener(
        "click",
        () => {

            if (!navMenu) {
                return;
            }


            const isOpen =
                navMenu.classList.toggle(
                    "open"
                );


            menuToggle.classList.toggle(
                "active",
                isOpen
            );


            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    $$(".nav-link").forEach(
        (link) => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        }
    );


    $(".nav-cta")?.addEventListener(
        "click",
        closeMobileMenu
    );


    /* ========================================================
       THEME TOGGLE
    ======================================================== */

    const themeToggle =
        $("#themeToggle");

    const themeIcon =
        $("#themeIcon");


    function applyTheme(theme) {

        if (theme === "light") {

            document.documentElement
                .classList.add("light-theme");

            if (themeIcon) {
                themeIcon.textContent = "🌙";
            }

        } else {

            document.documentElement
                .classList.remove("light-theme");

            if (themeIcon) {
                themeIcon.textContent = "☀️";
            }

        }

    }


    const savedTheme =
        localStorage.getItem(
            "jay-theme"
        );


    applyTheme(
        savedTheme || "dark"
    );


    themeToggle?.addEventListener(
        "click",
        () => {

            const isLight =
                document.documentElement
                    .classList.contains(
                        "light-theme"
                    );


            const nextTheme =
                isLight
                    ? "dark"
                    : "light";


            applyTheme(nextTheme);


            localStorage.setItem(
                "jay-theme",
                nextTheme
            );

        }
    );


    /* ========================================================
       HEADER SCROLL EFFECT
    ======================================================== */

    const header =
        $("#siteHeader");


    function updateHeader() {

        if (!header) {
            return;
        }


        if (window.scrollY > 30) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    updateHeader();


    /* ========================================================
       ACTIVE NAVIGATION
    ======================================================== */

    const sections =
        $$("main section[id]");

    const navLinks =
        $$(".nav-link");


    if (
        "IntersectionObserver"
        in window
    ) {

        const navObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            const id =
                                entry.target.id;


                            navLinks.forEach(
                                (link) => {

                                    const active =
                                        link.getAttribute(
                                            "href"
                                        ) ===
                                        `#${id}`;


                                    link.classList.toggle(
                                        "active",
                                        active
                                    );

                                }
                            );

                        }
                    );

                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px"
                }
            );


        sections.forEach(
            (section) => {

                navObserver.observe(
                    section
                );

            }
        );

    }


    /* ========================================================
       REVEAL ANIMATIONS
    ======================================================== */

    const revealElements =
        $$(".reveal");


    if (
        "IntersectionObserver"
        in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add(
                                        "visible"
                                    );


                                revealObserver
                                    .unobserve(
                                        entry.target
                                    );

                            }

                        }
                    );

                },
                {
                    threshold: 0.08
                }
            );


        revealElements.forEach(
            (element) => {

                revealObserver.observe(
                    element
                );

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


    /* ========================================================
       FOOTER YEAR
    ======================================================== */

    const footerYear =
        $("#footerYear");


    if (footerYear) {

        footerYear.textContent =
            new Date().getFullYear();

    }


    /* ========================================================
       SERVICE HIRE BUTTONS
    ======================================================== */

    $$(".service-hire").forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const service =
                        button.dataset.service ||
                        "";


                    const serviceSelect =
                        $("#hireService");


                    if (serviceSelect) {

                        serviceSelect.value =
                            service;

                    }


                    $("#hire")?.scrollIntoView(
                        {
                            behavior: "smooth"
                        }
                    );


                    setTimeout(
                        () => {

                            $("#hireName")?.focus();

                        },
                        500
                    );

                }
            );

        }
    );


    /* ========================================================
       PRICING PACKAGE BUTTONS
    ======================================================== */

    $$(".hire-package").forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const packageName =
                        button.dataset.package ||
                        "";


                    const details =
                        $("#hireDetails");


                    if (details) {

                        details.value =
                            `I am interested in the ${packageName}. Please provide more information about what is included and the final price.`;

                    }


                    $("#hire")?.scrollIntoView(
                        {
                            behavior: "smooth"
                        }
                    );


                    setTimeout(
                        () => {

                            $("#hireName")?.focus();

                        },
                        500
                    );

                }
            );

        }
    );


    /* ========================================================
       HIRE FORM
    ======================================================== */

    const hireForm =
        $("#hireForm");


    hireForm?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const status =
                $("#hireStatus");


            const submitButton =
                hireForm.querySelector(
                    'button[type="submit"]'
                );


            const name =
                $("#hireName")
                    ?.value
                    .trim();


            const email =
                $("#hireEmail")
                    ?.value
                    .trim();


            const phone =
                $("#hirePhone")
                    ?.value
                    .trim();


            const service =
                $("#hireService")
                    ?.value;


            const budget =
                $("#hireBudget")
                    ?.value;


            const projectDetails =
                $("#hireDetails")
                    ?.value
                    .trim();


            if (
                !name ||
                !email ||
                !service ||
                !projectDetails
            ) {

                setStatus(
                    status,
                    "Please complete all required fields.",
                    "error"
                );

                return;

            }


            if (
                submitButton
            ) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Submitting...";

            }


            setStatus(
                status,
                "Sending your project request...",
                "loading"
            );


            try {

                /*
                 * IMPORTANT:
                 *
                 * hire_requests currently has:
                 *
                 * id
                 * name
                 * email
                 * phone
                 * service
                 * budget
                 * project_details
                 *
                 * There is NO status column.
                 */

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


                setStatus(
                    status,
                    "Your project request has been submitted successfully. Thank you!",
                    "success"
                );


                hireForm.reset();


            } catch (error) {

                console.error(
                    error
                );


                setStatus(
                    status,
                    "We could not submit your request. Please try again or contact me directly on WhatsApp.",
                    "error"
                );

            } finally {

                if (
                    submitButton
                ) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Project Request";

                }

            }

        }
    );


    /* ========================================================
       CONTACT FORM
    ======================================================== */

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
                    'button[type="submit"]'
                );


            const name =
                $("#contactName")
                    ?.value
                    .trim();


            const email =
                $("#contactEmail")
                    ?.value
                    .trim();


            const subject =
                $("#contactService")
                    ?.value
                    .trim();


            const message =
                $("#contactMessage")
                    ?.value
                    .trim();


            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                setStatus(
                    status,
                    "Please complete all fields.",
                    "error"
                );

                return;

            }


            if (
                submitButton
            ) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Sending...";

            }


            try {

                await insertRow(
                    "contact_messages",
                    {
                        name,
                        email,
                        subject,
                        message
                    }
                );


                setStatus(
                    status,
                    "Your message has been sent successfully.",
                    "success"
                );


                contactForm.reset();


            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                setStatus(
                    status,
                    "Unable to send your message right now. Please contact me directly.",
                    "error"
                );

            } finally {

                if (
                    submitButton
                ) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Send Message";

                }

            }

        }
    );


    /* ========================================================
       REVIEW SUBMISSION
    ======================================================== */

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
                    'button[type="submit"]'
                );


            const name =
                $("#reviewName")
                    ?.value
                    .trim();


            const rating =
                $("#reviewRating")
                    ?.value;


            const message =
                $("#reviewMessage")
                    ?.value
                    .trim();


            if (
                !name ||
                !rating ||
                !message
            ) {

                setStatus(
                    status,
                    "Please complete all review fields.",
                    "error"
                );

                return;

            }


            if (
                submitButton
            ) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Submitting...";

            }


            try {

                await insertRow(
                    "reviews",
                    {
                        name,
                        rating:
                            Number(rating),
                        message,
                        status: "pending"
                    }
                );


                setStatus(
                    status,
                    "Thank you! Your review has been submitted for approval.",
                    "success"
                );


                reviewForm.reset();


            } catch (error) {

                console.error(
                    "Review submission error:",
                    error
                );


                setStatus(
                    status,
                    "We could not submit the review. Please try again.",
                    "error"
                );

            } finally {

                if (
                    submitButton
                ) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Review";

                }

            }

        }
    );


    /* ========================================================
       LOAD APPROVED REVIEWS
    ======================================================== */

    async function loadApprovedReviews() {

        const reviewsList =
            $("#reviewsList");


        if (!reviewsList) {
            return;
        }


        if (!supabaseClient) {

            reviewsList.innerHTML = `
                <div class="review-loading">
                    Reviews are currently unavailable.
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
                throw error;
            }


            if (
                !data ||
                data.length === 0
            ) {

                reviewsList.innerHTML = `
                    <div class="review-empty">
                        <p>No approved reviews yet.</p>
                        <p>Be the first person to leave a review.</p>
                    </div>
                `;

                return;

            }


            reviewsList.innerHTML =
                data
                    .map(
                        (review) => {

                            const rating =
                                Math.min(
                                    5,
                                    Math.max(
                                        1,
                                        Number(
                                            review.rating
                                        ) || 5
                                    )
                                );


                            const stars =
                                "⭐".repeat(
                                    rating
                                );


                            return `
                                <article class="review-card">

                                    <div class="review-stars">
                                        ${stars}
                                    </div>

                                    <p class="review-message">
                                        "${escapeHtml(
                                            review.message
                                        )}"
                                    </p>

                                    <h3>
                                        ${escapeHtml(
                                            review.name
                                        )}
                                    </h3>

                                </article>
                            `;

                        }
                    )
                    .join("");


        } catch (error) {

            console.error(
                "Could not load reviews:",
                error
            );


            reviewsList.innerHTML = `
                <div class="review-empty">
                    <p>
                        Reviews could not be loaded right now.
                    </p>
                </div>
            `;

        }

    }


    $("#refreshReviews")
        ?.addEventListener(
            "click",
            loadApprovedReviews
        );


    /* ========================================================
       BACK TO TOP
    ======================================================== */

    const backToTop =
        $("#backToTop");


    function updateBackToTop() {

        if (!backToTop) {
            return;
        }


        if (
            window.scrollY > 500
        ) {

            backToTop.classList.add(
                "visible"
            );

        } else {

            backToTop.classList.remove(
                "visible"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateBackToTop,
        {
            passive: true
        }
    );


    updateBackToTop();


    backToTop?.addEventListener(
        "click",
        () => {

            window.scrollTo(
                {
                    top: 0,
                    behavior: "smooth"
                }
            );

        }
    );


    /* ========================================================
       CHATBOT
    ======================================================== */

    const chatbot =
        $("#chatbot");

    const chatbotToggle =
        $("#chatbotToggle");

    const chatbotClose =
        $("#chatbotClose");

    const chatInput =
        $("#chatInput");

    const chatSend =
        $("#chatSend");

    const chatMessages =
        $("#chatMessages");


    function openChatbot() {

        if (!chatbot) {
            return;
        }


        chatbot.classList.add(
            "open"
        );


        chatbot.setAttribute(
            "aria-hidden",
            "false"
        );


        setTimeout(
            () => {

                chatInput?.focus();

            },
            100
        );

    }


    function closeChatbot() {

        if (!chatbot) {
            return;
        }


        chatbot.classList.remove(
            "open"
        );


        chatbot.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    chatbotToggle?.addEventListener(
        "click",
        openChatbot
    );


    chatbotClose?.addEventListener(
        "click",
        closeChatbot
    );


    function addChatMessage(
        text,
        sender = "bot"
    ) {

        if (!chatMessages) {
            return;
        }


        const message =
            document.createElement(
                "div"
            );


        message.className =
            sender === "user"
                ? "user-message"
                : "bot-message";


        message.textContent =
            text;


        chatMessages.appendChild(
            message
        );


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    function getBotReply(
        message
    ) {

        const text =
            message
                .toLowerCase()
                .trim();


        if (
            text.includes("price") ||
            text.includes("pricing") ||
            text.includes("cost") ||
            text.includes("how much")
        ) {

            return (
                "My services have flexible pricing. Basic work starts from around KSh 1,500+, professional projects from around KSh 5,000+, and advanced projects from around KSh 10,000+. Submit a project request for an exact quote."
            );

        }


        if (
            text.includes("website") ||
            text.includes("web development")
        ) {

            return (
                "I provide responsive website development for personal brands, businesses, portfolios and online projects."
            );

        }


        if (
            text.includes("design") ||
            text.includes("graphic")
        ) {

            return (
                "I provide graphic design services including social media graphics, promotional materials and digital branding."
            );

        }


        if (
            text.includes("marketing")
        ) {

            return (
                "I provide digital marketing and social media support focused on improving online visibility."
            );

        }


        if (
            text.includes("ai") ||
            text.includes("artificial intelligence")
        ) {

            return (
                "I work with practical AI tools for content creation, productivity and digital workflows."
            );

        }


        if (
            text.includes("class") ||
            text.includes("learn") ||
            text.includes("course")
        ) {

            return (
                "Free online classes are scheduled daily at 9:00 PM. Canva, Twiva and AI-related digital skills are among the topics."
            );

        }


        if (
            text.includes("contact") ||
            text.includes("email")
        ) {

            return (
                "You can contact Jay Ouko at emmanuelouko21@gmail.com or use the contact form on this website."
            );

        }


        if (
            text.includes("whatsapp") ||
            text.includes("phone")
        ) {

            return (
                "You can reach Jay Ouko through WhatsApp using the floating WhatsApp button or the contact section."
            );

        }


        if (
            text.includes("hire") ||
            text.includes("project")
        ) {

            return (
                "To hire me, go to the Hire Me section, complete the project form and submit your request."
            );

        }


        return (
            "I can help you with information about services, pricing, web development, graphic design, digital marketing, AI tools, free classes, hiring or contact details."
        );

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


        chatInput.value =
            "";


        setTimeout(
            () => {

                const reply =
                    getBotReply(
                        message
                    );


                addChatMessage(
                    reply,
                    "bot"
                );

            },
            350
        );

    }


    chatSend?.addEventListener(
        "click",
        sendChatMessage
    );


    chatInput?.addEventListener(
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


    /* ========================================================
       EXTERNAL LINK SAFETY
    ======================================================== */

    $$(
        'a[target="_blank"]'
    ).forEach(
        (link) => {

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        }
    );


    /* ========================================================
       INITIAL DATA
    ======================================================== */

    loadApprovedReviews();


    /* ========================================================
       PAGE READY
    ======================================================== */

    document.documentElement
        .classList
        .add(
            "js-ready"
        );


    console.log(
        "Jay Ouko website initialized successfully."
    );

})();
