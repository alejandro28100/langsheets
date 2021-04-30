import { Editor, Transforms } from "slate";

function isBlockActive(key, format, editor) {
    if (!editor) return false;
    //get the node in the current selection that matches the format given
    const [match] = Editor.nodes(editor, {
        match: n => n[key] === format,
    })
    return !!match
}

function toggleBlock(key, format, editor) {
    const isActive = isBlockActive(key, format, editor);
    Transforms.setNodes(
        editor,
        { [key]: isActive ? null : format },
        { match: n => Editor.isBlock(editor, n) }
    );
}

function isMarkActive(format, editor) {
    if (!editor) return false;
    //get the marks (style marks) in the current selection
    const marks = Editor.marks(editor);
    if (!marks) return false
    return marks[format] === true;
}

function toggleMark(format, editor) {
    if (!editor) return
    const isActive = isMarkActive(format, editor)

    if (isActive) {
        return Editor.removeMark(editor, format)
    }

    return Editor.addMark(editor, format, true)

}

export {
    isBlockActive,
    toggleBlock,
    isMarkActive,
    toggleMark
}