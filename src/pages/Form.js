// @refresh reset
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams } from "react-router-dom"
import { createEditor, Transforms, Text, Editor, Range } from 'slate'
import { Slate, Editable, withReact, useSlate } from "slate-react"
import Leaf from "../components/Slate/Leaf";
import { deserializeSlateContent, serializeSlateContent } from '../utils';

const defaultValue = {
    "title": "",
    "content": [
        {
            "type": "paragraph",
            "children": [
                {
                    "text": ""
                }
            ]
        }
    ]
}

const Form = () => {
    //Get the id of the worksheet from the url 
    const { id } = useParams();
    // Keep track of state for the value of the editor.

    const [worksheet, setWorksheet] = useState(defaultValue);

    useEffect(() => {

        async function getWorksheetInfo() {
            try {
                const response = await fetch(`http://localhost:3001/worksheets/${id}`);
                if (!response.ok) throw new Error("Algo salió mal")
                const json = await response.json();
                return json;
            } catch (error) {
                alert(error)
            }
        }
        //get and set the initial state from the fake server
        getWorksheetInfo().then(result => {
            // deserialize the string and turn it into a valid json object
            result.content = deserializeSlateContent(result.content);

            setWorksheet(result);
        })

    }, [id])

    //Slate editor component
    const editor = useMemo(() => withReact(createEditor()), [])

    //method to render leaves in the slate editor
    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    // //Slate styling methods
    // function isMarkActive(format) {
    //     const marks = Editor.marks(editor);
    //     return marks[format] === true;
    // }
    // function toggleMark(format) {
    //     const isActive = isMarkActive(format)
    //     // console.log(isActive);
    //     if (isActive) {
    //         Editor.removeMark(editor, format)
    //     } else {
    //         Editor.addMark(editor, format, true)
    //     }
    // }
    // function handleCreateMissingWord() {
    //     //Make sure there's text selected
    //     if (Range.isCollapsed(editor.selection)) {
    //         alert("Para crear una palabra faltante , seleciona primero la palabra")
    //         return
    //     }
    //     //Asign the property missingWord into the selected text in the editor 
    //     Transforms.setNodes(
    //         editor,
    //         { missingWord: true },
    //         { match: n => Text.isText(n), split: true }
    //     )
    // }


    //Worksheet methods
    function updateWorksheetInfo({ body }) {
        return fetch(`http://localhost:3001/worksheets/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    };

    async function sentToServer() {
        try {
            let updatedWorksheet = { ...worksheet };
            //Turn the content (json) into a string 
            updatedWorksheet.content = serializeSlateContent(updatedWorksheet.content);

            //do a fetch request to the server to update the current state
            const response = await updateWorksheetInfo({ body: updatedWorksheet });
            if (!response.ok) throw new Error("Algo salió mal")
            const data = await response.json();
            //Update the state with the latest data from the server
            //But first deserialize the string and turn it into a valid json object
            data.content = deserializeSlateContent(data.content);
            setWorksheet(data);
            // console.log("Data updated from the server", data);
        } catch (error) {
            alert(error);
        }
    }

    async function handleChangeProp({ propery, value }) {
        setWorksheet(prevValue => {
            return { ...prevValue, [propery]: value }
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        sentToServer();
    }


    return (
        <form onSubmit={handleSubmit}>
            <a href="/">Regresar</a>
            <h2>Fill in the blanks Worksheet Form</h2>

            <button type="submit">Guardar Worksheet</button>
            <br />
            <br />
            <a target="_blank" rel="noreferrer" href={`/worksheets/${id}/practice`}>Visualizar Actividad</a>
            <br />
            <br />
            <label htmlFor="language">Idioma</label>
            <select
                required
                id="language"
                onBlur={sentToServer}
                value={worksheet.lang}
                onChange={e => handleChangeProp({ propery: "lang", value: e.target.value })}
            >
                <option value="de">Alemán</option>
                <option value="es">Español</option>
                <option value="fr">Francés</option>
                <option value="en">Inglés</option>
                <option value="ru">Ruso</option>
                <option value="zh">Chino</option>
                <option value="ja">Japonés</option>
            </select>
            <br />
            <br />
            <label htmlFor="title">Título de la actividad</label>
            <input
                required
                id="title"
                value={worksheet.title}
                onBlur={sentToServer}
                onChange={e => handleChangeProp({ propery: "title", value: e.target.value })}
                type="text"
                placeholder="Escribe un tílulo aquí..."
            />
            <br />
            <p>Contenido de la actividad</p>
            <Slate
                editor={editor}
                value={worksheet.content}
                onChange={newContent => handleChangeProp({ propery: "content", value: newContent })}
            >
                <Toolbar />

                <Editable renderLeaf={renderLeaf} required
                    style={{ textAlign: "left", background: "white", margin: "1em 5em", padding: "2em" }}
                    placeholder="Escribe aquí..." />
            </Slate>

        </form>
    )
}



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


export default Form
