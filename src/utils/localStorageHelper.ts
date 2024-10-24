import {toast} from "sonner";

export const deleteCodesFromLocalStorage = () => {
    try {
        localStorage.removeItem("slugQueue");
        localStorage.removeItem("codeMap");
        toast.success("Codes deleted successfully!");
    } catch (error) {
        toast.error("Failed to delete codes! Please try again later.");
        console.log("Error deleting codes:", error);
    }
};

export const handleSaveTemplate = (editor: any) => {
    const editorValue = editor.current.view?.state.doc.toString();
    localStorage.setItem("template", editorValue);
    toast.success("Configuration saved successfully!");
};
