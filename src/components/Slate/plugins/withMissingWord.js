import { Node, Element, Transforms, Path } from 'slate';

const withBlankSpace = (editor) => {

    const { normalizeNode } = editor;

    editor.normalizeNode = entry => {
        const [node, path] = entry;

        if (Element.isElement(node)) {
            const firstNodePath = Node.first(editor, path)[1];
            const lastNodePath = Node.last(editor, path)[1];

            // console.log(firstNode, lastNode);
            for (const [child, childPath] of Node.children(editor, path)) {

                if (child.missingWord === true) {
                    // If the node is the last child, 
                    // insert child with an space after it
                    if (Path.equals(childPath, lastNodePath)) {
                        Transforms.insertNodes(editor, { text: " " }, {
                            at: Path.next(childPath),
                            select: true,
                            hanging: true
                        })
                    }

                    // If the node is the first child, insert an empty node before
                    if (Path.equals(childPath, firstNodePath)) {
                        Transforms.insertNodes(editor, { text: ' ' },
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
                            Transforms.insertText(editor, ' ', {
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

export default withBlankSpace;