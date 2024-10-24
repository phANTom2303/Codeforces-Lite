chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// 1. Handle tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab.url) {
            chrome.runtime.sendMessage({ type: 'TAB_SWITCH', url: tab.url }, (response) => {
                if (chrome.runtime.lastError) {
                    console.log('No receiver for the message or error occurred:', chrome.runtime.lastError.message);
                }
            });
        }
    } catch (error) {
        console.error('Error getting tab info or sending message:', error);
    }
});

// 2. Handle tab URL updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        chrome.runtime.sendMessage({ type: 'TAB_UPDATED', url: changeInfo.url }, (response) => {
            if (chrome.runtime.lastError) {
                console.log('No receiver for the message or error occurred:', chrome.runtime.lastError.message);
            }
        });
    }
});

// 3. Handle window focus changes (e.g., user opens the extension’s UI)
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        // Window is focused
        chrome.windows.get(windowId, { populate: true }, (window) => {
            const tab = window.tabs.find((t) => t.active);
            if (tab.url) {
                chrome.runtime.sendMessage({ type: 'WINDOW_FOCUSED', url: tab.url }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.log('No receiver for the message or error occurred:', chrome.runtime.lastError.message);
                    }
                });
            }
        });
    }
});

// 4. Handle when the extension loses focus (user switches to another application)
chrome.idle.onStateChanged.addListener((newState) => {
    if (newState === 'active') {
        // When the user returns to Chrome (from another app or the OS being idle)
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.runtime.sendMessage({ type: 'USER_RETURNED', url: tabs[0].url }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.log('No receiver for the message or error occurred:', chrome.runtime.lastError.message);
                    }
                });
            }
        });
    }
});
