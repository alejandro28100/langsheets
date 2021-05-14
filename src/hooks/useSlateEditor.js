import { useMemo } from 'react'
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from "slate-history";

//slate Custom plugins
import { withMissingWord, withTextAlignment, withExerciseBlock, withWordOrderExercise } from "../components/Slate/plugins";

function useSlateEditor() {
    const editor = useMemo(() =>
        withTextAlignment(
            withWordOrderExercise(
                withExerciseBlock(
                    withMissingWord(
                        withHistory(
                            withReact(createEditor())
                        )
                    )
                )
            )
        )
        , [])
    return editor;
}

export default useSlateEditor
