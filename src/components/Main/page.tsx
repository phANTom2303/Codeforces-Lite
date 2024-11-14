
import { useRef, useEffect } from 'react';
import { useCFStore } from '../../zustand/useCFStore';
import { getCodeMap, getSlug } from '../../utils/helper';
import CodeEditor from '../editor/CodeEditor';
import TopBar from '../editor/TopBar';
import TestCases from './TestCases/TestCases';
import { ResizablePanel } from '../ResizablePanel';
import { useCodeExecution } from './hooks/useCodeExecution';
import { useCodeManagement } from './hooks/useCodeManagement';
import { useTestCases } from './hooks/useTestCases';
import { useTabEvents } from './hooks/useTabEvents';
import { handleSubmission } from './services/submissionService';
import { initializeStorage } from './services/storageService';
import { loadCodeWithCursor } from './utils/codeHandlers';
import { accessRestrictionMessage } from './utils/constants';

interface MainProps {
    setShowOptions: (show: boolean) => void;
    theme: string;
    tabIndent: number;
}

const Main: React.FC<MainProps> = ({ setShowOptions, theme, tabIndent }) => {
    const editor = useRef<any>(null);

    // Zustand store hooks
    const {
        language,
        fontSize,
        currentSlug,
        setCurrentSlug,
        setTotalSize,
        testCases,
        isRunning,
        isSubmitting,
        setIsSubmitting
    } = useCFStore();

    // Custom hooks
    const { runCode } = useCodeExecution(editor);
    const { handleResetCode, handleLanguageChange, handleFontSizeChange } = useCodeManagement(editor);
    const { loadTestCases, setupTestCaseListener } = useTestCases();
    const { handleTabEvents } = useTabEvents();

    useEffect(() => {
        setTimeout(() => {
            setIsSubmitting(false);
        }, 3000);
    }, [isSubmitting, currentSlug]);

    useEffect(() => {
        const cleanup = setupTestCaseListener();
        const size = initializeStorage();
        setTotalSize(size);
        return cleanup;
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

                    loadCodeWithCursor(editor.current, codeForUrl);
                    loadTestCases({ slug: newSlug });
                } else {
                    loadCodeWithCursor(editor.current, accessRestrictionMessage);
                }
            }
        };


        setTimeout(() => {
            getCurrentSlug();
        }, 100);

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'Enter') {
                handleSubmission(editor, setIsSubmitting);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
        const handleRunCode = async (event: KeyboardEvent) => {
            if (isRunning) return;
            if (event.ctrlKey && event.key === "'") {
                await runCode();
            }
        }

        document.addEventListener('keydown', handleRunCode);
        return () => document.removeEventListener('keydown', handleRunCode);
    }, [runCode]);

    useEffect(() => {
        const listener = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
            return handleTabEvents(message, sender, sendResponse, editor);
        };
        chrome.runtime.onMessage.addListener(listener);
        return () => {
            chrome.runtime.onMessage.removeListener(listener);
        };
    }, [currentSlug, testCases]);
    return (
        <div className='flex flex-col w-full justify-start items-center h-full dark:bg-[#111111]'>
            <TopBar
                theme={theme as "light" | "dark"}
                handleClick={() => handleSubmission(editor, setIsSubmitting)}
                setShowOptions={setShowOptions}
                language={language}
                handleLanguageChange={handleLanguageChange}
                fontSize={fontSize}
                handleFontSizeChange={handleFontSizeChange}
                handleResetCode={handleResetCode}
                currentSlug={currentSlug}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                runCode={runCode}
                testCases={testCases}
            />

            <div className="w-full h-[calc(100vh-88px)]">
                <ResizablePanel
                    top={
                        <CodeEditor
                            ref={editor}
                            theme={theme as "light" | "dark"}
                            language={language}
                            fontSize={fontSize}
                            tabIndent={tabIndent}
                            currentSlug={currentSlug}
                        />
                    }
                    bottom={<TestCases />}
                    initialHeight={70}
                />
            </div>
        </div>
    );
};
export default Main;
