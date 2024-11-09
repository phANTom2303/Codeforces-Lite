import { create } from "zustand";
import { TestCase } from "../types/types";

interface CFStoreInterface {
    language: string;
    fontSize: number;
    currentSlug: string | null;
    totalSize: number;
    testCases: TestCase[];
    results: string[];
    isRunning: boolean;
    errorMessage: string | null;
    apiKey: string;
    timeAndMemory: { time: string; memory: string }[];

    // Actions
    setLanguage: (language: string) => void;
    setFontSize: (size: number) => void;
    setCurrentSlug: (slug: string | null) => void;
    setTotalSize: (size: number) => void;
    setTestCases: (cases: TestCase[]) => void;
    setResults: (results: string[]) => void;
    setIsRunning: (running: boolean) => void;
    setErrorMessage: (message: string | null) => void;
    setApiKey: (key: string) => void;
    setTimeAndMemory: (timeAndMemory: { time: string; memory: string }[]) => void;
}

export const useCFStore = create<CFStoreInterface>((set) => ({
    // Initial State
    language: localStorage.getItem('preferredLanguage') || 'cpp', // Initialize from localStorage or default to 'cpp'
    fontSize: parseInt(localStorage.getItem('preferredFontSize') || '16', 10),
    currentSlug: null,
    totalSize: 0,
    testCases: [],
    results: [],
    isRunning: false,
    errorMessage: null,
    apiKey: localStorage.getItem('judge0ApiKey') || '',
    timeAndMemory: [],

    // Actions
    setLanguage: (language) => set({ language }),
    setFontSize: (size) => set({ fontSize: size }),
    setCurrentSlug: (slug) => set({ currentSlug: slug }),
    setTotalSize: (size) => set({ totalSize: size }),
    setTestCases: (cases) => set({ testCases: cases }),
    setResults: (results) => set({ results }),
    setIsRunning: (running) => set({ isRunning: running }),
    setErrorMessage: (message) => set({ errorMessage: message }),
    setApiKey: (key) => set({ apiKey: key }),
    setTimeAndMemory: (timeAndMemory) => set({ timeAndMemory }),
}));
