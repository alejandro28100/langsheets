import { useCallback } from "react";
import { Node, Text } from "slate";

export default function useSlateDecorate(editor) {

    return useCallback(([node, path]) => {
        const ranges = [];

        if (Text.isText(node)) {
            const parent = Node.parent(editor, path);

            if (parent.type === "word-order-exercise-paragraph") {
                const { text } = node
                const parts = text.split("/")
                let offset = 0;

                parts.forEach((part, index) => {
                    if (index !== 0) {
                        ranges.push({
                            anchor: { path, offset: offset - 1 },
                            focus: { path, offset },
                            division: true,
                        })
                    }

                    offset = offset + part.length + 1;
                })
            }
        }
        return ranges
    }, [editor])
}