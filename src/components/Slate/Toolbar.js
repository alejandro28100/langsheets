import { Editor } from "react";
import { useSlate } from "slate-react";

function Toolbar() {
    //get the editor reference from the slate context using the hook
    const editor = useSlate();

    //Slate styling methods
    function isMarkActive(format) {
        const marks = Editor.marks(editor);
        return marks[format] === true;
    }

    function toggleMark(format) {
        const isActive = isMarkActive(format)

        if (isActive) {
            Editor.removeMark(editor, format)
        } else {
            Editor.addMark(editor, format, true)
        }
    }

    function handleCreateMissingWord() {
        //Make sure there's text selected
        if (Range.isCollapsed(editor.selection)) {
            alert("Para crear una palabra faltante , seleciona primero la palabra")
            return
        }

        //Asign the property missingWord into the selected text in the editor 
        toggleMark("missingWord")
    }


    return (
        <div style={{ position: "sticky", top: 0, zIndex: 1, padding: "1em", background: "white" }}>
            <button type="button" onClick={e => toggleMark("bold")}> <b>B</b> </button>
            <button type="button" onClick={e => toggleMark("italic")}> <em>I</em> </button>
            <button type="button" onClick={e => toggleMark("underline")} > <u>U</u>  </button>
            <button type="button" onClick={handleCreateMissingWord} title="Selecciona la palabra primero">Crear palabra faltante</button>
        </div>
    )
}

export default Toolbar;