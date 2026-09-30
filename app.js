/* =========================================================
   JAY OUKO DIGITAL
   COMPLETE WEBSITE JAVASCRIPT
========================================================= */

"use strict";


/* =========================
   LOADER
========================= */

window.addEventListener("load", function () {

    const loader =
        document.getElementById("loader");

    if (loader) {

        setTimeout(function () {

            loader.classList.add("hidden");

        }, 500);

    }

});


/* =========================
   ELEMENTS
========================= */

const body =
    document.body;

const header =
    document.getElementById("header");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

const themeToggle =
    document.getElementById("themeToggle");

const backToTop =
    document.getElementById("backToTop");


/* =========================
   MOBILE MENU
========================= */

if (menuToggle && navMenu) {

    menuToggle.addEventListener(
        "click",
        function () {

            const opened =
                navMenu.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                opened ? "true" : "false"
            );

            menuToggle.innerHTML =
                opened
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';

            body.classList.toggle(
                "menu-open",
                opened
            );

        }
    );


    document
        .querySelectorAll(".nav-link")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    navMenu.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuToggle.innerHTML =
                        '<i class="fa-solid fa-bars"></i>';

                    body.classList.remove(
                        "menu-open"
                    );

                }
            );

        });

}


/* =========================
   THEME
========================= */

const savedTheme =
    localStorage.getItem("jayOukoTheme");


if (savedTheme === "light") {

    body.classList.add("light");

}


function updateThemeIcon() {

    if (!themeToggle) return;

    const icon =
        themeToggle.querySelector("i");

    if (!icon) return;


    if (body.classList.contains("light")) {

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
        function () {

            body.classList.toggle("light");

            const theme =
                body.classList.contains("light")
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


/* =========================
   HEADER SCROLL
========================= */

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


/* =========================
   SMOOTH LINKS
========================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

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


/* =========================
   ACTIVE NAVIGATION
========================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


function updateActiveNav() {

    let current = "";

    sections.forEach(function (section) {

        const top =
            section.offsetTop - 160;

        const bottom =
            top + section.offsetHeight;

        if (
            window.scrollY >= top &&
            window.scrollY < bottom
        ) {

            current = section.id;

        }

    });


    navLinks.forEach(function (link) {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + current
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNav,
    { passive: true }
);

updateActiveNav();


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            function (entries, obs) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add("show");

                            obs.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        function (element) {

            observer.observe(element);

        }
    );

} else {

    revealElements.forEach(
        function (element) {

            element.classList.add("show");

        }
    );

}


/* =========================
   COUNTERS
========================= */

const counters =
    document.querySelectorAll(
        "[data-count]"
    );


if (
    "IntersectionObserver" in window &&
    counters.length
) {

    const counterObserver =
        new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(
                    function (entry) {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        const element =
                            entry.target;

                        const target =
                            Number(
                                element.dataset.count
                            );

                        let current = 0;

                        const duration = 1200;

                        const start =
                            performance.now();


                        function animate(time) {

                            const progress =
                                Math.min(
                                    (
                                        time - start
                                    ) / duration,
                                    1
                                );

                            current =
                                Math.floor(
                                    progress *
                                    target
                                );

                            element.textContent =
                                current;

                            if (progress < 1) {

                                requestAnimationFrame(
                                    animate
                                );

                            } else {

                                element.textContent =
                                    target;

                            }

                        }

                        requestAnimationFrame(
                            animate
                        );

                        observer.unobserve(
                            element
                        );

                    }
                );

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(
        function (counter) {

            counterObserver.observe(counter);

        }
    );

}


/* =========================
   BACK TO TOP
========================= */

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
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================
   SERVICE HIRE BUTTONS
========================= */

document
    .querySelectorAll(".service-hire")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const service =
                    button.dataset.service ||
                    "Digital Service";

                const subject =
                    encodeURIComponent(
                        "Project enquiry - " +
                        service
                    );

                const body =
                    encodeURIComponent(
`Hello Jay Ouko,

I am interested in your ${service} service.

I would like to discuss my project with you.

Thank you.`
                    );

                window.location.href =
                    "mailto:emmanuelouko21@gmail.com" +
                    "?subject=" +
                    subject +
                    "&body=" +
                    body;

            }
        );

    });


/* =========================
   PRICING BUTTONS
========================= */

document
    .querySelectorAll(".hire-package")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const packageName =
                    button.dataset.package ||
                    "Custom Package";

                const subject =
                    encodeURIComponent(
                        packageName +
                        " package enquiry"
                    );

                const body =
                    encodeURIComponent(
`Hello Jay Ouko,

I am interested in your ${packageName} package.

I would like to discuss my project and requirements.

Thank you.`
                    );

                window.location.href =
                    "mailto:emmanuelouko21@gmail.com" +
                    "?subject=" +
                    subject +
                    "&body=" +
                    body;

            }
        );

    });


/* =========================
   CONTACT FORM
========================= */

const contactForm =
    document.getElementById(
        "contactForm"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "contactName"
                ).value.trim();

            const email =
                document.getElementById(
                    "contactEmail"
                ).value.trim();

            const service =
                document.getElementById(
                    "contactService"
                ).value;

            const message =
                document.getElementById(
                    "contactMessage"
                ).value.trim();


            if (
                !name ||
                !email ||
                !message
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            const subject =
                encodeURIComponent(
                    "Website enquiry - " +
                    service
                );


            const body =
                encodeURIComponent(
`Hello Jay Ouko,

Name: ${name}

Email: ${email}

Service:
${service}

Project details:
${message}

I would like to discuss this project with you.

Thank you.`
                );


            const mailto =
                "mailto:emmanuelouko21@gmail.com" +
                "?subject=" +
                subject +
                "&body=" +
                body;


            const status =
                document.getElementById(
                    "contactStatus"
                );


            if (status) {

                status.textContent =
                    "Opening your email application...";

            }


            window.location.href =
                mailto;

        }
    );

}


/* =========================
   REVIEWS
========================= */

const reviewForm =
    document.getElementById(
        "reviewForm"
    );

const reviewsList =
    document.getElementById(
        "reviewsList"
    );

const reviewStatus =
    document.getElementById(
        "reviewStatus"
    );


function getReviews() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "jayOukoReviews"
            )
        ) || [];

    } catch (error) {

        return [];

    }

}


function saveReviews(reviews) {

    localStorage.setItem(
        "jayOukoReviews",
        JSON.stringify(reviews)
    );

}


function displayReviews() {

    if (!reviewsList) return;

    const reviews =
        getReviews();


    if (!reviews.length) {

        reviewsList.innerHTML =
            `
            <div class="empty-reviews">
                No reviews yet.
                Be the first to leave one.
            </div>
            `;

        return;

    }


    reviewsList.innerHTML = "";


    reviews
        .slice()
        .reverse()
        .forEach(function (review) {

            const item =
                document.createElement(
                    "article"
                );

            item.className =
                "review-item";


            const header =
                document.createElement(
                    "div"
                );

            header.className =
                "review-header";


            const name =
                document.createElement(
                    "strong"
                );

            name.textContent =
                review.name;


            const stars =
                document.createElement(
                    "span"
                );

            stars.className =
                "review-stars";

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


            item.appendChild(header);

            item.appendChild(message);

            reviewsList.appendChild(item);

        });

}


displayReviews();


if (reviewForm) {

    reviewForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "reviewName"
                ).value.trim();

            const rating =
                document.getElementById(
                    "reviewRating"
                ).value;

            const message =
                document.getElementById(
                    "reviewMessage"
                ).value.trim();


            if (
                !name ||
                !rating ||
                !message
            ) {

                reviewStatus.textContent =
                    "Please complete all fields.";

                return;

            }


            const reviews =
                getReviews();


            reviews.push({

                name: name,

                rating: rating,

                message: message,

                date:
                    new Date()
                    .toISOString()

            });


            saveReviews(reviews);

            displayReviews();

            reviewForm.reset();


            reviewStatus.textContent =
                "Thank you! Your review has been added.";


            setTimeout(
                function () {

                    reviewStatus.textContent =
                        "";

                },
                4000
            );

        }
    );

}


/* =========================
   CHATBOT
========================= */

const chatbotToggle =
    document.getElementById(
        "chatbotToggle"
    );

const chatbotWindow =
    document.getElementById(
        "chatbotWindow"
    );

const chatbotClose =
    document.getElementById(
        "chatbotClose"
    );

const chatbotForm =
    document.getElementById(
        "chatbotForm"
    );

const chatbotInput =
    document.getElementById(
        "chatbotInput"
    );

const chatbotMessages =
    document.getElementById(
        "chatbotMessages"
    );


if (chatbotToggle) {

    chatbotToggle.addEventListener(
        "click",
        function () {

            chatbotWindow.classList.toggle(
                "open"
            );

        }
    );

}


if (chatbotClose) {

    chatbotClose.addEventListener(
        "click",
        function () {

            chatbotWindow.classList.remove(
                "open"
            );

        }
    );

}


/* =========================
   CHATBOT ANSWERS
========================= */

function chatbotReply(message) {

    const text =
        message.toLowerCase();


    if (
        text.includes("price") ||
        text.includes("pricing") ||
        text.includes("cost")
    ) {

        return "My packages start from KSh 2,500. Check the Pricing section for the available packages, or contact me for a custom quotation.";

    }


    if (
        text.includes("website") ||
        text.includes("web")
    ) {

        return "I offer responsive websites, portfolio websites, business websites and landing pages.";

    }


    if (
        text.includes("design") ||
        text.includes("logo") ||
        text.includes("graphic")
    ) {

        return "I offer graphic design services including promotional graphics, social media designs and digital branding.";

    }


    if (
        text.includes("marketing") ||
        text.includes("social media")
    ) {

        return "I can help with digital marketing, social media content and online promotion.";

    }


    if (
        text.includes("ai") ||
        text.includes("artificial intelligence")
    ) {

        return "I work with AI tools for productivity, content creation, automation and digital workflows.";

    }


    if (
        text.includes("hire") ||
        text.includes("contact") ||
        text.includes("work")
    ) {

        return "You can hire Jay through the contact form, email at emmanuelouko21@gmail.com, or WhatsApp.";

    }


    if (
        text.includes("class") ||
        text.includes("course") ||
        text.includes("learn")
    ) {

        return "Free online classes are scheduled daily at 9:00 PM through TikTok. Check the Classes section.";

    }


    return "Thanks for your message. You can ask me about services, pricing, websites, design, marketing, AI, classes or how to hire Jay.";

}


/* =========================
   ADD CHAT MESSAGE
========================= */

function addChatMessage(
    message,
    type
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


/* =========================
   CHATBOT FORM
========================= */

if (chatbotForm) {

    chatbotForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const message =
                chatbotInput.value.trim();


            if (!message) return;


            addChatMessage(
                message,
                "user"
            );


            chatbotInput.value = "";


            setTimeout(
                function () {

                    addChatMessage(
                        chatbotReply(message),
                        "bot"
                    );

                },
                400
            );

        }
    );

}


/* =========================
   QUICK CHAT BUTTONS
========================= */

document
    .querySelectorAll(
        ".quick-actions button"
    )
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const question =
                    button.dataset.question;


                addChatMessage(
                    question,
                    "user"
                );


                setTimeout(
                    function () {

                        addChatMessage(
                            chatbotReply(
                                question
                            ),
                            "bot"
                        );

                    },
                    300
                );

            }
        );

    });


/* =========================
   CLOSE CHAT WHEN CLICKING
   OUTSIDE
========================= */

document.addEventListener(
    "click",
    function (event) {

        if (!chatbotWindow) return;

        const chatbot =
            document.querySelector(
                ".chatbot"
            );


        if (
            chatbotWindow.classList.contains(
                "open"
            ) &&
            chatbot &&
            !chatbot.contains(
                event.target
            )
        ) {

            chatbotWindow.classList.remove(
                "open"
            );

        }

    }
);


/* =========================
   ONLINE STATUS
========================= */

window.addEventListener(
    "online",
    function () {

        console.log(
            "Internet connection restored."
        );

    }
);

window.addEventListener(
    "offline",
    function () {

        console.log(
            "Internet connection lost."
        );

    }
);


/* =========================
   FINISHED
========================= */

console.log(
    "%cJay Ouko Digital loaded successfully.",
    "font-size:16px;font-weight:bold;"
);
