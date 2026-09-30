/* =========================================================
   JAY OUKO DIGITAL
   MAIN JAVASCRIPT
========================================================= */

"use strict";


/* =========================
   1. CURRENT YEAR
========================= */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================
   2. SMOOTH NAVIGATION
========================= */

const navigationLinks = document.querySelectorAll(
    'a[href^="#"]'
);

navigationLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================
   3. CONTACT FORM
========================= */

const contactForm = document.querySelector("form");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const message = document.getElementById("message")?.value.trim();

        if (!name || !email || !message) {

            alert("Please complete all the required fields.");

            return;
        }


        const subject = encodeURIComponent(
            "New Project Request from " + name
        );


        const emailBody = encodeURIComponent(
`Hello Jay Ouko,

My name is ${name}.

Email:
${email}

Project details:
${message}

I would like to discuss this project with you.

Thank you.`
        );


        const mailtoLink =
            `mailto:emmanuelouko21@gmail.com?subject=${subject}&body=${emailBody}`;


        window.location.href = mailtoLink;

    });

}


/* =========================
   4. HEADER SCROLL EFFECT
========================= */

const header = document.querySelector("header");

function updateHeader() {

    if (!header) {
        return;
    }

    if (window.scrollY > 50) {

        header.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.25)";

    } else {

        header.style.boxShadow = "none";

    }

}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =========================
   5. ACTIVE NAVIGATION
========================= */

const pageSections = document.querySelectorAll(
    "main section[id]"
);

const navLinks = document.querySelectorAll(
    ".navigation a"
);


function updateActiveLink() {

    let currentSection = "";

    pageSections.forEach(function (section) {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            currentSection = section.id;

        }

    });


    navLinks.forEach(function (link) {

        const href = link.getAttribute("href");

        if (href === "#" + currentSection) {

            link.style.color = "#00d4ff";

        } else {

            link.style.color = "";

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveLink,
    { passive: true }
);

updateActiveLink();


/* =========================
   6. SCROLL REVEAL
========================= */

const cards = document.querySelectorAll(
    "article"
);


const revealObserver =
    new IntersectionObserver(

        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.15
        }

    );


cards.forEach(function (card) {

    card.style.opacity = "0";

    card.style.transform =
        "translateY(25px)";

    card.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

    revealObserver.observe(card);

});


/* =========================
   7. WELCOME MESSAGE
========================= */

console.log(
    "Jay Ouko Digital website loaded successfully."
);
/* =========================
   8. MOBILE MENU
========================= */

const menuToggle =
    document.getElementById("menuToggle");

const navigation =
    document.getElementById("navigation");


if (menuToggle && navigation) {

    menuToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                navigation.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuToggle.textContent =
                isOpen ? "✕" : "☰";

        }
    );


    const mobileLinks =
        navigation.querySelectorAll("a");


    mobileLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                navigation.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.textContent = "☰";

            }
        );

    });

}
