import { create } from "zustand";
import { TestCaseArray } from "../types/types";

interface CFStoreInterface {
    language: string;
    fontSize: number;
    currentSlug: string | null;
    totalSize: number;
    testCases: TestCaseArray;
    isRunning: boolean;
    isSubmitting: boolean;
    apiKey: string;

    // Actions
    setLanguage: (language: string) => void;
    setFontSize: (size: number) => void;
    setCurrentSlug: (slug: string | null) => void;
    setTotalSize: (size: number) => void;
    setTestCases: (testCases: TestCaseArray) => void;
    setIsRunning: (running: boolean) => void;
    setIsSubmitting: (submitting: boolean) => void;
    setApiKey: (key: string) => void;
}

export const useCFStore = create<CFStoreInterface>((set) => ({
    // Initial State
    language: localStorage.getItem('preferredLanguage') || 'cpp', // Initialize from localStorage or default to 'cpp'
    fontSize: parseInt(localStorage.getItem('preferredFontSize') || '16', 10),
    currentSlug: null,
    totalSize: 0,
    testCases: {ErrorMessage: '', testCases: []},
    isRunning: false,
    isSubmitting: false,
    apiKey: localStorage.getItem('judge0ApiKey') || '',

    // Actions
    setLanguage: (language) => set({ language }),
    setFontSize: (size) => set({ fontSize: size }),
    setCurrentSlug: (slug) => set({ currentSlug: slug }),
    setTotalSize: (size) => set({ totalSize: size }),
    setTestCases: (testCases) => set({ testCases }),
    setIsRunning: (running) => set({ isRunning: running }),
    setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
    setApiKey: (key) => set({ apiKey: key }),
}));
