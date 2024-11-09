
export const handleSubmission = async (editor: React.RefObject<any>) => {
    const editorValue = editor.current?.view?.state?.doc?.toString();
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id! },
            func: (code) => {
                const blob = new Blob([code], { type: 'text/plain' });
                const file = new File([blob], 'solution.txt', { type: 'text/plain' });

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                const fileInput = document.querySelector('input[type="file"][name="sourceFile"]') as HTMLInputElement;

                if (fileInput) {
                    fileInput.files = dataTransfer.files;
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);

                    setTimeout(() => {
                        const submitButton = document.querySelector('#sidebarSubmitButton') as HTMLInputElement;
                        if (submitButton) {
                            submitButton.click();
                        } else {
                            alert('Submit button not found!');
                        }
                    }, 200);
                } else {
                    alert('File input not found!');
                }
            },
            args: [editorValue],
        },
        () => chrome.runtime.lastError
    );
};
