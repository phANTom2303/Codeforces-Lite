import { CloudUpload, Code2, RotateCcw, Settings } from 'lucide-react';
import { TopBarProps } from '../types/types';
import { useState } from 'react';
import Timer from './CodeTimer';

const TopBar: React.FC<TopBarProps> = ({
    theme,
    handleClick,
    setShowOptions,
    language,
    handleLanguageChange,
    fontSize,
    handleFontSizeChange,
    handleResetCode,
    currentSlug
}) => {

    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    if (showTooltip) {
        console.log("showTooltip is true");
    }

    return (
        <>
            <div className='w-full flex border-b border-gray-500 justify-between text-xl text-black py-2 px-2'>
                <h1 className='flex justify-center items-center gap-2 font-[600] text-black'>
                    <Code2 size={20} color='green' />
                </h1>
                <div className='flex justify-center items-center gap-3'>
                    <Timer theme={theme} />
                    <div className="relative inline-block">
                        <button
                            disabled={!currentSlug}
                            onClick={handleClick}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className={`${!currentSlug && "cursor-not-allowed"} bg-green-500 text-white dark:text-zinc-950 font-[600] text-sm px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 flex justify-center items-center gap-2`}
                        >
                            <CloudUpload size={16} />
                            <span>Submit</span>
                        </button>

                        {showTooltip && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-28 bg-gray-200 dark:bg-[#222222] text-white text-xs rounded-lg text-center py-1 shadow-lg">
                                <span className="dark:text-white text-black"><kbd className="border border-gray-600 px-1 rounded">Ctrl</kbd> + <kbd className="border border-gray-600 px-1 rounded">Enter</kbd></span>
                            </div>
                        )}
                    </div>
                </div>
                <div className='cursor-pointer flex justify-center items-center' onClick={() => setShowOptions(true)}>
                    <Settings color={theme === 'light' ? '#444444' : '#ffffff'} size={20} />
                </div>
            </div>

            <div className='w-full flex items-center justify-between py-2 px-2'>
                <div className='text-black flex items-center gap-2'>
                    {/* Language Selector */}
                    <select disabled={!currentSlug} value={language} onChange={handleLanguageChange} className={`${!currentSlug && "cursor-not-allowed"} bg-white dark:bg-zinc-800 border border-gray-300 text-gray-700 dark:text-zinc-100 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}>
                        <option className='text-black dark:text-zinc-100' value="cpp">C++</option>
                        <option className='text-black dark:text-zinc-100' value="java">Java</option>
                        <option className='text-black dark:text-zinc-100' value="python">Python</option>
                        <option className='text-black dark:text-zinc-100' value="javascript">JavaScript</option>
                        <option className='text-black dark:text-zinc-100' value="kotlin">Kotlin</option>
                    </select>

                    {/* Font Size Selector */}
                    <select disabled={!currentSlug} value={fontSize} onChange={handleFontSizeChange} className={`${!currentSlug && "cursor-not-allowed"} bg-white dark:bg-zinc-800 border border-gray-300 text-gray-700 dark:text-zinc-100 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}>
                        <option className='text-black dark:text-zinc-100' value="12">12px</option>
                        <option className='text-black dark:text-zinc-100' value="14">14px</option>
                        <option className='text-black dark:text-zinc-100' value="16">16px</option>
                        <option className='text-black dark:text-zinc-100' value="18">18px</option>
                        <option className='text-black dark:text-zinc-100' value="20">20px</option>
                    </select>
                </div>
                <div className={`${!currentSlug && "cursor-not-allowed"} flex items-center gap-3`}>
                    <RotateCcw color={theme === 'light' ? '#666666' : '#ffffff'} size={16} className='cursor-pointer' onClick={handleResetCode} />
                </div>
            </div>
        </>
    )
}

export default TopBar