const currentURL = window.location.href;
let styleElement;

const injectDarkModeCSS = () => {
    styleElement = document.createElement("style");
    styleElement.innerHTML = `
            body {
                background-color: #131313 !important;
                filter: invert(1) hue-rotate(160deg) !important;
            }

            /* for undo filter */
            img, picture, video, iframe, canvas, .legendColorBox, #legend_unordered_list li svg, .welldone {
                filter: invert(1) hue-rotate(-160deg) !important;
            }

            .problems .accepted-problem td.act {
                background-color: #44ff44 !important;
            }

            .problems .rejected-problem td.act {
                background-color: #ffff00 !important
            }

            .red-link {
                filter: invert(0.95) hue-rotate(-160deg) !important;
            }

            .tex-font-style-tt {
                font-weight: 600 !important;
            }

            .user-gray, .user-green, .user-cyan, .user-violet, .user-orange, .user-red, .user-legendary {
                filter: invert(0.95) hue-rotate(-160deg) !important;
            }

            .user-blue {
                filter: invert(0.2) !important;
                color: #0000ff !important;
            }

            .user-legendary span, .user-4000 span {
                filter: invert(0.95) hue-rotate(-160deg) !important;
            }

            table {
                filter: brightness(0.99) !important;
            }

            img[title="Codeforces"], img[alt="ITMO University"] {
                filter: none !important;
            }

            .login-button-custom {
                background-color: #423dc8 !important;
            }

            input, textarea, select {
                background-color: #dadadd !important;
                color: #000000 !important;
                border: none !important;
                border-radius: 4px !important;
                padding-top: 4px !important;
                padding-bottom: 4px !important;
            }

            button {
                background-color: #2a2a2a !important;
                color: #e0e0e0 !important;
                border-color: #555 !important;
            }

            a {
                color: #122a70 !important;
            }

            .menu-list-container a, .second-level-menu-list a {
                color: #000000 !important;
            }

            ::-webkit-scrollbar {
                background: #2a2a2a !important;
            }

            ::-webkit-scrollbar-track {
                background: #2a2a2a;
            }

            ::-webkit-scrollbar-thumb {
                background: #555;
            }

            ::selection {
                background-color: #bb86fc;
                color: #121212;
            }
        `;

    if (document.head) {
        document.head.appendChild(styleElement);
    } else {
        const observer = new MutationObserver(() => {
            if (document.head) {
                document.head.appendChild(styleElement);
                observer.disconnect();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }
}

const sortToggleImgInvert = () => {
    if (!currentURL.includes("codeforces.com/problemset")) {
        return;
    }
    const anchorElements = document.querySelectorAll("a.non-decorated");

    anchorElements.forEach((anchor) => {
        const imgElements = anchor.querySelectorAll("img");

        imgElements[1].classList.add("custom-image");
    });
};

const removeSortToggleImgInvert = () => {
    if (!currentURL.includes("codeforces.com/problemset")) {
        return;
    }
    const anchorElements = document.querySelectorAll("a.non-decorated");

    anchorElements.forEach((anchor) => {
        const imgElements = anchor.querySelectorAll("img");

        imgElements[1].classList.remove("custom-image");
    });
};