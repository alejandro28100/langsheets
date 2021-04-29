import { useMemo } from 'react'
import { createEditor } from 'slate';
import { withReact } from 'slate-react';

//slate plugins
import withMissingWord from "../components/Slate/plugins/withMissingWord";

function useSlateEditor() {
    const editor = useMemo(() => withMissingWord(withReact(createEditor())), [])
    return editor;
}

export default useSlateEditor
