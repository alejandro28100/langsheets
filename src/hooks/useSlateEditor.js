import { useMemo } from 'react'
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from "slate-history";

//slate Custom plugins
import { withMissingWord, withTextAlignment } from "../components/Slate/plugins";

function useSlateEditor() {
    const editor = useMemo(() =>
        withTextAlignment(withMissingWord(
            withHistory(withReact(createEditor()))
        ))
        , [])
    return editor;
}

export default useSlateEditor
