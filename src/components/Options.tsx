import { CircleCheck, CircleX, Moon, SunMedium, Trash2 } from "lucide-react";
import { OptionsProps } from "../types/types";
import Option from './Option';

const Options = ({ theme, setTheme, changeUI, setChangeUI, tabIndent, setOpenConfirmationPopup, handleTabIndent }: OptionsProps) => {
    return (
        <div className="w-full flex flex-wrap justify-evenly items-center gap-x-10 max-w-[1200px] mt-4 mx-auto">
            <Option title="Appearance">
                <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#333333] hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-200 flex justify-center items-center">
                    {theme === 'light' ? <Moon color="#111111" /> : <SunMedium color="#ffffff" />}
                </button>
            </Option>
            <Option title="Change UI">
                <button onClick={() => setChangeUI(changeUI === 'true' ? 'false' : 'true')} className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#333333] hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-200 flex justify-center items-center">
                    {changeUI === 'true' ? <CircleCheck color={theme === 'light' ? '#22c55e' : '#22c55e'} /> : <CircleX color={'#ef4444'} />}
                </button>
            </Option>
            <Option title="Delete saved codes">
                <button onClick={() => setOpenConfirmationPopup(true)} className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#333333] hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-200 flex justify-center items-center">
                    <Trash2 color={'#ef4444'} />
                </button>
            </Option>
            <Option title="Tab indent">
                <select value={tabIndent} onChange={handleTabIndent} className='cursor-pointer bg-gray-300 text-xl font-semibold dark:bg-[#333333] w-10 h-8 hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-200 flex justify-center items-center text-gray-700 dark:text-zinc-100 rounded-full shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'>
                    <option className='text-black dark:text-zinc-100' value="2">2</option>
                    <option className='text-black dark:text-zinc-100' value="4">4</option>
                    <option className='text-black dark:text-zinc-100' value="6">6</option>
                    <option className='text-black dark:text-zinc-100' value="8">8</option>
                </select>
            </Option>
        </div>
    );
};

export default Options;
