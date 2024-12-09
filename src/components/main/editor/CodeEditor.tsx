import ReactCodeMirror, { EditorState, EditorView, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { indentUnit } from '@codemirror/language';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { getLanguageExtension } from "../../../utils/helper";
import { forwardRef } from "react";
import { CodeEditorProps } from "../../../types/types";

const CodeEditor = forwardRef<ReactCodeMirrorRef, CodeEditorProps>(
    ({ theme, language, fontSize, tabIndent, currentSlug }, editorRef) => {
        return (
            <div className='w-full h-full'>
                <ReactCodeMirror
                    ref={editorRef}
                    theme={theme === 'light' ? githubLight : githubDark}
                    height="100%"
                    width="100%"
                    extensions={[
                        getLanguageExtension(language),
                        indentUnit.of(" ".repeat(tabIndent)),
                        EditorState.readOnly.of(currentSlug === null),
                        EditorView.theme({
                            "&": {
                                fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace !important"
                            }
                        })
                    ]}
                    style={{
                        fontSize: `${fontSize}px`,
                        height: '100%'
                    }}
                />
            </div>
        );
    }
);

export default CodeEditor;