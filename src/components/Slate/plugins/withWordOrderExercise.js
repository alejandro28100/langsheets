import { Node, Element, Transforms, Path, Editor } from 'slate';

const withWordOrderExercise = (editor) => {

    const { normalizeNode } = editor;

    editor.normalizeNode = entry => {
        const [node, path] = entry;

        //Check whether the block is a paragraph or a word-order-exercise-paragraph
        if (Editor.isBlock(editor, node) && ["paragraph", "word-order-exercise-paragraph"].includes(node.type)) {

            let hasDivisions = false;

            const nodeString = Node.string(node);
            const divisions = nodeString.split("/");

            if (divisions.length > 1) {
                hasDivisions = true;
            }

            //Make sure the type of paragraph corresponds 
            //to whether or nor they have divisions inside of them

            if (hasDivisions) {
                if (node.type !== "word-order-exercise-paragraph") {
                    return Transforms.setNodes(editor, { type: "word-order-exercise-paragraph" }, { at: path });
                };
            } else {
                if (node.type === "word-order-exercise-paragraph") {
                    return Transforms.setNodes(editor, { type: "paragraph" }, { at: path });
                }
            }

        }

        normalizeNode(entry);
    }
    return editor;
}

export default withWordOrderExercise;