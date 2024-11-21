// Functions in respective folders
// changeLoginPageUI, changeProblemSetPageUI, removeLoginPageUI, removeProblemSetPageUI-> changeUIFunctions
// injectDarkModeCSS, sortToggleImgInvert, removeSortToggleImgInvert -> darkModeFunctions

chrome.storage.local.get("changeUI").then((result) => {
    if (result.changeUI === "true") {
        document.addEventListener("DOMContentLoaded", () => {
            changeLoginPageUI();
            changeProblemSetPageUI();
        });
    }
});

chrome.storage.local.get("theme").then((result) => {
    if (result.theme === "dark") {
        injectDarkModeCSS();
        sortToggleImgInvert();
    }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.theme) {
        if (changes.theme.newValue === "dark") {
            injectDarkModeCSS();
            sortToggleImgInvert();
        } else {
            if (styleElement) {
                styleElement.remove();
            }
            removeSortToggleImgInvert();
        }
    } else if (areaName === "local" && changes.changeUI) {
        if (changes.changeUI.newValue === "true") {
            changeLoginPageUI();
            changeProblemSetPageUI();
        } else {
            removeChangeLoginPageUI();
            removeChangeProblemSetPageUI();
        }
    }
});
