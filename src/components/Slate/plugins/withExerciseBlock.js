import { Transforms, Node, Path } from 'slate';

const withExerciseBlock = (editor) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = entry => {
        const [node, path] = entry;
        if (node.type === 'exercise-block') {

            //Add a paragraph below if there's not a block below the exercise block 
            if (!Node.has(editor, Path.next(path))) {
                return Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "" }] }, { at: Path.next(path) });
            }

            // if (!Node.has(editor, Path.previous(path))) {
            //     console.log("Paragraph inserted");
            //     return Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "" }] }, { at: Path.previous(path) });
            // }

        }
        normalizeNode(entry);
    }
    return editor;
};


export default withExerciseBlock;
