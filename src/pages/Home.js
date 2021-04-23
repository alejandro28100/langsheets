import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { v4 as uuid } from "uuid";

function request({ url, method, body }) {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
}

const Home = () => {
    const history = useHistory();

    const [worksheets, setWorksheets] = useState([]);

    useEffect(() => {
        async function getWorksheets() {
            const response = await request({ url: "http://localhost:3001/worksheets", method: "GET" });
            const data = await response.json();
            console.log(data);
            return data;
        }
        getWorksheets().then((worksheets) => {
            setWorksheets(worksheets);
        })
    }, [])

    useEffect(() => {
        console.log("Worksheets", worksheets);
    }, [worksheets])

    async function handleCreateWorksheet() {
        const body = {
            id: uuid(),
            title: "",
            content: [{
                type: 'paragraph',
                children: [{ text: '' }],
            }],
            createdAt: new Date()
        }
        try {
            //Create a record in the fake db
            const response = await request({
                url: "http://localhost:3001/worksheets", method: "POST", body
            })
            if (!response.ok) throw Error("Algo salió mal :(")

            const record = await response.json();
            //Redirect to the form page with the id of the record created
            history.push(`/worksheets/${record.id}/edit`);
        } catch (err) {
            alert(err);
        }
    }

    async function handleDeleteWorksheet(id) {
        try {

            //Create a record in the fake db
            const response = await request({
                url: `http://localhost:3001/worksheets/${id}`, method: "DELETE"
            })
            if (!response.ok) throw Error("Algo salió mal :(")

            //if the worksheet was successfully deleted, update the state 
            setWorksheets(prevWorksheets => (
                prevWorksheets.filter(
                    worksheet => worksheet.id !== id
                )
            ));

        } catch (err) {
            alert(err);
        }
    }

    const worksheetsHandler = {
        createSheet: handleCreateWorksheet,
        deleteSheet: handleDeleteWorksheet,
    }

    return (
        <div>
            <h1>Mis Worksheets</h1>
            {
                worksheets.length !== 0
                    ? worksheets.map(worksheet =>
                        <WorksheetCard
                            key={worksheet.id}
                            {...{ ...worksheet, ...worksheetsHandler }}
                        />)
                    : <h3>Aun no has creado una worksheet</h3>
            }
            <button onClick={worksheetsHandler.createSheet}>Crear Worksheet</button>
        </div>
    )
}


function WorksheetCard({ lang, title, id, createdAt, deleteSheet }) {
    console.log(lang, title);
    const date = new Date(createdAt);
    const days = date.toLocaleDateString();
    const hours = date.toLocaleTimeString();
    return (
        <div>
            <h3>{title}</h3>
            <p>Idioma : {lang}</p>
            <p>Creada el {days} - {hours} </p>
            <a href={`http://localhost:3000/worksheets/${id}/edit`}>Editar</a>
            <button onClick={e => deleteSheet(id)}>Elimar</button>
            <hr />
        </div>
    )
}

// WorksheetCard.propTypes = {

// }

export default Home
