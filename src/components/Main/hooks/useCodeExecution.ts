import { useCFStore } from '../../../zustand/useCFStore';
import { adjustCodeForJudge0 } from '../../../utils/codeAdjustments';

const languageMap: { [key: string]: number } = {
    'java': 62,
    'javascript': 63,
    'cpp': 54,
    'python': 71,
    'kotlin': 78,
};

export const executionState = {
    abortController: null as AbortController | null,
    isExecuting: false,
    reset() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        this.isExecuting = false;
    },
    startNew() {
        this.reset();
        this.abortController = new AbortController();
        this.isExecuting = true;
        return this.abortController;
    }
};

// Status handler
const handleExecutionStatus = (result: any, setErrorMessage: any) => {
    const statusHandlers: any = {
        3: { message: null, getOutput: () => result.stdout ? decodeURIComponent(escape(atob(result.stdout))) : 'No output' },
        4: { message: 'Wrong Answer', getOutput: () => result.stdout ? decodeURIComponent(escape(atob(result.stdout))) : 'No output' },
        5: { message: 'Time Limit Exceeded', getOutput: () => 'Time Limit Exceeded' },
        6: { message: 'Compilation Error', getOutput: () => `Compilation Error: ${result.compile_output ? decodeURIComponent(escape(atob(result.compile_output))).trim() : 'Compilation Error'}` },
        7: { message: 'Memory Limit Exceeded', getOutput: () => 'Memory Limit Exceeded' },
        8: { message: 'Time Limit Exceeded', getOutput: () => 'Time Limit Exceeded' },
        9: { message: 'Output Limit Exceeded', getOutput: () => 'Output Limit Exceeded' },
        10: { message: 'Runtime Error', getOutput: () => `Runtime Error: ${result.stderr ? decodeURIComponent(escape(atob(result.stderr))).trim() : 'Runtime Error'}` },
        11: { message: 'Runtime Error', getOutput: () => decodeURIComponent(escape(atob(result.stderr))).trim() || 'Runtime Error' },
        12: { message: 'Execution Timed Out', getOutput: () => 'Execution Timed Out' }
    };

    const handler = statusHandlers[result.status_id] || { message: 'Unknown Error', getOutput: () => 'Unknown Error' };
    setErrorMessage(handler.message);
    return handler.getOutput();
};

// Time and memory handler
const getTimeAndMemory = (result: any) => {
    if (result.status_id === 3) {
        return {
            time: result.time || '0',
            memory: (result.memory / 1024).toFixed(2) || '0'
        };
    }
    return { time: '0', memory: '0' };
};

export const useCodeExecution = (editor: React.RefObject<any>) => {
    const language = useCFStore(state => state.language);
    const testCases = useCFStore(state => state.testCases);
    const setResults = useCFStore(state => state.setResults);
    const setErrorMessage = useCFStore(state => state.setErrorMessage);
    const setIsRunning = useCFStore(state => state.setIsRunning);
    const setTimeAndMemory = useCFStore(state => state.setTimeAndMemory);

    const resetStates = () => {
        setResults([]);
        setTimeAndMemory([]);
        setErrorMessage(null);
    };

    const setCatchError = (error: any) => {
        if (error.name === 'AbortError') {
            resetStates();
            return;
        }
        setErrorMessage('Execution failed. Please try again.');
        setResults(Array(testCases.length).fill('Execution failed. Please try again.'));
    }

    const createSubmissionPayload = (code: string, input: string) => ({
        language_id: languageMap[language],
        source_code: btoa(adjustCodeForJudge0({ code, language })),
        stdin: btoa(input),
        cpu_time_limit: 2,
    });

    const processResults = async (tokens: string[], apiKey: string) => {
        const controller = executionState.startNew();
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, (language === 'kotlin' ? 6000 : 3000) * testCases.length);
            controller.signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        });

        if (testCases.length > 1) {
            const resultsResponse = await makeJudge0CERequest(
                `submissions/batch?base64_encoded=true&tokens=${tokens.join(',')}&fields=stdout,stderr,status,compile_output,status_id,time,memory`,
                { method: 'GET' },
                apiKey
            );
            return resultsResponse.json();
        } else {
            const resultsResponse = await makeJudge029Request(
                `submissions/${tokens}?base64_encoded=true&fields=*`,
                { method: 'GET' },
                apiKey
            );
            return resultsResponse.json();
        }
    };


    const processResultsAlternate = async (tokens: string[], apiKey: string) => {
        const controller = executionState.startNew();
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, (language === 'kotlin' ? 6000 : 3000) * testCases.length);
            controller.signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        });

        if (testCases.length > 1) {
            const resultsResponse = await makeJudge029Request(
                `submissions/${tokens}?base64_encoded=true&fields=*`,
                { method: 'GET' },
                apiKey
            );
            return resultsResponse.json();

        } else {
            const resultsResponse = await makeJudge0CERequest(
                `submissions/batch?base64_encoded=true&tokens=${tokens.join(',')}&fields=stdout,stderr,status,compile_output,status_id,time,memory`,
                { method: 'GET' },
                apiKey
            );
            return resultsResponse.json();
        }
    };

    // Unified API handlers
    const makeJudge0CERequest = async (endpoint: string, options: any, apiKey: string) => {
        const controller = executionState.startNew();
        return fetch(`https://judge0-ce.p.rapidapi.com/${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                'X-RapidAPI-Key': apiKey
            },
            signal: controller.signal
        });
    };

    const makeJudge029Request = async (endpoint: string, options: any, apiKey: string) => {
        const controller = executionState.startNew();
        return fetch(`https://judge029.p.rapidapi.com/${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                'x-rapidapi-host': 'judge029.p.rapidapi.com',
                'x-rapidapi-key': apiKey
            },
            signal: controller.signal
        });
    };

    const executeCodeCE = async (code: string, apiKey: string) => {
        const submissions = testCases.map(testCase => createSubmissionPayload(code, testCase.Input));

        try {
            const submitResponse = await makeJudge0CERequest('submissions/batch?base64_encoded=true', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissions })
            }, apiKey);

            if (submitResponse.status === 429) {
                await executeJudge0ForCE(code, apiKey);
                return;
            }

            const batchResponse = await submitResponse.json();

            if (!batchResponse || !Array.isArray(batchResponse)) {
                const errorDetail = batchResponse?.error || 'Unknown error';
                setErrorMessage(`Compilation Error`);
                setResults(Array(testCases.length).fill(errorDetail));
                return;
            }

            const tokens = batchResponse.map(submission => submission.token);
            const results = await processResults(tokens, apiKey);

            if (!results?.submissions) {
                setErrorMessage(`Compilation Error`);
                const errorDetail = decodeURIComponent(escape(atob(results?.error))) || 'Compilation Error';
                setResults(Array(testCases.length).fill(errorDetail));
                return;
            }

            const outputResults: string[] = [];
            const timeMemoryResults: { time: string; memory: string }[] = [];

            for (const result of results.submissions) {
                if (!result) continue;
                timeMemoryResults.push(getTimeAndMemory(result));
                outputResults.push(handleExecutionStatus(result, setErrorMessage));
            }

            setResults(outputResults);
            setTimeAndMemory(timeMemoryResults);
        } catch (error: any) {
            setCatchError(error);
        }
    };

    const executeCodeCEForJudge0 = async (code: string, apiKey: string) => {
        const submissions = testCases.map(testCase => createSubmissionPayload(code, testCase.Input));

        try {
            const submitResponse = await makeJudge0CERequest('submissions/batch?base64_encoded=true', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissions })
            }, apiKey);

            if (submitResponse.status === 429) {
                setErrorMessage('Rate limit exceeded');
                setResults(['API rate limit exceeded.']);
                return;
            }

            const batchResponse = await submitResponse.json();

            if (!batchResponse || !Array.isArray(batchResponse)) {
                const errorDetail = batchResponse?.error || 'Unknown error';
                setErrorMessage(`Compilation Error`);
                setResults([errorDetail.repeat(testCases.length)]);
                return;
            }

            const tokens = batchResponse.map(submission => submission.token);
            const results = await processResultsAlternate(tokens, apiKey);

            if (!results?.submissions) {
                setErrorMessage(`Compilation Error`);
                setResults([decodeURIComponent(escape(atob(results?.error))) || 'Compilation Error']);
                return;
            }

            const outputResults: string[] = [];
            const timeMemoryResults: { time: string; memory: string }[] = [];

            for (const result of results.submissions) {
                if (!result) continue;
                timeMemoryResults.push(getTimeAndMemory(result));
                outputResults.push(handleExecutionStatus(result, setErrorMessage));
            }

            setResults(outputResults);
            setTimeAndMemory(timeMemoryResults);
        } catch (error: any) {
            setCatchError(error);
        }
    };

    const executeJudge0 = async (code: string, apiKey: string) => {
        try {
            const submitResponse = await makeJudge029Request('submissions?base64_encoded=true&fields=*', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createSubmissionPayload(code, testCases[0].Input)),
            }, apiKey);

            if (submitResponse.status === 429) {
                await executeCodeCEForJudge0(code, apiKey);
                return;
            }

            const submission = await submitResponse.json();
            if (!submission.token) {
                setErrorMessage('Something went wrong');
                setResults(['Something went wrong']);
                return;
            }

            const result = await processResults(submission.token, apiKey);

            const outputResults: string[] = [];
            const timeMemoryResults: { time: string; memory: string }[] = [];

            timeMemoryResults.push(getTimeAndMemory(result));
            outputResults.push(handleExecutionStatus(result, setErrorMessage));

            setResults(outputResults);
            setTimeAndMemory(timeMemoryResults);

        } catch (error: any) {
            setCatchError(error);
        }
    };

    const executeJudge0ForCE = async (code: string, apiKey: string) => {
        const timeMemoryResults: { time: string, memory: string }[] = [];
        const outputResults: string[] = [];

        try {
            for (const testCase of testCases) {
                const submitResponse = await makeJudge029Request('submissions?base64_encoded=true&fields=*', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createSubmissionPayload(code, testCase.Input))
                }, apiKey);

                if (submitResponse.status === 429) {
                    setErrorMessage('Rate limit exceeded.');
                    outputResults.push('API rate limit exceeded.');
                    continue;
                }

                const submission = await submitResponse.json();

                if (!submission.token) {
                    setErrorMessage('Something went wrong.');
                    outputResults.push('Something went wrong.');
                    continue;
                }
                const result = await processResultsAlternate(submission.token, apiKey);

                timeMemoryResults.push(getTimeAndMemory(result));
                outputResults.push(handleExecutionStatus(result, setErrorMessage));
            }

            setResults(outputResults);
            setTimeAndMemory(timeMemoryResults);
        } catch (error: any) {
            setCatchError(error);
        }
    };

    const executeCode = async (code: string, apiKey: string) => {
        try {
            if (testCases.length > 1) {
                await executeCodeCE(code, apiKey);
            } else {
                await executeJudge0(code, apiKey);
            }
        } catch (error: any) {
            setCatchError(error);
        }
    };

    const runCode = async () => {
        setIsRunning(true);
        setResults([]);
        setErrorMessage(null);
        setTimeAndMemory([]);

        const code = editor.current?.view?.state.doc.toString();
        const apiKey = localStorage.getItem('judge0ApiKey');

        if (!code || !apiKey) {
            setErrorMessage("No code provided or API key missing");
            setIsRunning(false);
            return;
        }

        await executeCode(code, apiKey);

        setIsRunning(false);
    };

    return { runCode };
};