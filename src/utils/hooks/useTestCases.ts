import { useCFStore } from '../../zustand/useCFStore';
import { getTestCaseMap } from '../helper';
import { TestCaseArray } from '../../types/types';

export const useTestCases = () => {
    const setTestCases = useCFStore(state => state.setTestCases);

    const requestTestCases = () => {
        chrome.runtime.sendMessage({ requestTestCases: true });
    };

    const loadTestCases = ({ slug }: { slug: string }) => {
        const testCaseMap = getTestCaseMap();
        const oldTestCase: TestCaseArray = testCaseMap.get(slug) || { ErrorMessage: '', testCases: [] };

        if (!oldTestCase.testCases || oldTestCase.testCases.length === 0) {
            requestTestCases();
            return;
        }

        const allEmpty = oldTestCase.testCases.every(testCase =>
            !testCase.Input.trim() && !testCase.ExpectedOutput.trim()
        );

        if (allEmpty) {
            requestTestCases();
            return;
        }

        setTestCases(oldTestCase);
    };

    const setupTestCaseListener = () => {
        const messageListener = (message: any) => {
            if (message.testCase) {
                setTestCases({ErrorMessage: '', testCases: message.testCase});
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    };

    return {
        loadTestCases,
        requestTestCases,
        setupTestCaseListener
    };
};
