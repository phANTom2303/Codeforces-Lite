
import { EditorView } from '@uiw/react-codemirror';

export const loadCodeWithCursor = (editor: any, code: string) => {
    const cursorPosition = code.indexOf('$0');
    let cleanedCode = code.replace(/\$0/g, '');

    editor.view?.dispatch({
        changes: { from: 0, to: editor.view.state.doc.length, insert: cleanedCode },
    });

    if (cursorPosition !== -1) {
        editor.view.focus();
        editor.view.dispatch({
            selection: { anchor: cursorPosition },
            scrollIntoView: true,
        });

        editor.view.dispatch({
            selection: { anchor: cursorPosition, head: cursorPosition },
            effects: EditorView.scrollIntoView(cursorPosition, { x: "center", y: "center" })
        });
    }
};
