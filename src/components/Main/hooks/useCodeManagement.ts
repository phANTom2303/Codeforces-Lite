
import { useCFStore } from '../../../zustand/useCFStore';
import { getValueFromLanguage } from '../../../utils/helper';
import { loadCodeWithCursor } from '../utils/codeHandlers';

export const useCodeManagement = (editor: React.RefObject<any>) => {
    const setLanguage = useCFStore(state => state.setLanguage);
    const setFontSize = useCFStore(state => state.setFontSize);
    const currentSlug = useCFStore(state => state.currentSlug);

    const handleResetCode = () => {
        if (!currentSlug) {
            return;
        }
        const temmplateCode = localStorage.getItem('template') || '';
        loadCodeWithCursor(editor.current, temmplateCode);
    };

    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const editorValue = editor.current?.view?.state?.doc?.toString();
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage);
        localStorage.setItem('preferredLanguage', selectedLanguage);

        const languageValue = getValueFromLanguage(selectedLanguage);

        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id! },
                func: (languageValue) => {
                    const languageSelect = document.querySelector('select[name="programTypeId"]') as HTMLSelectElement;
                    if (languageSelect) {
                        languageSelect.value = languageValue;
                        const event = new Event('change', { bubbles: true });
                        languageSelect.dispatchEvent(event);
                    }
                },
                args: [languageValue],
            },
            () => chrome.runtime.lastError
        );

        setTimeout(() => {
            editor.current.view?.dispatch({
                changes: { from: 0, to: editor.current.view.state.doc.length, insert: editorValue },
            });
        }, 100);
    };

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const editorValue = editor.current?.view?.state?.doc?.toString();
        const selectedFontSize = parseInt(e.target.value, 10);
        setFontSize(selectedFontSize);
        localStorage.setItem('preferredFontSize', selectedFontSize.toString());

        setTimeout(() => {
            editor.current.view?.dispatch({
                changes: { from: 0, to: editor.current.view.state.doc.length, insert: editorValue },
            });
        }, 100);
    };

    const handleRedirectToLatestSubmission = async () => {
        if (!currentSlug) {
            return;
        }
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id! },
                func: () => {
                    const anchor = document.querySelector('.roundbox.sidebox .rtable tbody tr td a') as HTMLAnchorElement;
                    if(!anchor) {
                        alert('No submission found');
                        return;
                    }
                    if (anchor) {
                        window.location.href = anchor.href;
                    }
                },
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                }
            }
        );
    };


    return {
        handleResetCode,
        handleLanguageChange,
        handleFontSizeChange,
        handleRedirectToLatestSubmission
    };
};