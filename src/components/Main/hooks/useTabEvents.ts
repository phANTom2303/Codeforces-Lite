import { useCFStore } from '../../../zustand/useCFStore';
import { getSlug, getCodeMap } from '../../../utils/helper';
import { saveCodeForSlug, saveTestCaseForSlug } from '../services/storageService';
import { loadCodeWithCursor } from '../utils/codeHandlers';
import { accessRestrictionMessage } from '../utils/constants';
import { useTestCases } from './useTestCases';
import { executionState } from './useCodeExecution';

export const useTabEvents = () => {
    const currentSlug = useCFStore(state => state.currentSlug);
    const setCurrentSlug = useCFStore(state => state.setCurrentSlug);
    const testCases = useCFStore(state => state.testCases);
    const setIsRunning = useCFStore(state => state.setIsRunning);
    const { loadTestCases } = useTestCases();

    const handleTabEvents = async (
        message: any,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response: any) => void,
        editor: React.RefObject<any>
    ) => {
        try {
            if (
                message.type === 'TAB_SWITCH' ||
                message.type === 'TAB_UPDATED' ||
                message.type === 'WINDOW_FOCUSED' ||
                message.type === 'USER_RETURNED'
            ) {
                const newUrl = message.url;
                executionState.reset();
                setIsRunning(false);

                if (currentSlug) {
                    await saveCodeForSlug(currentSlug, editor, useCFStore.getState().totalSize, useCFStore.getState().setTotalSize);
                    if (testCases && testCases.testCases.length > 0) {
                        await saveTestCaseForSlug(currentSlug, testCases);
                    }
                }

                const newSlug = getSlug(newUrl);
                setCurrentSlug(newSlug);

                if (newSlug) {
                    let codeForUrl = getCodeMap().get(newSlug)?.code || '';
                    codeForUrl = codeForUrl === '' ? localStorage.getItem('template') || '' : codeForUrl;

                    if (editor.current) {
                        loadCodeWithCursor(editor.current, codeForUrl);
                    }
                    loadTestCases({ slug: newSlug });
                } else if (editor.current) {
                    loadCodeWithCursor(editor.current, accessRestrictionMessage);
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
    return { handleTabEvents };
};
