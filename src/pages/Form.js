// @refresh reset
import React, { useEffect, useState, Fragment } from 'react'
import { useParams } from "react-router-dom"
import { Slate, Editable } from "slate-react"

import { deserializeSlateContent, serializeSlateContent } from '../utils';

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Slate/Toolbar";
import WorksheetTitle from "../components/WorksheetTitle";

import { Box, Icon, Tooltip, IconButton, ButtonGroup, Text, Grid, GridItem } from "@chakra-ui/react";


import { IoIosArrowBack } from "react-icons/io"
import { FaSave, FaChalkboardTeacher } from "react-icons/fa";
import useSlateRender from '../hooks/useSlateRender';
import useSlateEditor from '../hooks/useSlateEditor';


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

    //Slate editor component
    const editor = useSlateEditor();
    //Slate editor render functions
    const [renderLeaf, renderElement] = useSlateRender();

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
            alert("Actividad Guardada");
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
        <Fragment>
            <Navbar
                leftActions={
                    <Tooltip label="Regresar">
                        <IconButton icon={<Icon as={IoIosArrowBack} />} variant="ghost" color="white" _hover={{ background: "var(--chakra-colors-whiteAlpha-300)" }} as="a" href="/" />
                    </Tooltip>
                }
                rightActions={
                    <Fragment>
                        <ButtonGroup size="lg" variant="ghost" spacing="2">
                            <Tooltip label="Guardar Actividad">
                                <IconButton onClick={sentToServer} color="white" _hover={{ background: "var(--chakra-colors-whiteAlpha-300)" }} icon={<Icon as={FaSave} />} />
                            </Tooltip>
                            <Tooltip label="Visualizar Actividad">
                                <IconButton as="a" target="_blank" referrerPolicy="no-referrer" href={`/worksheets/${id}/practice`} color="white" _hover={{ background: "var(--chakra-colors-whiteAlpha-300)" }} icon={<Icon as={FaChalkboardTeacher} />} />
                            </Tooltip>
                        </ButtonGroup>
                    </Fragment>
                }
            />

            <Grid templateColumns="repeat(12,1fr)" as="form" onSubmit={handleSubmit}>
                <GridItem colSpan={[11, 11, 9]}>

                    <WorksheetTitle {...{ handleChangeProp, sentToServer, title: worksheet.title }} />

                    <Text my="4" fontSize="xl" textAlign="center">Contenido de la actividad</Text>

                    <Slate
                        {...{
                            editor,
                            value: worksheet.content,
                            onChange: (newContent) => handleChangeProp({ propery: "content", value: newContent })
                        }}
                    >
                        <Toolbar />
                        <Box background="gray.100" py={["5", "7"]} px={["5", "14"]}>
                            <Box
                                background="white"
                                p="5"
                                as={Editable}
                                {...{
                                    renderElement,
                                    renderLeaf,
                                    placeholder: "Escribe aquí...",
                                    required: true,
                                }}
                            />
                        </Box>
                    </Slate>

                </GridItem>
                <GridItem colSpan={[1, 1, 3]} p="5" flex="1" justifyContent="center" shadow="md">

                    <Box position="sticky" top="0.5" zIndex="sticky">
                        <Sidebar {...{ handleChangeProp, sentToServer, lang: worksheet.lang, isPublic: worksheet.isPublic }} />
                    </Box>

                </GridItem>
            </Grid>

        </Fragment >
    )
}



export default Form
