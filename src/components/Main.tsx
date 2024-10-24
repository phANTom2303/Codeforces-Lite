import { useState, useRef, useEffect } from 'react';
import { getCodeMap, getSlug, getSlugQueue, getValueFromLanguage } from '../utils/helper';
import { CodeEntry, MainProps } from '../types/types';
import { SINGLE_CODE_LIMIT_BYTES, STORAGE_LIMIT_BYTES } from '../data/constants';
import { EditorView } from '@uiw/react-codemirror';
import CodeEditor from './CodeEditor';
import TopBar from './TopBar';
import Footer from './Footer';

const Main: React.FC<MainProps> = ({ setShowOptions, theme, tabIndent }) => {
    const [language, setLanguage] = useState<string>(() => localStorage.getItem('preferredLanguage') || 'cpp');
    const [fontSize, setFontSize] = useState<number>(() => parseInt(localStorage.getItem('preferredFontSize') || '16', 10));
    const [currentSlug, setCurrentSlug] = useState<string | null>(null);
    const [totalSize, setTotalSize] = useState<number>(0);

    const accessRestrictionMessage = `/* 
'''
Code Editor Access:
    -> The code editor is available only while solving
         a codeforces problem. Functioanlities are
         disabled on other pages.

    -> To access full functionality,
         Please visit: https://codeforces.com
         and navigate to a problem.

    -> If you find any issues, please feel free
         to report the issue at:
         https://github.com/MaanasSehgal/Codeforces-Lite/issues
'''
*/
`;

    const editor = useRef<any>(null);

    const loadLodeWithCursor = (code: string) => {
        const cursorPosition = code.indexOf('$0');
        let cleanedCode = code.replace(/\$0/g, '');

        editor.current.view?.dispatch({
            changes: { from: 0, to: editor.current.view.state.doc.length, insert: cleanedCode },
        });

        if (cursorPosition !== -1) {
            editor.current.view.focus();
            editor.current.view.dispatch({
                selection: { anchor: cursorPosition },
                scrollIntoView: true,
            });

            editor.current.view.dispatch({
                selection: { anchor: cursorPosition, head: cursorPosition },
                effects: EditorView.scrollIntoView(cursorPosition, { x: "center", y: "center" })
            });
        }
    };

    useEffect(() => {
        const storedQueue = getCodeMap();
        let size = 0;
        storedQueue.forEach(entry => size += entry.size);
        setTotalSize(size);
    }, []);

    useEffect(() => {
        const getCurrentSlug = async () => {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab && tab.url) {
                const newSlug = getSlug(tab.url);
                setCurrentSlug(newSlug);
                if (newSlug) {
                    let codeForUrl = getCodeMap().get(newSlug)?.code || '';
                    codeForUrl = codeForUrl === '' ? localStorage.getItem('template') || '' : codeForUrl;

                    if (editor.current) {
                        loadLodeWithCursor(codeForUrl);
                    }
                } else {
                    if (editor.current) {
                        loadLodeWithCursor(accessRestrictionMessage);
                    }
                }
            }
        };

        setTimeout(() => {
            getCurrentSlug();
        }, 100);

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'Enter') {
                handleClick();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
        const handleTabEvents = async (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
            try {
                if (
                    message.type === 'TAB_SWITCH' ||
                    message.type === 'TAB_UPDATED' ||
                    message.type === 'WINDOW_FOCUSED' ||
                    message.type === 'USER_RETURNED'
                ) {
                    sender;
                    const newUrl = message.url;

                    if (currentSlug) {
                        await saveCodeForSlug(currentSlug);
                    }

                    const newSlug = getSlug(newUrl);
                    setCurrentSlug(newSlug);

                    if (newSlug) {
                        let codeForUrl = getCodeMap().get(newSlug)?.code || '';
                        codeForUrl = codeForUrl === '' ? localStorage.getItem('template') || '' : codeForUrl;

                        if (editor.current) loadLodeWithCursor(codeForUrl);

                    } else if (editor.current) {
                        loadLodeWithCursor(accessRestrictionMessage);
                    }

                    sendResponse({ status: 'success', message: 'Tab event handled successfully' });
                } else {
                    sendResponse({ status: 'error', message: 'Unhandled message type' });
                }
            } catch (error) {
                sendResponse({ status: 'error', message: 'Error handling tab event' });
            }
            return true;
        };

        chrome.runtime.onMessage.addListener(handleTabEvents);

        return () => {
            chrome.runtime.onMessage.removeListener(handleTabEvents);
        };
    }, [currentSlug]);

    const saveCodeForSlug = async (slug: string) => {
        if (editor.current) {
            const editorValue = editor.current.view?.state.doc.toString();
            const size = editorValue?.length || 0;

            if (size > SINGLE_CODE_LIMIT_BYTES) {
                alert("Code size exceeds. Please reduce the size of your code.");
                return;
            }

            const codeMap = getCodeMap();
            const slugQueue = getSlugQueue();

            if (!codeMap.has(slug)) {
                slugQueue.add(slug);
            }

            const oldSize = codeMap.get(slug)?.size || 0;
            let newTotalSize = totalSize - oldSize + size;

            while (newTotalSize > STORAGE_LIMIT_BYTES) {
                const oldSlug = slugQueue.remove();
                if (oldSlug) {
                    const removedSize = codeMap.get(oldSlug)?.size || 0;
                    newTotalSize -= removedSize;
                    codeMap.delete(oldSlug);
                }
            }

            setTotalSize(newTotalSize);
            const cursorPos = editor.current.view?.state.selection.main.from;
            const codeWithCursor = editorValue.slice(0, cursorPos) + "$0" + editorValue.slice(cursorPos);

            const entry: CodeEntry = { code: codeWithCursor!, size };
            codeMap.set(slug, entry);

            localStorage.setItem('codeMap', JSON.stringify(Array.from(codeMap.entries())));
            localStorage.setItem('slugQueue', slugQueue.toJSON());
        }
    };

    const handleClick = async () => {
        if (currentSlug) {
            await saveCodeForSlug(currentSlug);
        }
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
                            const loginButton = document.querySelector('#sidebarSubmitButton') as HTMLInputElement;
                            if (loginButton) {
                                loginButton.click();
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

                        console.log(languageSelect.value);
                        console.log("User selected language value: ", languageValue);
                    } else {
                        console.error('Language select not found!');
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

    const handleResetCode = () => {
        if (!currentSlug) {
            return;
        }
        const temmplateCode = localStorage.getItem('template') || '';
        loadLodeWithCursor(temmplateCode);
    };

    return (
        <>
            <div className='flex flex-col w-full justify-start items-center h-full dark:bg-[#111111]'>
                <TopBar
                    theme={theme}
                    handleClick={handleClick}
                    setShowOptions={setShowOptions}
                    language={language}
                    handleLanguageChange={handleLanguageChange}
                    fontSize={fontSize}
                    handleFontSizeChange={handleFontSizeChange}
                    handleResetCode={handleResetCode}
                    currentSlug={currentSlug}
                />

                <CodeEditor
                    ref={editor}
                    theme={theme}
                    language={language}
                    fontSize={fontSize}
                    tabIndent={tabIndent}
                    currentSlug={currentSlug}
                />

                <Footer />
            </div >
        </>
    );
};

export default Main;
