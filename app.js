"use strict";
/* EMERGENCY LOADER FIX */
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");

    if (loader) {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        loader.style.pointerEvents = "none";

        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});
/* =========================================================
   JAY OUKO WEBSITE
========================================================= */

/* =========================================================
   REMOVE LOADING SCREEN SAFELY
========================================================= */

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (loader) {
        loader.classList.add("hidden");

        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.pointerEvents = "none";
            loader.style.display = "none";
        }, 500);
    }
});


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://slusgnhkjcnuitqcmwag.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_QEbq0RoIxbrW5HgmNelWZg_h3FWaMVL";

let supabaseClient = null;

if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {

    try {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );

        console.log(
            "Supabase initialized successfully."
        );

    } catch (error) {

        console.error(
            "Supabase initialization error:",
            error
        );
    }

} else {

    console.error(
        "Supabase library was not loaded."
    );
}


/* =========================================================
   BASIC ELEMENTS
========================================================= */

const body = document.body;
const header = document.querySelector(".header");
const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");
const themeToggle = document.querySelector("#themeToggle");
const backToTop = document.querySelector("#backToTop");

/* =========================================================
   BASIC ELEMENTS
========================================================= */

const body = document.body;
const header = document.querySelector(".header");
const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");
const themeToggle = document.querySelector("#themeToggle");
const backToTop = document.querySelector("#backToTop");




/* =========================================================
   MOBILE MENU
========================================================= */

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navMenu.classList.toggle("open");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        body.classList.toggle("menu-open", isOpen);

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.className = isOpen
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";
        }
    });


    navMenu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("open");

            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            body.classList.remove("menu-open");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.className = "fa-solid fa-bars";
            }
        });

    });
}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") return;

    if (navMenu) {
        navMenu.classList.remove("open");
    }

    if (menuToggle) {

        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.className = "fa-solid fa-bars";
        }
    }

    body.classList.remove("menu-open");
});


/* =========================================================
   HEADER SCROLL
========================================================= */

function updateHeader() {

    if (!header) return;

    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =========================================================
   DARK / LIGHT MODE
========================================================= */

const savedTheme =
    localStorage.getItem("jayOukoTheme");

if (savedTheme === "light") {
    body.classList.add("light-theme");
}


function updateThemeIcon() {

    if (!themeToggle) return;

    const icon =
        themeToggle.querySelector("i");

    if (!icon) return;

    if (body.classList.contains("light-theme")) {

        icon.className =
            "fa-solid fa-moon";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    } else {

        icon.className =
            "fa-solid fa-sun";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );
    }
}

updateThemeIcon();


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            body.classList.toggle(
                "light-theme"
            );

            const theme =
                body.classList.contains("light-theme")
                    ? "light"
                    : "dark";

            localStorage.setItem(
                "jayOukoTheme",
                theme
            );

            updateThemeIcon();
        }
    );
}


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(link => {

    link.addEventListener(
        "click",
        event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;

            const position =
                target.offsetTop -
                headerHeight;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });
        }
    );
});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );

const navigationLinks =
    document.querySelectorAll(
        ".nav-link"
    );


function updateActiveNavigation() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 160;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
                sectionTop + sectionHeight
        ) {
            currentSection =
                section.id;
        }
    });


    navigationLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {
            link.classList.add("active");
        }
    });
}


window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

updateActiveNavigation();


/* =========================================================
   BACK TO TOP
========================================================= */

function updateBackToTop() {

    if (!backToTop) return;

    if (window.scrollY > 500) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
}

window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
);

updateBackToTop();


if (backToTop) {

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
   TYPING EFFECT
========================================================= */

const typingElement =
    document.querySelector(
        ".typing-text"
    );

const typingWords = [
    "Web Developer",
    "Freelancer",
    "Graphic Designer",
    "Digital Marketer",
    "AI Tools Creator"
];

let wordIndex = 0;
let characterIndex = 0;
let deleting = false;


function typingEffect() {

    if (!typingElement) return;

    const word =
        typingWords[wordIndex];

    if (!deleting) {
        characterIndex++;
    } else {
        characterIndex--;
    }

    typingElement.textContent =
        word.substring(
            0,
            characterIndex
        );

    let speed =
        deleting ? 55 : 90;

    if (
        !deleting &&
        characterIndex === word.length
    ) {

        speed = 1500;

        deleting = true;
    }


    if (
        deleting &&
        characterIndex === 0
    ) {

        deleting = false;

        wordIndex =
            (wordIndex + 1) %
            typingWords.length;

        speed = 400;
    }


    setTimeout(
        typingEffect,
        speed
    );
}

typingEffect();


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );

if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "revealed"
                        );

                        observer.unobserve(
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
        element =>
            revealObserver.observe(element)
    );

} else {

    revealElements.forEach(
        element =>
            element.classList.add(
                "revealed"
            )
    );
}


/* =========================================================
   COUNTERS
========================================================= */

const counters =
    document.querySelectorAll(
        "[data-count]"
    );


function animateCounter(element) {

    const target =
        Number(element.dataset.count);

    const duration = 1600;

    const startTime =
        performance.now();


    function updateCounter(time) {

        const elapsed =
            time - startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        element.textContent =
            Math.floor(
                eased * target
            );


        if (progress < 1) {

            requestAnimationFrame(
                updateCounter
            );

        } else {

            element.textContent =
                target;
        }
    }


    requestAnimationFrame(
        updateCounter
    );
}


if (
    counters.length &&
    "IntersectionObserver" in window
) {

    const counterObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        animateCounter(
                            entry.target
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }
                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(
        counter =>
            counterObserver.observe(
                counter
            )
    );
}


/* =========================================================
   SUPABASE HELPER
========================================================= */

function showStatus(
    element,
    message,
    type = "success"
) {

    if (!element) return;

    element.textContent = message;

    element.className =
        type === "error"
            ? "form-error"
            : "form-success";
}


/* =========================================================
   HIRE ME SERVICE BUTTONS
========================================================= */

const serviceButtons =
    document.querySelectorAll(
        ".service-hire"
    );


serviceButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const service =
                button.dataset.service ||
                "Digital Service";

            const contact =
                document.querySelector(
                    "#contact"
                );

            if (contact) {

                contact.scrollIntoView({
                    behavior: "smooth"
                });
            }


            const serviceSelect =
                document.querySelector(
                    "#contactService"
                );

            if (serviceSelect) {

                serviceSelect.value =
                    service;
            }

        }
    );
});


/* =========================================================
   PRICING BUTTONS
========================================================= */

const packageButtons =
    document.querySelectorAll(
        ".hire-package"
    );


packageButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const packageName =
                button.dataset.package ||
                "Custom Package";

            const contact =
                document.querySelector(
                    "#contact"
                );

            if (contact) {

                contact.scrollIntoView({
                    behavior: "smooth"
                });
            }


            const message =
                document.querySelector(
                    "#contactMessage"
                );

            if (message) {

                message.value =
`Hello Jay Ouko,

I am interested in the ${packageName} package.

I would like to discuss my project, requirements and final price.

Thank you.`;
            }

        }
    );
});


/* =========================================================
   CONTACT FORM → SUPABASE
========================================================= */

const contactForm =
    document.querySelector(
        "#contactForm"
    );

const contactStatus =
    document.querySelector(
        "#contactStatus"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document.querySelector(
                    "#contactName"
                )?.value.trim();


            const email =
                document.querySelector(
                    "#contactEmail"
                )?.value.trim();


            const subject =
                document.querySelector(
                    "#contactService"
                )?.value ||
                "General enquiry";


            const message =
                document.querySelector(
                    "#contactMessage"
                )?.value.trim();


            if (
                !name ||
                !email ||
                !message
            ) {

                showStatus(
                    contactStatus,
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            showStatus(
                contactStatus,
                "Sending your message..."
            );


            try {

                const { error } =
                    await supabaseClient
                        .from(
                            "contact_messages"
                        )
                        .insert([
                            {
                                name: name,
                                email: email,
                                subject: subject,
                                message: message,
                                status: "unread"
                            }
                        ]);


                if (error) {
                    throw error;
                }


                showStatus(
                    contactStatus,
                    "Message sent successfully. Jay will review it shortly."
                );


                contactForm.reset();


            } catch (error) {

                console.error(
                    "Contact error:",
                    error
                );


                showStatus(
                    contactStatus,
                    "We could not send your message. Please try again or contact Jay directly.",
                    "error"
                );
            }

        }
    );
}


/* =========================================================
   HIRE REQUEST FORM
========================================================= */

function createHireForm() {

    if (
        document.querySelector(
            "#hireRequestForm"
        )
    ) return;


    const contactSection =
        document.querySelector(
            "#contact"
        );

    if (!contactSection) return;


    const contactForm =
        document.querySelector(
            "#contactForm"
        );

    if (!contactForm) return;


    const form =
        document.createElement(
            "form"
        );


    form.id =
        "hireRequestForm";

    form.className =
        "hire-request-form reveal";


    form.innerHTML = `

        <h3>Hire Me Directly</h3>

        <p>
            Send your project details and
            I will review your request.
        </p>

        <input
            type="text"
            id="hireName"
            placeholder="Your name"
            required
        >

        <input
            type="email"
            id="hireEmail"
            placeholder="Your email"
            required
        >

        <input
            type="tel"
            id="hirePhone"
            placeholder="Phone / WhatsApp number"
        >

        <select id="hireService" required>

            <option value="">
                Select a service
            </option>

            <option value="Web Development">
                Web Development
            </option>

            <option value="Graphic Design">
                Graphic Design
            </option>

            <option value="Digital Marketing">
                Digital Marketing
            </option>

            <option value="AI Tools">
                AI Tools
            </option>

        </select>

        <select id="hireBudget">

            <option value="">
                Select budget
            </option>

            <option value="KSh 2,500">
                KSh 2,500
            </option>

            <option value="KSh 5,000">
                KSh 5,000
            </option>

            <option value="KSh 10,000+">
                KSh 10,000+
            </option>

            <option value="Custom budget">
                Custom budget
            </option>

        </select>

        <textarea
            id="hireDetails"
            rows="6"
            placeholder="Describe your project..."
            required
        ></textarea>

        <button
            type="submit"
            class="btn btn-primary">

            <i class="fa-solid fa-briefcase"></i>

            Submit Hire Request

        </button>

        <p id="hireStatus"></p>
    `;


    contactSection
        .querySelector(".container")
        .appendChild(form);


    form.addEventListener(
        "submit",
        submitHireRequest
    );
}


async function submitHireRequest(event) {

    event.preventDefault();


    const status =
        document.querySelector(
            "#hireStatus"
        );


    const name =
        document.querySelector(
            "#hireName"
        )?.value.trim();


    const email =
        document.querySelector(
            "#hireEmail"
        )?.value.trim();


    const phone =
        document.querySelector(
            "#hirePhone"
        )?.value.trim();


    const service =
        document.querySelector(
            "#hireService"
        )?.value;


    const budget =
        document.querySelector(
            "#hireBudget"
        )?.value;


    const projectDetails =
        document.querySelector(
            "#hireDetails"
        )?.value.trim();


    if (
        !name ||
        !email ||
        !service ||
        !projectDetails
    ) {

        showStatus(
            status,
            "Please complete the required fields.",
            "error"
        );

        return;
    }


    showStatus(
        status,
        "Submitting your hire request..."
    );


    try {

        const { error } =
            await supabaseClient
                .from(
                    "hire_requests"
                )
                .insert([
                    {
                        name: name,
                        email: email,
                        phone: phone,
                        service: service,
                        budget: budget,
                        project_details:
                            projectDetails,
                        status: "pending"
                    }
                ]);


        if (error) {
            throw error;
        }


        showStatus(
            status,
            "Hire request submitted successfully. Jay will review it soon."
        );


        document
            .querySelector(
                "#hireRequestForm"
            )
            .reset();


    } catch (error) {

        console.error(
            "Hire request error:",
            error
        );


        showStatus(
            status,
            "Could not submit the hire request. Please try again.",
            "error"
        );
    }
}


createHireForm();


/* =========================================================
   REVIEWS → SUPABASE
========================================================= */

const reviewForm =
    document.querySelector(
        "#reviewForm"
    );

const reviewStatus =
    document.querySelector(
        "#reviewStatus"
    );

const reviewsList =
    document.querySelector(
        "#reviewsList"
    );


if (reviewForm) {

    reviewForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document.querySelector(
                    "#reviewName"
                )?.value.trim();


            const rating =
                Number(
                    document.querySelector(
                        "#reviewRating"
                    )?.value
                );


            const message =
                document.querySelector(
                    "#reviewMessage"
                )?.value.trim();


            if (
                !name ||
                !rating ||
                !message
            ) {

                showStatus(
                    reviewStatus,
                    "Please complete all review fields.",
                    "error"
                );

                return;
            }


            showStatus(
                reviewStatus,
                "Submitting your review..."
            );


            try {

                const { error } =
                    await supabaseClient
                        .from(
                            "reviews"
                        )
                        .insert([
                            {
                                name: name,
                                rating: rating,
                                message: message,
                                status: "pending"
                            }
                        ]);


                if (error) {
                    throw error;
                }


                showStatus(
                    reviewStatus,
                    "Thank you! Your review has been submitted for approval."
                );


                reviewForm.reset();


            } catch (error) {

                console.error(
                    "Review error:",
                    error
                );


                showStatus(
                    reviewStatus,
                    "Could not submit your review. Please try again.",
                    "error"
                );
            }

        }
    );
}


/* =========================================================
   LOAD APPROVED REVIEWS
========================================================= */

async function loadApprovedReviews() {

    if (!reviewsList) return;


    try {

        const { data, error } =
            await supabaseClient
                .from("reviews")
                .select(
                    "name, rating, message, created_at"
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


        reviewsList.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            reviewsList.innerHTML = `
                <div class="empty-reviews">
                    No approved reviews yet.
                    Be the first to leave one.
                </div>
            `;

            return;
        }


        data.forEach(review => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "review-item";


            const header =
                document.createElement(
                    "div"
                );

            header.className =
                "review-item-header";


            const name =
                document.createElement(
                    "strong"
                );

            name.className =
                "review-item-name";

            name.textContent =
                review.name;


            const stars =
                document.createElement(
                    "span"
                );

            stars.className =
                "review-item-stars";

            stars.textContent =
                "★".repeat(
                    Number(review.rating)
                );


            header.appendChild(name);

            header.appendChild(stars);


            const message =
                document.createElement(
                    "p"
                );

            message.textContent =
                review.message;


            card.appendChild(header);

            card.appendChild(message);


            reviewsList.appendChild(card);
        });


    } catch (error) {

        console.error(
            "Review loading error:",
            error
        );

        reviewsList.innerHTML = `
            <div class="empty-reviews">
                Reviews are temporarily unavailable.
            </div>
        `;
    }
}


loadApprovedReviews();


/* =========================================================
   ONLINE CLASS REGISTRATION
========================================================= */

function createRegistrationForm() {

    const classesSection =
        document.querySelector(
            "#classes"
        );

    if (!classesSection) return;


    if (
        document.querySelector(
            "#registrationForm"
        )
    ) return;


    const timeBox =
        classesSection.querySelector(
            ".class-time"
        );


    if (!timeBox) return;


    const form =
        document.createElement(
            "form"
        );


    form.id =
        "registrationForm";

    form.className =
        "registration-form reveal";


    form.innerHTML = `

        <h3>Register for Free Classes</h3>

        <p>
            Register to receive information
            about the online sessions.
        </p>

        <input
            type="text"
            id="registrationName"
            placeholder="Your name"
            required
        >

        <input
            type="email"
            id="registrationEmail"
            placeholder="Your email"
            required
        >

        <input
            type="tel"
            id="registrationPhone"
            placeholder="Phone / WhatsApp number"
        >

        <select
            id="registrationProgram"
            required>

            <option value="">
                Choose a program
            </option>

            <option value="Digital Skills">
                Digital Skills
            </option>

            <option value="Canva">
                Canva
            </option>

            <option value="Twiva & Online Work">
                Twiva & Online Work
            </option>

        </select>

        <textarea
            id="registrationMessage"
            rows="4"
            placeholder="Anything you would like to learn?"
        ></textarea>

        <button
            type="submit"
            class="btn btn-primary">

            Register Free

        </button>

        <p id="registrationStatus"></p>

    `;


    timeBox.insertAdjacentElement(
        "afterend",
        form
    );


    form.addEventListener(
        "submit",
        submitRegistration
    );
}


async function submitRegistration(event) {

    event.preventDefault();


    const status =
        document.querySelector(
            "#registrationStatus"
        );


    const name =
        document.querySelector(
            "#registrationName"
        )?.value.trim();


    const email =
        document.querySelector(
            "#registrationEmail"
        )?.value.trim();


    const phone =
        document.querySelector(
            "#registrationPhone"
        )?.value.trim();


    const program =
        document.querySelector(
            "#registrationProgram"
        )?.value;


    const message =
        document.querySelector(
            "#registrationMessage"
        )?.value.trim();


    if (
        !name ||
        !email ||
        !program
    ) {

        showStatus(
            status,
            "Please complete the required fields.",
            "error"
        );

        return;
    }


    showStatus(
        status,
        "Submitting your registration..."
    );


    try {

        const { error } =
            await supabaseClient
                .from(
                    "registrations"
                )
                .insert([
                    {
                        name: name,
                        email: email,
                        phone: phone,
                        program: program,
                        message: message,
                        status: "pending"
                    }
                ]);


        if (error) {
            throw error;
        }


        showStatus(
            status,
            "Registration received! Jay will review it and contact you."
        );


        document
            .querySelector(
                "#registrationForm"
            )
            .reset();


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        showStatus(
            status,
            "Registration could not be submitted. Please try again.",
            "error"
        );
    }
}


createRegistrationForm();


/* =========================================================
   CHATBOT
========================================================= */

const chatbot =
    document.querySelector(
        ".chatbot"
    );

const chatbotToggle =
    document.querySelector(
        "#chatbotToggle"
    );

const chatbotClose =
    document.querySelector(
        "#chatbotClose"
    );

const chatbotForm =
    document.querySelector(
        "#chatbotForm"
    );

const chatbotInput =
    document.querySelector(
        "#chatbotInput"
    );

const chatbotMessages =
    document.querySelector(
        "#chatbotMessages"
    );


function openChatbot() {

    if (!chatbot) return;

    chatbot.classList.add(
        "open"
    );
}


function closeChatbot() {

    if (!chatbot) return;

    chatbot.classList.remove(
        "open"
    );
}


if (chatbotToggle) {

    chatbotToggle.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            chatbot.classList.toggle(
                "open"
            );
        }
    );
}


if (chatbotClose) {

    chatbotClose.addEventListener(
        "click",
        closeChatbot
    );
}


document.addEventListener(
    "click",
    event => {

        if (!chatbot) return;

        if (
            chatbot.classList.contains(
                "open"
            ) &&
            !chatbot.contains(
                event.target
            )
        ) {
            closeChatbot();
        }
    }
);


/* =========================================================
   CHATBOT ANSWERS
========================================================= */

const chatbotReplies = [

    {
        keywords: [
            "price",
            "pricing",
            "cost",
            "charge",
            "how much"
        ],

        response:
            "Jay offers different packages starting from KSh 2,500. The final price depends on the project requirements."
    },

    {
        keywords: [
            "website",
            "web",
            "site"
        ],

        response:
            "Jay can create responsive portfolio, business and landing-page websites."
    },

    {
        keywords: [
            "graphic",
            "design",
            "logo"
        ],

        response:
            "Graphic design services include social media graphics, promotional designs and digital branding."
    },

    {
        keywords: [
            "marketing",
            "digital marketing",
            "social media"
        ],

        response:
            "Jay provides digital marketing and social-media support for online promotion."
    },

    {
        keywords: [
            "ai",
            "artificial intelligence",
            "automation"
        ],

        response:
            "Jay works with AI tools for productivity, content creation, automation and digital workflows."
    },

    {
        keywords: [
            "contact",
            "email",
            "hire",
            "work"
        ],

        response:
            "You can contact Jay at emmanuelouko21@gmail.com or submit a contact or hire request on this website."
    },

    {
        keywords: [
            "class",
            "classes",
            "course",
            "training"
        ],

        response:
            "Free online classes are available daily at 9:00 PM through TikTok. You can register using the registration form."
    },

    {
        keywords: [
            "whatsapp",
            "phone"
        ],

        response:
            "You can contact Jay through WhatsApp using the floating WhatsApp button on the website."
    }

];


function getChatbotReply(message) {

    const lower =
        message.toLowerCase();


    for (
        const item of chatbotReplies
    ) {

        const matched =
            item.keywords.some(
                keyword =>
                    lower.includes(
                        keyword
                    )
            );


        if (matched) {
            return item.response;
        }
    }


    return (
        "Thanks for your message. " +
        "For a specific project or quotation, " +
        "please use the Hire Me or Contact section."
    );
}


function addChatMessage(
    message,
    type = "bot"
) {

    if (!chatbotMessages) return;


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        type === "user"
            ? "user-message"
            : "bot-message";


    if (type === "bot") {

        const icon =
            document.createElement(
                "div"
            );

        icon.className =
            "message-icon";

        icon.innerHTML =
            '<i class="fa-solid fa-robot"></i>';

        wrapper.appendChild(icon);
    }


    const paragraph =
        document.createElement(
            "p"
        );

    paragraph.textContent =
        message;


    wrapper.appendChild(
        paragraph
    );


    chatbotMessages.appendChild(
        wrapper
    );


    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;
}


if (chatbotForm) {

    chatbotForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const message =
                chatbotInput?.value.trim();


            if (!message) return;


            addChatMessage(
                message,
                "user"
            );


            chatbotInput.value = "";


            setTimeout(
                () => {

                    addChatMessage(
                        getChatbotReply(
                            message
                        ),
                        "bot"
                    );

                },
                400
            );
        }
    );
}


/* =========================================================
   CHATBOT QUICK ACTIONS
========================================================= */

document.querySelectorAll(
    ".quick-actions button, .chatbot-quick-actions button"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const question =
                button.dataset.question ||
                button.textContent.trim();


            addChatMessage(
                question,
                "user"
            );


            setTimeout(
                () => {

                    addChatMessage(
                        getChatbotReply(
                            question
                        ),
                        "bot"
                    );

                },
                400
            );
        }
    );
});


/* =========================================================
   WHATSAPP
========================================================= */

document.querySelectorAll(
    'a[href*="wa.me"]'
).forEach(link => {

    link.addEventListener(
        "click",
        () => {

            console.log(
                "WhatsApp contact opened."
            );

        }
    );
});


/* =========================================================
   ONLINE STATUS
========================================================= */

function updateOnlineStatus() {

    const status =
        document.querySelector(
            ".status-badge"
        );

    if (!status) return;


    const text =
        status.querySelector(
            "span:last-child"
        );


    if (!text) return;


    text.textContent =
        navigator.onLine
            ? "Available for freelance work"
            : "Currently offline";
}


window.addEventListener(
    "online",
    updateOnlineStatus
);

window.addEventListener(
    "offline",
    updateOnlineStatus
);

updateOnlineStatus();


/* =========================================================
   IMAGE OPTIMIZATION
========================================================= */

document.querySelectorAll(
    "img"
).forEach(image => {

    if (
        !image.hasAttribute(
            "loading"
        )
    ) {
        image.setAttribute(
            "loading",
            "lazy"
        );
    }
});


/* =========================================================
   EXTERNAL LINKS SECURITY
========================================================= */

document.querySelectorAll(
    'a[target="_blank"]'
).forEach(link => {

    const existingRel =
        link.getAttribute(
            "rel"
        ) || "";


    if (
        !existingRel.includes(
            "noopener"
        )
    ) {

        link.setAttribute(
            "rel",
            `${existingRel} noopener noreferrer`
                .trim()
        );
    }
});


/* =========================================================
   FOOTER YEAR
========================================================= */

const year =
    document.querySelector(
        "#year"
    );

if (year) {
    year.textContent =
        new Date().getFullYear();
}


/* =========================================================
   FORM VALIDATION
========================================================= */

document.querySelectorAll(
    "form"
).forEach(form => {

    form.addEventListener(
        "invalid",
        () => {

            form.classList.add(
                "has-error"
            );

        },
        true
    );
});


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "%cJay Ouko Portfolio loaded successfully.",
    "font-size:16px;font-weight:bold;"
);

console.log(
    "Supabase connection enabled."
);

console.log(
    "Website: Jay Ouko | Freelancing & Digital Services"
);
```
