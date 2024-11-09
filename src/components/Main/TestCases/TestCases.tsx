import { useEffect, useState } from 'react';
import { TestCase } from '../../../types/types';
import { MAX_TEST_CASES } from '../../../data/constants';
import { useCFStore } from '../../../zustand/useCFStore';
import { CircleX, Plus, Copy, Check, RotateCcw, Terminal, LoaderCircle } from 'lucide-react';
import TestCaseNotAccess from './TestCaseNotAccess';

const TestCases = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const apiKey = useCFStore((state) => state.apiKey);
    const currentSlug = useCFStore((state) => state.currentSlug);
    const results = useCFStore((state) => state.results);
    const setResults = useCFStore((state) => state.setResults);
    const testCases = useCFStore((state) => state.testCases);
    const timeAndMemory = useCFStore((state) => state.timeAndMemory);
    const setTimeAndMemory = useCFStore((state) => state.setTimeAndMemory);
    const setTestCases = useCFStore((state) => state.setTestCases);
    const errorMessage = useCFStore((state) => state.errorMessage);
    const setErrorMessage = useCFStore((state) => state.setErrorMessage);
    const isRunning = useCFStore((state) => state.isRunning);
    const [copied, setCopied] = useState<{ input: boolean, expectedOutput: boolean, output: boolean }>({ input: false, expectedOutput: false, output: false });
    const isAllTestCasesPassed = () => {
        if (!results || results.length === 0 || testCases.length === 0 || results.length !== testCases.length) {
            return false;
        }
        return testCases.length > 0 && testCases.every((testCase, index) =>
            testCase.ExpectedOutput.trim() === results[index].trim()
        );
    };

    const getStatusMessage = () => {
        if (isAllTestCasesPassed()) {
            return (
                <div className="flex items-center gap-2">
                    <div className="text-base font-medium text-green-500">Accepted</div>
                    {timeAndMemory[selectedTab] && (
                        <div className="text-xs text-gray-500">
                            Runtime: {timeAndMemory[selectedTab].time}ms, Memory: {timeAndMemory[selectedTab].memory}KB
                        </div>
                    )}
                </div>
            );
        } else if (errorMessage) {
            return (
                <div className="text-base font-medium text-red-500">
                    {errorMessage.includes('Compilation Error') ? 'Compilation Error' :
                        errorMessage.includes('Time Limit') ? 'Time Limit Exceeded' :
                            errorMessage.includes('Memory Limit') ? 'Memory Limit Exceeded' :
                                errorMessage.includes('Runtime Error') ? 'Runtime Error' :
                                    'Wrong Answer'}
                </div>
            );
        } else if (results.length > 0) {
            return (
                <div className="flex items-center gap-2">
                    <div className="text-base font-medium text-red-500">Wrong Answer</div>
                    {timeAndMemory[selectedTab] && (
                        <div className="text-xs text-gray-500">
                            Runtime: {timeAndMemory[selectedTab].time}ms, Memory: {timeAndMemory[selectedTab].memory}KB
                        </div>
                    )}
                </div>
            )
        }
        return;
    };

    const getTabStyle = (index: number) => {
        const baseStyle = "w-24 px-2 py-1 text-base font-medium rounded-lg transition-colors duration-200 border-b-2";

        const selectedStyle = selectedTab === index
            ? 'bg-gray-300 dark:bg-zinc-800'
            : 'bg-transparent';

        let borderStyle = 'border-transparent';
        if (results[index]) {
            borderStyle = results[index].trim() === testCases[index].ExpectedOutput.trim()
                ? 'border-green-500'
                : 'border-red-500';
        }

        return `${baseStyle} ${selectedStyle} ${borderStyle} text-gray-700 dark:text-gray-300`;
    };

    const handleCopy = async (text: string, type: 'input' | 'expectedOutput' | 'output') => {
        await navigator.clipboard.writeText(text);
        setCopied(prev => ({ ...prev, [type]: true }));
        setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
    };

    useEffect(() => {
        if (selectedTab >= testCases.length) {
            setSelectedTab(Math.max(0, testCases.length - 1));
        }
    }, [testCases.length]);

    const handleInputChange = (index: number, newInput: string) => {
        if (isRunning) return;
        const updatedTestCases = [...testCases];
        updatedTestCases[index].Input = newInput;
        setTestCases(updatedTestCases);
    };

    const handleExpectedOutputChange = (index: number, newOutput: string) => {
        if (isRunning) return;
        const updatedTestCases = [...testCases];
        updatedTestCases[index].ExpectedOutput = newOutput;
        setTestCases(updatedTestCases);
    };

    const addTestCase = () => {
        if (testCases.length < MAX_TEST_CASES) {
            const newTestCase: TestCase = {
                Input: '', ExpectedOutput: '',
                Testcase: testCases.length + 1
            };
            setTestCases([...testCases, newTestCase]);
            setSelectedTab(testCases.length);
        }
    };

    const removeTestCase = (index: number) => {
        const updatedTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(updatedTestCases);

        setSelectedTab((prev) => Math.max(0, prev > index ? prev - 1 : prev));
        // remove results for the removed test case
        const updatedResults = results.filter((_, i) => i !== index);
        setResults(updatedResults);

        // remove time and memory for the removed test case
        const updatedTimeAndMemory = timeAndMemory.filter((_, i) => i !== index);
        setTimeAndMemory(updatedTimeAndMemory);
    };

    const resetTestCases = () => {
        chrome.runtime.sendMessage({ requestTestCases: true });
        setResults([]);
        setTimeAndMemory([]);
        setSelectedTab(0);
        setErrorMessage('');
    };

    return (
        <>
            {!currentSlug || !apiKey ? (
                <TestCaseNotAccess />
            ) : (
                <div className="w-full dark:bg-[#111111] p-4 rounded-md overflow-auto">
                    <div className='w-full flex flex-col gap-2 border-b border-gray-500 text-xl text-black dark:text-white py-2 px-2'>
                        <h2 className="flex justify-between items-center font-[600]">
                            <div className="flex items-center justify-center gap-2">
                                {isRunning ?
                                    <LoaderCircle className="animate-spin w-4 h-4" /> :
                                    <Terminal size={20} color='#227935' />
                                }
                                Test Cases
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={resetTestCases}
                                    className={`text-gray-500 hover:text-gray-600 ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                                    title="Reset test cases"
                                    disabled={isRunning}
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button
                                    onClick={addTestCase}
                                    className={`text-gray-500 hover:text-gray-600 ${testCases.length >= MAX_TEST_CASES || isRunning ? "cursor-not-allowed opacity-50" : ""
                                        }`}
                                    disabled={testCases.length >= MAX_TEST_CASES || isRunning}
                                    title="Add test case"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </h2>
                        {getStatusMessage()}
                    </div>

                    <div className="flex gap-2 mb-2 pr-3 py-3 overflow-x-auto whitespace-nowrap">
                        {testCases.map((_, index) => (
                            <div key={index} className="relative group">
                                <button
                                    onClick={() => setSelectedTab(index)}
                                    className={`w-24 px-2 py-1 text-base font-medium rounded-lg transition-colors duration-200 border-b-2 ${getTabStyle(index)}`}
                                >
                                    Case {index + 1}
                                </button>
                                <button
                                    onClick={() => removeTestCase(index)}
                                    className={`absolute hidden group-hover:flex -top-1.5 -right-1.5 text-xs text-gray-400 hover:text-gray-600 rounded-full w-4 h-4 items-center justify-center ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isRunning}
                                >
                                    <CircleX />
                                </button>
                            </div>
                        ))}
                    </div>

                    {testCases.length > 0 && selectedTab < testCases.length && (
                        <div className="flex flex-col p-2">
                            <div>
                                <div className="relative">
                                    <label className="text-sm text-gray-700 dark:text-gray-300">
                                        <h2 className="text-base font-[600] pb-1">Input</h2>
                                        <textarea
                                            value={testCases[selectedTab].Input}
                                            onChange={(e) => handleInputChange(selectedTab, e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-200"
                                            rows={3}
                                        />
                                    </label>
                                    <button
                                        onClick={() => handleCopy(testCases[selectedTab].Input, 'input')}
                                        className="absolute top-8 right-2 text-gray-400 hover:text-gray-600"
                                    >
                                        {copied.input ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>

                                <div className="relative mt-4">
                                    <label className="text-sm text-gray-700 dark:text-gray-300">
                                        <h2 className="text-base font-[600] pb-1">Expected Output</h2>
                                        <textarea
                                            value={testCases[selectedTab].ExpectedOutput}
                                            onChange={(e) => handleExpectedOutputChange(selectedTab, e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-200"
                                            rows={3}
                                        />
                                    </label>
                                    <button
                                        onClick={() => handleCopy(testCases[selectedTab].ExpectedOutput, 'expectedOutput')}
                                        className="absolute top-8 right-2 text-gray-400 hover:text-gray-600"
                                    >
                                        {copied.expectedOutput ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            {results[selectedTab] && (
                                <div className="mt-4">
                                    <h2 className="text-base font-[600] pb-1 text-zinc-500">Output</h2>
                                    <div className="relative">  {/* Add this wrapper div */}
                                        <div className={`p-2 rounded-md whitespace-pre-wrap ${results[selectedTab].trim() === testCases[selectedTab].ExpectedOutput.trim()
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                            }`}>
                                            {results[selectedTab]}
                                        </div>

                                        <button
                                            onClick={() => handleCopy(results[selectedTab], 'output')}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                        >
                                            {copied.output ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {/* {errorMessage && <p className="text-red-500 mt-2 pl-3">{errorMessage}</p>} */}
                </div>
            )}
        </>
    );
};

export default TestCases;