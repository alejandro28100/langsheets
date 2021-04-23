// @refresh reset
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from "react-router-dom"
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from "slate-react"

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
    const [worksheet, setWorksheet] = useState(defaultValue)

    const editor = useMemo(() => withReact(createEditor()), [])

    function updateWorksheetInfo({ body }) {
        return fetch(`http://localhost:3001/worksheets/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    };

    async function getWorksheetInfo() {
        try {
            const response = await fetch(`http://localhost:3001/worksheets/${id}`);
            if (!response.ok) throw new Error("Algo salió mal")
            const json = await response.json();
            // console.log(json);
            return json;
        } catch (error) {
            alert(error)
        }

    }

    useEffect(() => {
        //get and set the initial state from the fake server
        getWorksheetInfo().then(result => {
            setWorksheet(result);
        })

    }, [])


    async function sentToServer() {
        try {
            //do a fetch request to the server to update the current state
            const response = await updateWorksheetInfo({ body: worksheet });
            if (!response.ok) throw new Error("Algo salió mal")
            const data = await response.json();
            //Update the state with the latest data from the server
            setWorksheet(data);
            console.log("Data updated from the server", data);
        } catch (error) {
            alert(error);
        }
    }

    async function handleChangeProp({ propery, value }) {
        setWorksheet(prevValue => {
            return { ...prevValue, [propery]: value }
        })
    }

    return (
        <div>
            <a href="/">Regresar</a>
            <h1>Missing Word Worksheet Form</h1>
            <label htmlFor="language">Idioma</label>
            <select
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
            <label htmlFor="title">Título de la actividad</label>
            <input
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
                <Editable onBlur={sentToServer} style={{ textAlign: "left" }} placeholder="Escribe aquí..." />
            </Slate>
            <button onClick={sentToServer}>Guardar Worksheet</button>
        </div>
    )
}


export default Form
