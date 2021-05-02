// @refresh reset
import React, { useEffect, useState, Fragment } from 'react'
import { useParams } from "react-router-dom"
import { Slate, Editable } from "slate-react"

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Slate/Toolbar";
import WorksheetTitle from "../components/WorksheetTitle";

import { Box, Icon, Tooltip, IconButton, ButtonGroup, Text, Grid, GridItem, MenuItem } from "@chakra-ui/react";

import useDocumentTitle from "../hooks/useDocumentTitle";

import { IoIosArrowBack, IoMdPrint } from "react-icons/io"
import { FaSave, FaChalkboardTeacher } from "react-icons/fa";
import useSlateRender from '../hooks/useSlateRender';
import useSlateEditor from '../hooks/useSlateEditor';
import Logo from '../components/Logo';


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
    //Slate editor component
    const editor = useSlateEditor();
    //Slate editor render functions
    const [renderLeaf, renderElement] = useSlateRender({ readOnly: false });

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
            // parse the string and turn it into a valid json object
            result.content = JSON.parse(result.content);

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
            //Turn the content into a stringified json 
            updatedWorksheet.content = JSON.stringify(updatedWorksheet.content);

            //do a fetch request to the server to update the current state
            const response = await updateWorksheetInfo({ body: updatedWorksheet });
            if (!response.ok) throw new Error("Algo salió mal")
            const data = await response.json();
            //Update the state with the latest data from the server
            //But first parse the string and turn it into a valid json object
            data.content = JSON.parse(data.content);

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
    function handlePrint(e) {
        //set print preview scale to 100%
        document.body.style.zoom = "100%";

        //Deselect the button
        e.target.blur();

        //Open the native print browser dialog
        //with a delay to prevent the button tooltip apearing on the printing preview 
        setTimeout(() => {
            window.print();
        }, 500)

    }

    const title = !!worksheet.title
        ? `LangSheets | ${worksheet.title}`
        : "LangSheets";
    useDocumentTitle(title);


    return (
        <Fragment>
            <Navbar
                sm={
                    <Fragment>
                        <MenuItem as="a" href="/" icon={<Icon as={IoIosArrowBack} />}>Regresar</MenuItem>
                        <MenuItem onClick={sentToServer} icon={<Icon as={FaSave} />}>Guardar Actividad</MenuItem>
                        <MenuItem onClick={handlePrint} icon={<Icon as={IoMdPrint} />}>Imprimir Actividad</MenuItem>
                        <MenuItem as="a" target="_blank" referrerPolicy="no-referrer" href={`/worksheets/${id}/practice`} icon={<Icon as={FaChalkboardTeacher} />}>Visualizar Actividad</MenuItem>
                    </Fragment>
                }
                leftActions={
                    <Tooltip label="Regresar">
                        <IconButton size="lg" icon={<Icon as={IoIosArrowBack} />} variant="ghost" colorScheme="blue" as="a" href="/" />
                    </Tooltip>
                }

                rightActions={
                    <Fragment>
                        <ButtonGroup size="lg" variant="ghost" colorScheme="blue" spacing="2">
                            <Tooltip label="Guardar Actividad">
                                <IconButton onClick={sentToServer} icon={<Icon as={FaSave} />} />
                            </Tooltip>
                            <Tooltip label="Imprimir Actividad">
                                <IconButton onClick={handlePrint} icon={<Icon as={IoMdPrint} />} />
                            </Tooltip>

                            <Tooltip label="Visualizar Actividad">
                                <IconButton as="a" target="_blank" referrerPolicy="no-referrer" href={`/worksheets/${id}/practice`} icon={<Icon as={FaChalkboardTeacher} />} />
                            </Tooltip>
                        </ButtonGroup>
                    </Fragment>
                }
            />

            <Grid templateColumns="repeat(12,1fr)" as="form" onSubmit={handleSubmit}>
                <GridItem colSpan={[11, 11, 9]}>

                    <WorksheetTitle {...{ handleChangeProp, sentToServer, title: worksheet.title }} />

                    <Text my="4" fontSize="xl" textAlign="center"
                        sx={{
                            "@media print": {
                                display: "none",
                            }
                        }}
                    >Contenido de la actividad</Text>

                    <Slate
                        {...{
                            editor,
                            value: worksheet.content,
                            onChange: (newContent) => handleChangeProp({ propery: "content", value: newContent })
                        }}
                    >
                        <Toolbar />
                        <Box background="gray.100" py={["5", "7"]} px={["5", "14"]}
                            sx={{
                                "@media print": {
                                    background: "white",
                                }
                            }}>
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
                <GridItem colSpan={[1, 1, 3]} p={{ md: "5" }} flex="1" justifyContent="center" shadow="md"
                    sx={{
                        "@media print": {
                            display: "none",
                        }
                    }}
                >

                    <Box position="sticky" top="0.5" zIndex="docked">
                        <Sidebar {...{ handleChangeProp, sentToServer, lang: worksheet.lang, isPublic: worksheet.isPublic }} />
                    </Box>

                </GridItem>
            </Grid>

            <Box display="none" flexDirection="column" alignItems="flex-start" position="fixed" zIndex="banner" bottom="0.5" width="full"
                sx={{
                    "@media print": {
                        display: "flex",
                    }
                }}
            >
                <Logo size="sm" />
                <Text fontSize="smaller"> {window.location.host}/worksheets/{id}/practice </Text>
            </Box>

        </Fragment >
    )
}



export default Form
