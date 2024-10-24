import {javascript} from "@codemirror/lang-javascript";
import {python} from "@codemirror/lang-python";
import {java} from "@codemirror/lang-java";
import {cpp} from "@codemirror/lang-cpp";
import {CodeEntry} from "../types/types";
import {Queue} from "./Queue";

export const getCodeMap = (): Map<string, CodeEntry> => {
    const storedCodeMap = localStorage.getItem("codeMap");
    return storedCodeMap ? new Map<string, CodeEntry>(JSON.parse(storedCodeMap)) : new Map<string, CodeEntry>();
};

export const getSlugQueue = (): Queue<string> => {
    const storedQueue = localStorage.getItem("slugQueue");
    return storedQueue ? Queue.fromJSON<string>(JSON.parse(storedQueue)) : new Queue<string>();
};

export const getValueFromLanguage = (language: string) => {
    switch (language) {
        case "cpp":
            return "89";
        case "java":
            return "87";
        case "python":
            return "31";
        case "javascript":
            return "34";
        case "kotlin":
            return "88";
        default:
            return "89";
    }
};

export const getLanguageExtension = (language: string) => {
    switch (language) {
        case "javascript":
            return javascript({jsx: true});
        case "python":
            return python();
        case "java":
            return java();
        case "cpp":
            return cpp();
        default:
            return cpp();
    }
};

export const getSlug = (problemUrl: string): string | null => {
    try {
        const url = new URL(problemUrl);
        url.search = ""; // Clear query params
        const hostname = url.hostname;
        let match: RegExpMatchArray | null;

        switch (hostname) {
            case "codeforces.com":
            case "www.codeforces.com":
                // Handle both problemset and contest URLs
                match = url.toString().match(/\/problemset\/problem\/([0-9]+)\/([^\/]+)|\/contest\/([0-9]+)\/problem\/([^\/]+)/);

                if (match) {
                    if (match[1] && match[2]) {
                        // /problemset/problem/2030/A
                        return `${match[1]}/${match[2]}`;
                    } else if (match[3] && match[4]) {
                        // /contest/2030/problem/A
                        return `${match[3]}/${match[4]}`;
                    }
                }
                return null;
            default:
                return null;
        }
    } catch (error) {
        console.error("Invalid URL or error occurred:", error);
        return null;
    }
};
