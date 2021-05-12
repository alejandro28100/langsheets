import { Transforms, Element, Node, Editor, Path } from 'slate';

const withExerciseBlock = (editor) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = entry => {
        const [node, path] = entry;
        //insert a paragraph block below the exercise-block 
        // to allow user to continue writing outside the exercise - block
        if (Editor.isBlock(editor, node) && Node.last(editor, path) && node.type === "exercise-block") {
            Transforms.insertNodes(editor,
                {
                    type: "paragraph", children: [{ text: "" }]
                },
                { at: Path.next(path) }
            )
            return;
        }
        normalizeNode(entry);
    }
    return editor;
};


export default withExerciseBlock;
