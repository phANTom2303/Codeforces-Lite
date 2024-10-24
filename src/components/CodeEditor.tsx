import ReactCodeMirror, { EditorState, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { indentUnit } from '@codemirror/language';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { getLanguageExtension } from "../utils/helper";
import { forwardRef } from "react";
import { CodeEditorProps } from "../types/types";

const CodeEditor = forwardRef<ReactCodeMirrorRef, CodeEditorProps>(
    ({ theme, language, fontSize, tabIndent, currentSlug }, editorRef) => {
        return (
            <div className='text-left mt-2'>
                <ReactCodeMirror
                    ref={editorRef}
                    theme={theme === 'light' ? githubLight : githubDark}
                    height="75vh"
                    width='98vw'
                    extensions={[getLanguageExtension(language), indentUnit.of(" ".repeat(tabIndent)), EditorState.readOnly.of(currentSlug === null)]}
                    style={{ fontSize: `${fontSize}px`, fontFamily: `'Fira Code', monospace` }}
                />
            </div>
        );
    }
);

export default CodeEditor;
