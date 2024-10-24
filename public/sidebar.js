document.getElementById("submit-code").addEventListener("click", () => {
    const code = document.getElementById("code-input").value;
    chrome.runtime.sendMessage({action: "submitCode", code: code});
});
