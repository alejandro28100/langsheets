import { Transforms } from 'slate';

const withTextAlignment = (editor) => {
	const { normalizeNode } = editor;

	editor.normalizeNode = (entry) => {
		const [node, path] = entry;

		// make sure, every paragraph has a standard alignment of 'left'
		if (node.type === 'paragraph' && !node.alignment) {
			Transforms.setNodes(editor, { textAlign: 'left' }, { at: path });
			return;
		}

		//Default Behaviour
		normalizeNode(entry);
	};
	return editor;
};
export default withTextAlignment;
