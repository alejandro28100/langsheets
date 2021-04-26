import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { v4 as uuid } from "uuid";

import WorksheetCard from "../components/WorksheetCard";
import { serializeSlateContent } from '../utils';

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
            content: serializeSlateContent([{
                type: 'paragraph',
                children: [{ text: '' }],
            }]),
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
            <button onClick={worksheetsHandler.createSheet}>Crear Worksheet</button>
            {
                worksheets.length !== 0
                    ? worksheets.map(worksheet =>
                        <WorksheetCard
                            key={worksheet.id}
                            {...{ ...worksheet, ...worksheetsHandler }}
                        />)
                    : <h3>Aun no has creado una worksheet</h3>
            }

        </div>
    )
}


export default Home