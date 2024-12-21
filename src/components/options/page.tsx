import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { handleSaveTemplate } from "../../utils/localStorageHelper";
import { getLanguageExtension } from "../../utils/helper";
import { useEffect, useRef, useState } from "react";
import { indentUnit } from "@codemirror/language";
import { SettingsProps } from "../../types/types";
import { Toaster } from "sonner";
import Footer from "../global/Footer";
import CodeMirror from '@uiw/react-codemirror';
import DeleteCodesConfirmationPopup from "../global/popups/DeleteCodesConfirmationPopup";
import SettingsTopBar from "./ui/SettingsTopBar";
import Options from './ui/Options';
import ApiSettings from '../global/ApiSettings';


const Settings: React.FC<SettingsProps> = ({ setShowOptions, theme, setTheme, tabIndent, setTabIndent }) => {
    const editor = useRef<any>(null);
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'cpp';
    const preferredFontSize = localStorage.getItem('preferredFontSize') || '16';
    const [changeUI, setChangeUI] = useState(localStorage.getItem('changeUI') || 'true');
    const [openConfirmationPopup, setOpenConfirmationPopup] = useState<boolean>(false);

    useEffect(() => {
        const templateCode = localStorage.getItem('template');
        setTimeout(() => {
            editor.current.view?.dispatch({
                changes: { from: 0, to: editor.current.view.state.doc.length, insert: templateCode || '' },
            });
        }, 100);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        chrome.storage.local.set({ theme: theme });
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        chrome.storage.local.set({ changeUI: changeUI });
        localStorage.setItem('changeUI', changeUI);
    }, [changeUI]);

    const handleTabIndent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1 && value <= 10) {
            setTabIndent(value);
            localStorage.setItem('tabIndent', value.toString());
        }
    };

    return (
        <>
            <DeleteCodesConfirmationPopup
                openConfirmationPopup={openConfirmationPopup}
                setOpenConfirmationPopup={setOpenConfirmationPopup}
            />

            <div className="Settings-container w-full h-full flex flex-col items-center justify-center dark:bg-[#111111]">
                <Toaster closeButton richColors position="top-center" />
                <SettingsTopBar theme={theme} setShowOptions={setShowOptions} />

                <div className="w-full h-full overflow-y-auto px-4">
                    <Options
                        theme={theme}
                        setTheme={setTheme}
                        changeUI={changeUI}
                        setChangeUI={setChangeUI}
                        tabIndent={tabIndent}
                        setOpenConfirmationPopup={setOpenConfirmationPopup}
                        handleTabIndent={handleTabIndent}
                    />
                    <ApiSettings />
                    <div className="w-full flex flex-col items-center gap-2 border-t-2 border-zinc-800">
                        <div className="self-center text-base text-zinc-700 font-semibold mt-2 dark:text-zinc-200 flex justify-between w-full max-w-[400px]">
                            <div className="flex flex-col gap-1">
                                <p>Set your default template</p>
                                <p className="text-[8px] font-semibold text-gray-900 dark:text-gray-300 pr-4">Use symbol <span className="font-[500] px-2 rounded-md bg-gray-300 dark:bg-gray-600">$0</span> to set your default cursor position in template.</p>
                            </div>
                            <button onClick={() => handleSaveTemplate(editor)} className="h-1/2 bg-green-500 text-white text-sm px-2 py-1 font-bold rounded-lg hover:bg-green-600 transition duration-200">
                                Save
                            </button>
                        </div>
                        <div className="text-left h-auto mt-2 mb-20 w-full">
                            <CodeMirror
                                ref={editor}
                                className="mono-font border-zinc-500 border-2"
                                theme={theme === 'light' ? githubLight : githubDark}
                                height="70vh"
                                width="100%"
                                extensions={[getLanguageExtension(preferredLanguage), indentUnit.of(" ".repeat(tabIndent))]}
                                style={{ fontSize: `${preferredFontSize}px` }}
                            />
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Settings;
