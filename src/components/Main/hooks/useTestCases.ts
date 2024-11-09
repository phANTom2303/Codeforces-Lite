import { useCFStore } from '../../../zustand/useCFStore';
import { getTestCaseMap } from '../../../utils/helper';
import { TestCase } from '../../../types/types';

export const useTestCases = () => {
    const setTestCases = useCFStore(state => state.setTestCases);

    const requestTestCases = () => {
        chrome.runtime.sendMessage({ requestTestCases: true });
    };

    const loadTestCases = ({ slug }: { slug: string }) => {
        const testCaseMap = getTestCaseMap();
        const oldTestCase: TestCase[] = testCaseMap.get(slug) || [];

        if (!oldTestCase || oldTestCase.length === 0) {
            requestTestCases();
            return;
        }

        const allEmpty = oldTestCase.every(testCase =>
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
                setTestCases(message.testCase);
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
