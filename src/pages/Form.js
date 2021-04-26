// @refresh reset
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams } from "react-router-dom"
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from "slate-react"

import { deserializeSlateContent, serializeSlateContent } from '../utils';
import withMissingWord from "../components/Slate/plugins/withMissingWord";
import Leaf from "../components/Slate/Leaf";

import Toolbar from "../components/Slate/Toolbar";
import LanguagePicker from "../components/LanguagePicker";
import WorksheetTitle from "../components/WorksheetTitle";


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
    const editor = useMemo(() => withMissingWord(withReact(createEditor())), [])

    //method to render leaves in the slate editor
    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

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
            <a target="_blank" rel="noreferrer" href={`/worksheets/${id}/practice`}>
                Visualizar Actividad
            </a>
            <br />
            <br />
            <LanguagePicker {...{ handleChangeProp, sentToServer, lang: worksheet.lang }} />
            <br />
            <br />
            <WorksheetTitle {...{ handleChangeProp, sentToServer, title: worksheet.title }} />
            <br />
            <p>Contenido de la actividad</p>
            <Slate
                editor={editor}
                value={worksheet.content}
                onChange={newContent => handleChangeProp({ propery: "content", value: newContent })}
            >
                <Toolbar />

                <Editable renderLeaf={renderLeaf}
                    required
                    style={{ textAlign: "left", background: "white", margin: ".5em 5em", padding: "2em" }}
                    placeholder="Escribe aquí..." />
            </Slate>

        </form>
    )
}





export default Form
