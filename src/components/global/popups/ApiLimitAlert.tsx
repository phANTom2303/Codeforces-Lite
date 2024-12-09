import React from 'react';
import PopupModal from './PopupModal';
import PopupBox from './PopupBox';

interface ApiLimitAlertProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const ApiLimitAlert: React.FC<ApiLimitAlertProps> = ({ isOpen, setIsOpen }) => {
    return (
        <PopupModal isOpen={isOpen} setIsOpen={setIsOpen}>
            <PopupBox 
                isOpen={isOpen} 
                setIsOpen={setIsOpen} 
                title="API Limit Exceeded" 
                customClass="max-w-xs"
                popupHeight="h-auto"
            >
                <div className="text-gray-700 dark:text-darkText-400">
                    <p className="mb-4 text-sm">
                        API rate limit exceeded.
                    </p>
                    <div className="mb-6 text-sm">
                        <a 
                            href="https://platform.sulu.sh/portal/consumer/dashboard?period=7_days"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                            Subscribe to a plan
                        </a>
                        <span className="text-gray-600 dark:text-gray-300"> or use another account.</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </PopupBox>
        </PopupModal>
    );
};

export default ApiLimitAlert;
