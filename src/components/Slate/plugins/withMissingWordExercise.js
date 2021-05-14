import { Node, Element, Transforms, Path, Editor } from 'slate';

const withMissingWordExercise = (editor) => {

    const { normalizeNode } = editor;

    editor.normalizeNode = entry => {
        const [node, path] = entry;

        //Check whethert the block is a paragraph or a paragraph-with-missing-word
        if (Editor.isBlock(editor, node) && ["paragraph", "paragraph-with-missing-word"].includes(node.type)) {

            let hasMissingWords = false;

            //Loock for missing word items inside the paragraph
            for (const [child] of Node.descendants(node)) {
                if (child.missingWord) {
                    hasMissingWords = true;
                }
            }

            //Make sure the type of paragraph corresponds 
            //to whether or nor they have a missing word item inside of them

            if (hasMissingWords) {
                if (node.type !== "paragraph-with-missing-word") {
                    return Transforms.setNodes(editor, { type: "paragraph-with-missing-word" }, { at: path });
                };
            } else {
                if (node.type === "paragraph-with-missing-word") {
                    return Transforms.setNodes(editor, { type: "paragraph" }, { at: path });
                }
            }

        }

        if (Node.isNode(node) && Element.isElement(node)) {
            const firstNodePath = Node.first(editor, path)[1];
            const lastNodePath = Node.last(editor, path)[1];

            for (const [child, childPath] of Node.children(editor, path)) {

                if (child.missingWord === true) {
                    // If the node is the last child, 
                    // insert child with an space after it
                    if (Path.equals(childPath, lastNodePath)) {
                        return Transforms.insertNodes(editor, { text: " " }, {
                            at: Path.next(childPath),
                            select: true,
                            hanging: true
                        })
                    }

                    // If the node is the first child, insert an empty node before
                    if (Path.equals(childPath, firstNodePath)) {
                        return Transforms.insertNodes(editor, { text: ' ' },
                            {
                                at: childPath,
                                select: true,
                                hanging: true
                            }
                        );
                    }

                    //If the blank space has a next sibling with no space , insert one
                    if (Node.has(editor, Path.next(childPath))) {
                        let { text } = Node.get(editor, Path.next(childPath));
                        if (text[0] !== ' ') {
                            return Transforms.insertText(editor, ' ', {
                                at: { path: Path.next(childPath), offset: 0 }
                            });
                        }
                    }

                }
            }
        }
        normalizeNode(entry);
    }
    return editor;
}

export default withMissingWordExercise;