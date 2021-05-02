import { useMemo } from 'react'
import { createEditor } from 'slate';
import { withReact } from 'slate-react';

//slate plugins

import { withMissingWord, withTextAlignment } from "../components/Slate/plugins";

function useSlateEditor() {
    const editor = useMemo(() =>
        withTextAlignment(withMissingWord(withReact(createEditor())))
        , [])
    return editor;
}

export default useSlateEditor
