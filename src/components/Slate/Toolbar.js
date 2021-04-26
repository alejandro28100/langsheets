import { Editor, Transforms, Range } from "slate";
import { useSlate } from "slate-react";
import PropTypes from "prop-types";

function isBlockActive(format, editor) {
    if (!editor) return false;
    //get the node in the current selection that matches the format given
    const [match] = Editor.nodes(editor, {
        match: n => n.type === format,
    })
    return !!match
}

function toggleBlock(format, editor) {
    const isActive = isBlockActive(format, editor);
    Transforms.setNodes(
        editor,
        { type: isActive ? 'paragraph' : format },
        // { match: n => Editor.isBlock(editor, n) }
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
    // console.log(format, editor);
    const isActive = isMarkActive(format, editor)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

function Toolbar() {
    //get the editor reference from the slate context using the hook
    const editor = useSlate();

    function handleCreateMissingWord() {
        console.log("Clicked");
        //Make sure there's text selected
        if (Range.isCollapsed(editor.selection)) {
            alert("Para crear una palabra faltante , seleciona primero la palabra")
            return
        }

        //Asign the property missingWord into the selected text in the editor 
        toggleMark("missingWord", editor)
    }

    return (
        <div className="toolbar" style={{ position: "sticky", top: 0, zIndex: 1, padding: "1em", background: "white" }}>

            <ToolbarButton type="block" label="Título" format="title">
                Título
            </ToolbarButton>

            <ToolbarButton type="block" label="Subtítulo" format="subtitle">
                Subtítulo
            </ToolbarButton>

            <ToolbarButton type="mark" label="Negrita" format="bold">
                <b>B</b>
            </ToolbarButton>

            <ToolbarButton type="mark" label="Cursiva" format="italic">
                <em>I</em>
            </ToolbarButton>

            <ToolbarButton type="mark" label="Subrayado" format="underline">
                <u>U</u>
            </ToolbarButton>

            <ToolbarButton type="mark" format="missingWord" label="Crear palabra faltante" customOnClick={handleCreateMissingWord}>
                Palabra faltante
            </ToolbarButton>

        </div>
    )
}


const ToolbarButton = ({ children, format, label, type, customOnClick }) => {

    const editor = useSlate();

    function handleClick() {
        if (typeof customOnClick === "function") {
            //run custom click function
            customOnClick.call()
        } else {
            type === "mark" ? toggleMark(format, editor) : toggleBlock(format, editor)
        }
    }

    function handleClass() {
        if (type === "mark") {
            // console.log(isMarkActive(format, editor) ? "isActive" : "")
            return isMarkActive(format, editor) ? "isActive" : "";

        } else if (type === "block") {
            return isBlockActive(format, editor) ? "isActive" : "";
        }
    }


    return (
        <button className={handleClass()} title={label} type="button"
            onClick={handleClick}
        >
            {children}
        </button>
    )
}

ToolbarButton.defaultProps = {
    onClick: undefined,
}

ToolbarButton.propTypes = {
    customOnClick: PropTypes.func,
    format: PropTypes.string,
    type: PropTypes.oneOf(["mark", "block"]),
    children: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
}

export default Toolbar;