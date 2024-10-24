import { useState } from 'react';
import './App.css';
import Extension from './components/Main';
import Options from './components/Settings';

const App = () => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">((localStorage.getItem('theme') as "light" | "dark") || "dark");
  const [tabIndent, setTabIndent] = useState(parseInt(localStorage.getItem('tabIndent') || '4'));


  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className={`w-full h-full`}>
        <Extension theme={theme} setShowOptions={setShowOptions} tabIndent={tabIndent} />
      </div>

      {/* Sliding Options Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-full bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${showOptions ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <Options setShowOptions={setShowOptions} theme={theme} setTheme={setTheme} tabIndent={tabIndent} setTabIndent={setTabIndent} />
      </div>
    </div>
  );
};

export default App;
